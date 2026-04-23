import { Heart, Shield, Menu, X } from 'lucide-react'

function Header({ onToggleSidebar, sidebarOpen, children }) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800">Therabot</h1>
            <p className="text-xs text-gray-500">AI Mental Health Support</p>
          </div>
        </div>
        {children || (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            <Shield className="w-3 h-3" />
            <span>Anonymous & Secure</span>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
