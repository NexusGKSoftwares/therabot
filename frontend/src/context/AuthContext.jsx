import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const ANONYMOUS_MESSAGE_LIMIT = 5

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [anonymousMessageCount, setAnonymousMessageCount] = useState(0)

  useEffect(() => {
    // Check for stored auth token/user
    const storedUser = localStorage.getItem('therabot_user')
    const storedAnonymous = localStorage.getItem('therabot_anonymous')
    const storedMessageCount = localStorage.getItem('therabot_anonymous_messages')

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('therabot_user')
      }
    } else if (storedAnonymous === 'true') {
      setIsAnonymous(true)
      setAnonymousMessageCount(parseInt(storedMessageCount) || 0)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Simulate API call - replace with actual backend integration
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const mockUser = {
            id: '1',
            email,
            name: email.split('@')[0],
            avatar: null
          }
          setUser(mockUser)
          localStorage.setItem('therabot_user', JSON.stringify(mockUser))
          resolve(mockUser)
        } else {
          reject(new Error('Invalid credentials'))
        }
      }, 800)
    })
  }

  const register = async (name, email, password) => {
    // Simulate API call - replace with actual backend integration
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          const mockUser = {
            id: '1',
            email,
            name,
            avatar: null
          }
          setUser(mockUser)
          localStorage.setItem('therabot_user', JSON.stringify(mockUser))
          resolve(mockUser)
        } else {
          reject(new Error('Registration failed'))
        }
      }, 800)
    })
  }

  const logout = () => {
    setUser(null)
    setIsAnonymous(false)
    setAnonymousMessageCount(0)
    localStorage.removeItem('therabot_user')
    localStorage.removeItem('therabot_anonymous')
    localStorage.removeItem('therabot_anonymous_messages')
  }

  const startAnonymous = () => {
    setIsAnonymous(true)
    setAnonymousMessageCount(0)
    localStorage.setItem('therabot_anonymous', 'true')
    localStorage.setItem('therabot_anonymous_messages', '0')
  }

  const incrementAnonymousMessage = () => {
    if (isAnonymous) {
      const newCount = anonymousMessageCount + 1
      setAnonymousMessageCount(newCount)
      localStorage.setItem('therabot_anonymous_messages', newCount.toString())
      return newCount >= ANONYMOUS_MESSAGE_LIMIT
    }
    return false
  }

  const hasReachedAnonymousLimit = () => {
    return isAnonymous && anonymousMessageCount >= ANONYMOUS_MESSAGE_LIMIT
  }

  const forgotPassword = async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email) {
          resolve({ message: 'Password reset email sent' })
        } else {
          reject(new Error('Email is required'))
        }
      }, 800)
    })
  }

  const value = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    loading,
    isAuthenticated: !!user,
    isAnonymous,
    anonymousMessageCount,
    anonymousLimit: ANONYMOUS_MESSAGE_LIMIT,
    startAnonymous,
    incrementAnonymousMessage,
    hasReachedAnonymousLimit,
    canAccessChat: !!user || isAnonymous
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
