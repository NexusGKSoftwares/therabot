import { useState, useRef, useEffect } from 'react'
import { 
  User, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  HelpCircle, 
  History,
  ChevronDown,
  Palette,
  Volume2,
  VolumeX,
  Download,
  Trash2,
  UserPlus,
  BarChart3
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function ProfileMenu() {
  const { user, logout, isAnonymous, startAnonymous, anonymousMessageCount, anonymousLimit } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setIsOpen(false)
    logout()
  }

  const handleThemeToggle = () => {
    setDarkMode(!darkMode)
    // TODO: Implement theme switching
  }

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled)
    // TODO: Implement sound settings
  }

  const handleNotificationToggle = () => {
    setNotifications(!notifications)
    // TODO: Implement notification settings
  }

  const exportChatHistory = () => {
    // TODO: Implement chat export
    console.log('Export chat history')
  }

  const clearChatHistory = () => {
    // TODO: Implement clear history
    console.log('Clear chat history')
  }

  if (isAnonymous) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
          <User className="w-4 h-4" />
          <span>Guest ({anonymousMessageCount}/{anonymousLimit})</span>
        </div>
        <button
          onClick={() => window.location.href = '/login'}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Sign Up
        </button>
      </div>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
          {user?.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4 text-white" />}
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-800">{user?.name || 'User'}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                {user?.name?.charAt(0)?.toUpperCase() || <User className="w-5 h-5 text-white" />}
              </div>
              <div>
                <div className="font-medium text-gray-800">{user?.name || 'User'}</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-semibold text-emerald-600">0</div>
                <div className="text-xs text-gray-500">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">0</div>
                <div className="text-xs text-gray-500">Messages</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Profile */}
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              View Profile
            </button>

            {/* Settings */}
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
              <Settings className="w-4 h-4 text-gray-400" />
              Settings
            </button>

            {/* Chat History */}
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
              <History className="w-4 h-4 text-gray-400" />
              Chat History
            </button>

            {/* Analytics */}
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              Mood Analytics
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={handleThemeToggle}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              {darkMode ? <Sun className="w-4 h-4 text-gray-400" /> : <Moon className="w-4 h-4 text-gray-400" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            {/* Sound Toggle */}
            <button 
              onClick={handleSoundToggle}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-gray-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
              {soundEnabled ? 'Sound On' : 'Sound Off'}
            </button>

            {/* Notifications */}
            <button 
              onClick={handleNotificationToggle}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <Bell className="w-4 h-4 text-gray-400" />
              {notifications ? 'Notifications On' : 'Notifications Off'}
            </button>

            {/* Export Chat */}
            <button 
              onClick={exportChatHistory}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <Download className="w-4 h-4 text-gray-400" />
              Export Chat History
            </button>

            {/* Clear History */}
            <button 
              onClick={clearChatHistory}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              Clear Chat History
            </button>

            {/* Help */}
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-gray-400" />
              Help & Support
            </button>

            {/* Privacy */}
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
              <Shield className="w-4 h-4 text-gray-400" />
              Privacy & Security
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-2">
            <button 
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu
