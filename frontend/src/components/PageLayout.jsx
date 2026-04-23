import { useState, useSyncExternalStore } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import SEO from './SEO'
import BottomNav from './BottomNav'
import SessionWarning from './SessionWarning'

// Hook to subscribe to window width changes
function useWindowWidth() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('resize', callback)
      return () => window.removeEventListener('resize', callback)
    },
    () => window.innerWidth,
    () => 1024 // SSR fallback
  )
}

function PageLayout({ children, title, currentPage = 'chat' }) {
  const windowWidth = useWindowWidth()
  const isDesktop = windowWidth >= 1024
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <>
      <SEO title={title || 'Therabot'} />
      <SessionWarning />
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar - Desktop always visible, mobile conditional */}
        {(sidebarOpen || isDesktop) && (
          <div className="lg:w-80 flex-shrink-0">
            <Sidebar
              conversations={[]}
              currentSessionId={null}
              onSelectConversation={() => { }}
              onNewChat={() => window.location.href = '/chat'}
              onDeleteConversation={() => { }}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen pb-16 lg:pb-0">
          <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNav currentPage={currentPage} />
    </>
  )
}

export default PageLayout
