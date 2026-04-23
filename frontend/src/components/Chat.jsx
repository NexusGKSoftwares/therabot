import { useState, useEffect, useRef } from 'react'
import { Send, AlertTriangle, LogOut, Sparkles, Lock, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'
import Header from './Header'

function Chat() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [showCrisisWarning, setShowCrisisWarning] = useState(false)
  const [conversations, setConversations] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()
  const { user, logout, isAnonymous, anonymousMessageCount, anonymousLimit, incrementAnonymousMessage, hasReachedAnonymousLimit } = useAuth()

  const API_URL = '/api/chat'

  // Fetch conversations list
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/conversations`)
      const data = await res.json()
      setConversations(data)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Start new conversation
  const startNewChat = async () => {
    try {
      const res = await fetch(`${API_URL}/new`, { method: 'POST' })
      const data = await res.json()
      setSessionId(data.sessionId)
      setMessages([{
        role: 'assistant',
        content: data.welcomeMessage.content,
        timestamp: new Date(data.welcomeMessage.timestamp)
      }])
      setShowCrisisWarning(false)
      await fetchConversations()
    } catch (error) {
      console.error('Error starting chat:', error)
      const fallbackSessionId = crypto.randomUUID()
      setSessionId(fallbackSessionId)
      setMessages([{
        role: 'assistant',
        content: 'Hello! I\'m Therabot, your mental health companion. I\'m here to listen and support you. How are you feeling today?',
        timestamp: new Date()
      }])
    }
  }

  // Load conversation
  const loadConversation = async (id) => {
    try {
      const res = await fetch(`${API_URL}/history/${id}`)
      const data = await res.json()
      setSessionId(data.sessionId)
      setMessages(data.messages.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })))
      setShowCrisisWarning(data.isCrisisFlagged)
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  // Delete conversation
  const deleteConversation = async (id) => {
    try {
      await fetch(`${API_URL}/conversations/${id}`, { method: 'DELETE' })
      if (sessionId === id) {
        startNewChat()
      }
      await fetchConversations()
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    // Check if anonymous user has reached limit
    if (hasReachedAnonymousLimit()) {
      setShowLoginPrompt(true)
      return
    }

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setIsLoading(true)

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }])

    // Increment anonymous message count
    const reachedLimit = incrementAnonymousMessage()

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sessionId }),
      })

      const data = await res.json()

      // Add bot response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }])

      // Show crisis warning if detected
      if (data.isCrisis) {
        setShowCrisisWarning(true)
      }

      // Show login prompt if anonymous limit reached
      if (reachedLimit) {
        setShowLoginPrompt(true)
      }

      // Refresh conversations list (includes new title if generated)
      await fetchConversations()
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m sorry, I\'m having trouble responding right now. Please try again or reach out to emergency services if you need immediate help.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginRedirect = () => {
    navigate('/login')
  }

  const handleRegisterRedirect = () => {
    navigate('/register')
  }

  // Start on mount if no session
  useEffect(() => {
    if (!sessionId) {
      startNewChat()
    }
  }, [])

  const handleLogout = () => {
    logout()
  }

  // Get user's initials
  const getInitials = () => {
    if (isAnonymous) return 'G'
    if (!user?.name) return '?'
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Get display name
  const getDisplayName = () => {
    if (isAnonymous) return 'Guest'
    return user?.name || 'User'
  }

  // Get display email
  const getDisplayEmail = () => {
    if (isAnonymous) return `${anonymousMessageCount}/${anonymousLimit} messages`
    return user?.email
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <Sidebar
          conversations={conversations}
          currentSessionId={sessionId}
          onSelectConversation={loadConversation}
          onNewChat={startNewChat}
          onDeleteConversation={deleteConversation}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        >
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getInitials()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">{getDisplayName()}</p>
                <p className="text-xs text-gray-500">{getDisplayEmail()}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{getDisplayName()}</p>
                  <p className="text-xs text-gray-500">{getDisplayEmail()}</p>
                  {isAnonymous && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                          style={{ width: `${(anonymousMessageCount / anonymousLimit) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {anonymousMessageCount} of {anonymousLimit} free messages used
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {isAnonymous ? 'Exit' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        </Header>

        {/* Crisis Warning */}
        {showCrisisWarning && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200">
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Crisis Support Available</p>
                <p className="text-sm text-red-600">
                  If you&apos;re in crisis, please reach out to{' '}
                  <a href="tel:999" className="font-semibold underline">999</a>
                  {' '}or Befrienders Kenya{' '}
                  <a href="tel:0722178178" className="font-semibold underline">0722-178-178</a>
                </p>
              </div>
              <button
                onClick={() => setShowCrisisWarning(false)}
                className="p-1 hover:bg-red-100 rounded-lg transition-colors"
              >
                <span className="text-red-400 hover:text-red-600 text-xl leading-none">×</span>
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 via-white to-gray-50">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md px-4">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Welcome to Therabot
                </h3>
                <p className="text-gray-500 mb-2">
                  Start a conversation with your AI mental health companion
                </p>
                <p className="text-sm text-gray-400">
                  I&apos;m here to listen, support, and help you navigate your feelings
                </p>
              </div>
            </div>
          ) : (
            <div className="pb-4 max-w-4xl mx-auto">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={sendMessage} className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Message Therabot..."
                className="w-full pl-5 pr-14 py-4 bg-gray-100 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400 shadow-inner"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-3">
              Therabot is not a replacement for professional therapy. If you need immediate help, please contact emergency services.
            </p>
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  )
}

export default Chat
