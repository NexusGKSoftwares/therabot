import { useState, useMemo } from 'react'
import { MessageSquare, Plus, Trash2, Calendar, Clock, ChevronRight, Sparkles } from 'lucide-react'

function Sidebar({ conversations, currentSessionId, onSelectConversation, onNewChat, onDeleteConversation }) {
  const [hoveredId, setHoveredId] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // Deduplicate conversations by sessionId
  const uniqueConversations = useMemo(() => {
    const seen = new Set()
    return conversations.filter(conv => {
      if (seen.has(conv.sessionId)) return false
      seen.add(conv.sessionId)
      return true
    })
  }, [conversations])

  // Group conversations by date
  const groupedConversations = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)

    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      earlier: []
    }

    uniqueConversations.forEach(conv => {
      const convDate = new Date(conv.updatedAt)
      const convDay = new Date(convDate.getFullYear(), convDate.getMonth(), convDate.getDate())

      if (convDay.getTime() === today.getTime()) {
        groups.today.push(conv)
      } else if (convDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(conv)
      } else if (convDay > lastWeek) {
        groups.thisWeek.push(conv)
      } else {
        groups.earlier.push(conv)
      }
    })

    return groups
  }, [uniqueConversations])

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handleDelete = (e, sessionId) => {
    e.stopPropagation()
    if (deleteConfirmId === sessionId) {
      onDeleteConversation(sessionId)
      setDeleteConfirmId(null)
    } else {
      setDeleteConfirmId(sessionId)
      setTimeout(() => setDeleteConfirmId(null), 3000)
    }
  }

  const getPreviewText = (conv) => {
    if (conv.title && conv.title !== 'New Conversation') {
      return conv.title
    }
    return 'New Chat'
  }

  const ConversationItem = ({ conv }) => {
    const isActive = currentSessionId === conv.sessionId
    const isHovered = hoveredId === conv.sessionId
    const isConfirmingDelete = deleteConfirmId === conv.sessionId

    return (
      <div
        key={conv.sessionId}
        onClick={() => onSelectConversation(conv.sessionId)}
        onMouseEnter={() => setHoveredId(conv.sessionId)}
        onMouseLeave={() => setHoveredId(null)}
        className={`group relative flex items-start gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ${isActive
            ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20'
            : 'hover:bg-gray-800/50 border border-transparent'
          }`}
      >
        {/* Icon with status indicator */}
        <div className={`relative flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-emerald-500/20' : 'bg-gray-800 group-hover:bg-gray-700'
          }`}>
          <MessageSquare className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-gray-400 group-hover:text-gray-300'}`} />
          {conv.isCrisisFlagged && (
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-900" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-0.5">
          <p className={`text-sm font-medium truncate transition-colors ${isActive ? 'text-emerald-100' : 'text-gray-200 group-hover:text-white'
            }`}>
            {getPreviewText(conv)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs flex items-center gap-1 ${isActive ? 'text-emerald-400/70' : 'text-gray-500'
              }`}>
              <Clock className="w-3 h-3" />
              {formatTime(conv.updatedAt)}
            </span>
            {conv.messageCount > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500'
                }`}>
                {conv.messageCount} messages
              </span>
            )}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => handleDelete(e, conv.sessionId)}
          className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${isConfirmingDelete
              ? 'bg-red-500/20 text-red-400 opacity-100'
              : isHovered
                ? 'bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/10 opacity-100'
                : 'opacity-0'
            }`}
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-r-full" />
        )}
      </div>
    )
  }

  const GroupSection = ({ title, icon: Icon, conversations: convs, isEmpty }) => {
    if (convs.length === 0) return null

    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <Icon className="w-3.5 h-3.5" />
          {title}
        </div>
        <div className="space-y-1">
          {convs.map(conv => (
            <ConversationItem key={conv.sessionId} conv={conv} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <aside className="w-80 bg-gray-900 text-gray-100 flex flex-col h-full border-r border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white">Therabot</h2>
            <p className="text-xs text-gray-500">Your AI companion</p>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {uniqueConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">No conversations yet</p>
            <p className="text-gray-600 text-xs">Start a new chat to begin</p>
          </div>
        ) : (
          <>
            <GroupSection
              title="Today"
              icon={Clock}
              conversations={groupedConversations.today}
            />
            <GroupSection
              title="Yesterday"
              icon={ChevronRight}
              conversations={groupedConversations.yesterday}
            />
            <GroupSection
              title="This Week"
              icon={Calendar}
              conversations={groupedConversations.thisWeek}
            />
            <GroupSection
              title="Earlier"
              icon={Calendar}
              conversations={groupedConversations.earlier}
            />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-2 py-2 bg-gray-800/50 rounded-xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">AI Assistant Active</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
