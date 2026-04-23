import { useState, useMemo, createContext, useContext } from 'react'
import { MessageSquare, Plus, Trash2, Calendar, Clock, ChevronRight, Sparkles, Bot, Settings, BarChart3, User } from 'lucide-react'

// Theme System - Faded, muted tones
const THEMES = {
  dark: {
    aside: 'bg-[#1a1f2e]',
    text: 'text-slate-400',
    textMuted: 'text-slate-500',
    textTitle: 'text-slate-200',
    hover: 'hover:bg-white/[0.03]',
    headerBtn: 'bg-white/[0.05] hover:bg-white/[0.08]',
    logoBox: 'border-white/10 bg-white/[0.03]',
    activeBg: 'bg-emerald-600/70 hover:bg-emerald-600/80',
    activeText: 'text-emerald-50',
    parentActive: 'bg-white/[0.05] text-slate-200 hover:bg-white/[0.07]',
    border: 'border-white/[0.06]',
    submenuBorder: 'border-white/[0.08]',
    iconClass: '[&_svg]:text-slate-500',
    popup: 'bg-[#1a1f2e] border-white/[0.08]',
  },
  green: {
    aside: 'bg-[#0d3b2e]',
    text: 'text-emerald-100/60',
    textMuted: 'text-emerald-100/40',
    textTitle: 'text-emerald-50/90',
    hover: 'hover:bg-white/[0.04]',
    headerBtn: 'bg-white/[0.05] hover:bg-white/[0.08]',
    logoBox: 'border-white/10 bg-white/[0.03]',
    activeBg: 'bg-emerald-700/60 hover:bg-emerald-700/70',
    activeText: 'text-emerald-50/95',
    parentActive: 'bg-white/[0.05] text-emerald-50/90 hover:bg-white/[0.07]',
    border: 'border-white/[0.06]',
    submenuBorder: 'border-white/[0.08]',
    iconClass: '[&_svg]:text-emerald-200/70',
    popup: 'bg-[#0d3b2e] border-white/[0.08]',
  }
}

const SidebarThemeContext = createContext({ theme: 'green' })

const ThemedIcon = ({ children }) => {
  const { theme } = useContext(SidebarThemeContext)
  const iconClass = THEMES[theme]?.iconClass || THEMES.green.iconClass
  return <span className={`${iconClass} [&_svg]:stroke-[2px] shrink-0`}>{children}</span>
}

function Sidebar({ conversations, currentSessionId, onSelectConversation, onNewChat, onDeleteConversation, theme = 'green' }) {
  const [hoveredId, setHoveredId] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const currentTheme = THEMES[theme] || THEMES.green

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
      <SidebarThemeContext.Provider value={{ theme }}>
        <div
          key={conv.sessionId}
          onClick={() => onSelectConversation(conv.sessionId)}
          onMouseEnter={() => setHoveredId(conv.sessionId)}
          onMouseLeave={() => setHoveredId(null)}
          className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 border ${isActive
            ? `${currentTheme.parentActive} ${currentTheme.submenuBorder}`
            : `${currentTheme.hover} border-transparent`
            }`}
        >
          {/* Icon with status indicator */}
          <div className={`relative flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${isActive
            ? 'bg-white/15 shadow-inner'
            : 'bg-white/5 group-hover:bg-white/10'
            }`}>
            <ThemedIcon>
              <MessageSquare className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
            </ThemedIcon>
            {conv.isCrisisFlagged && (
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-current" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 py-0.5">
            <p className={`text-sm font-medium truncate transition-colors ${isActive ? currentTheme.textTitle : currentTheme.text
              }`}>
              {getPreviewText(conv)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs flex items-center gap-1 ${isActive ? currentTheme.text : currentTheme.textMuted
                }`}>
                <Clock className="w-3 h-3" />
                {formatTime(conv.updatedAt)}
              </span>
              {conv.messageCount > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive
                  ? 'bg-white/15 text-white'
                  : 'bg-white/5 text-white/60'
                  }`}>
                  {conv.messageCount} msgs
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
                ? 'bg-white/10 text-white/70 hover:text-red-400 hover:bg-red-500/10 opacity-100'
                : 'opacity-0'
              }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Active indicator - NexusGK style */}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/90 rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          )}
        </div>
      </SidebarThemeContext.Provider>
    )
  }

  const GroupSection = ({ title, icon: Icon, conversations: convs }) => {
    if (convs.length === 0) return null

    return (
      <SidebarThemeContext.Provider value={{ theme }}>
        <div className="mb-4">
          <div className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider ${currentTheme.textMuted}`}>
            <Icon className="w-3.5 h-3.5" />
            {title}
          </div>
          <div className="space-y-1">
            {uniqueConversations.filter(conv =>
              convs.some(c => c.sessionId === conv.sessionId)
            ).map(conv => (
              <ConversationItem key={conv.sessionId} conv={conv} />
            ))}
          </div>
        </div>
      </SidebarThemeContext.Provider>
    )
  }

  return (
    <SidebarThemeContext.Provider value={{ theme }}>
      <aside className={`w-80 ${currentTheme.aside} ${currentTheme.text} flex flex-col h-full border-r ${currentTheme.border}`}>
        {/* Header - NexusGK Style */}
        <div className={`p-4 border-b ${currentTheme.border}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-11 h-11 ${currentTheme.logoBox} border rounded-xl flex items-center justify-center`}>
              <Bot className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className={`font-bold ${currentTheme.textTitle} text-lg`}>Therabot</h2>
              <p className={`text-xs ${currentTheme.textMuted}`}>AI Mental Health Companion</p>
            </div>
          </div>

          {/* New Chat Button - NexusGK Style */}
          <button
            onClick={onNewChat}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 ${currentTheme.activeBg} ${currentTheme.activeText} rounded-xl font-semibold transition-all shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 group active:scale-[0.98]`}
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <div className={`px-4 py-3 border-b ${currentTheme.border}`}>
          <nav className="space-y-1">
            <button
              onClick={() => window.location.href = '/settings'}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}
            >
              <ThemedIcon><Settings className="w-4 h-4" /></ThemedIcon>
              <span className="text-sm font-medium">Settings</span>
            </button>
            <button
              onClick={() => window.location.href = '/analytics'}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}
            >
              <ThemedIcon><BarChart3 className="w-4 h-4" /></ThemedIcon>
              <span className="text-sm font-medium">Mood Analytics</span>
            </button>
            <button
              onClick={() => window.location.href = '/profile'}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${currentTheme.hover} ${currentTheme.text} transition-colors`}
            >
              <ThemedIcon><User className="w-4 h-4" /></ThemedIcon>
              <span className="text-sm font-medium">Profile</span>
            </button>
          </nav>
        </div>

        {/* Conversations List */}
        <div className={`flex-1 overflow-y-auto px-2 py-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20`}>
          {uniqueConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className={`w-16 h-16 ${currentTheme.logoBox} border rounded-2xl flex items-center justify-center mb-4`}>
                <MessageSquare className="w-8 h-8 text-white/40" />
              </div>
              <p className={`${currentTheme.text} text-sm font-medium mb-1`}>No conversations yet</p>
              <p className={`${currentTheme.textMuted} text-xs`}>Start a new chat to begin</p>
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

        {/* Footer - NexusGK Style */}
        <div className={`p-4 border-t ${currentTheme.border}`}>
          <div className={`flex items-center gap-3 px-3 py-2.5 ${currentTheme.logoBox} border rounded-xl`}>
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-75" />
            </div>
            <span className={`text-xs ${currentTheme.textMuted}`}>AI Assistant Active</span>
          </div>
        </div>
      </aside>
    </SidebarThemeContext.Provider>
  )
}

export default Sidebar
