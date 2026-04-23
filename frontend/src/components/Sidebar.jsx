import { useState } from 'react'
import { MessageSquare, Plus, Trash2, Clock } from 'lucide-react'

function Sidebar({ conversations, currentSessionId, onSelectConversation, onNewChat, onDeleteConversation }) {
  const [hoveredId, setHoveredId] = useState(null)

  const formatDate = (date) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now - d
    
    if (diff < 86400000) {
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <aside className="w-72 bg-gray-900 text-gray-100 flex flex-col h-full">
      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">New Chat</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No conversations yet
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.sessionId}
              onClick={() => onSelectConversation(conv.sessionId)}
              onMouseEnter={() => setHoveredId(conv.sessionId)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all ${
                currentSessionId === conv.sessionId
                  ? 'bg-gray-800 text-white'
                  : 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-200'
              }`}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{conv.title}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {formatDate(conv.updatedAt)}
                </p>
              </div>
              
              {/* Delete button on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteConversation(conv.sessionId)
                }}
                className={`p-1 rounded hover:bg-gray-700 transition-opacity ${
                  hoveredId === conv.sessionId ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2 px-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <span>Therabot AI</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
