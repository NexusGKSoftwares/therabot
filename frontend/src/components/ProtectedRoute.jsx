import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, allowAnonymous = true }) {
  const { isAuthenticated, isAnonymous, loading, canAccessChat } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // If anonymous is allowed and user can access chat (authenticated or anonymous)
  if (allowAnonymous && canAccessChat) {
    return children
  }

  // If anonymous not allowed or user cannot access chat, require authentication
  if (!isAuthenticated && !isAnonymous) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
