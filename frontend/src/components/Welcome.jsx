import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles, User, ArrowRight } from 'lucide-react'

function Welcome() {
  const navigate = useNavigate()
  const { isAuthenticated, canAccessChat, startAnonymous } = useAuth()

  useEffect(() => {
    // If already authenticated or has anonymous access, go to chat
    if (canAccessChat) {
      navigate('/chat', { replace: true })
    }
  }, [canAccessChat, navigate])

  const handleAnonymousStart = () => {
    startAnonymous()
    navigate('/chat')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleRegister = () => {
    navigate('/register')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Therabot</h1>
          <p className="text-gray-500">
            Your AI mental health companion, here to listen and support you.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* Anonymous Option */}
          <button
            onClick={handleAnonymousStart}
            className="w-full p-5 bg-white rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Try it anonymously</h3>
                <p className="text-sm text-gray-500">
                  Send up to 5 messages without creating an account. No personal information required.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
            </div>
          </button>

          {/* Login Option */}
          <button
            onClick={handleLogin}
            className="w-full p-5 bg-white rounded-2xl border-2 border-gray-100 hover:border-emerald-300 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-50 transition-colors">
                <User className="w-6 h-6 text-gray-600 group-hover:text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">I have an account</h3>
                <p className="text-sm text-gray-500">
                  Sign in to access your conversation history and unlimited messages.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
            </div>
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <button
              onClick={handleRegister}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Therabot is not a replacement for professional therapy. If you need immediate help, please contact emergency services.
        </p>
      </div>
    </div>
  )
}

export default Welcome
