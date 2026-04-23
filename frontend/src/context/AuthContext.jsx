import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token/user
    const storedUser = localStorage.getItem('therabot_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('therabot_user')
      }
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
    localStorage.removeItem('therabot_user')
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
    isAuthenticated: !!user
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
