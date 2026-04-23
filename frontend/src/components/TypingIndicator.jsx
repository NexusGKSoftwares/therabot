function TypingIndicator() {
  return (
    <div className="flex justify-start px-4 py-3">
      <div className="flex gap-3 max-w-[85%]">
        {/* Bot Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <div className="w-4 h-4 bg-white/20 rounded-full"></div>
        </div>
        
        {/* Typing Bubble */}
        <div className="flex flex-col items-start">
          <div className="px-4 py-3 bg-white border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
