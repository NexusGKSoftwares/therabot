import { User, Bot } from 'lucide-react'

function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-4 py-3`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
          isUser 
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
            : 'bg-gradient-to-br from-blue-500 to-indigo-600'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Name & Time */}
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className={`text-xs font-semibold ${isUser ? 'text-emerald-600' : 'text-blue-600'}`}>
              {isUser ? 'You' : 'Therabot'}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(message.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          
          {/* Message Content */}
          <div className={`px-4 py-3 rounded-2xl shadow-sm ${
            isUser 
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-tr-sm' 
              : 'bg-white border border-gray-200 text-gray-700 rounded-tl-sm'
          }`}>
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
