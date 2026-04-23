import { useAuth } from '../context/AuthContext'

// Create a custom fetch wrapper that handles session expiration
export const createApiFetch = (auth) => {
  return async (url, options = {}) => {
    // Add session validation before each request
    if (auth.user && !auth.validateSession()) {
      // Session expired, validateSession already handled logout and redirect
      throw new Error('Session expired')
    }

    // Get auth headers
    const token = auth.getToken()
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Make the request
    const response = await fetch(url, {
      ...options,
      headers
    })

    // Check for 401 Unauthorized response
    if (response.status === 401) {
      console.log('🚨 Received 401 response (logout disabled for testing)')
      console.log('Response URL:', url)
      console.log('Response status:', response.status)

      // Try to get error details
      try {
        const errorData = await response.clone().json()
        console.log('Error data:', errorData)
      } catch (e) {
        console.log('Could not parse error response')
      }

      // Commented out logout for testing
      // auth.logout(true) // Force logout and redirect
      throw new Error('Authentication failed - testing mode')
    }

    // Check for 403 Forbidden response
    if (response.status === 403) {
      console.log('Received 403, access forbidden')
      // Don't auto-logout for 403, let the component handle it
      throw new Error('Access forbidden')
    }

    return response
  }
}

// Hook to use the API fetch
export const useApiFetch = () => {
  const auth = useAuth()
  return createApiFetch(auth)
}

// Global error handler for API errors
export const handleApiError = (error, auth) => {
  console.error('API Error:', error)

  if (error.message === 'Session expired') {
    // Already handled by the interceptor
    return
  }

  // Handle other API errors
  if (error.message.includes('401') || error.message.includes('Unauthorized')) {
    auth.logout(true)
  }
}
