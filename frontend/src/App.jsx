import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Chat from './components/Chat'
import Welcome from './components/Welcome'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute allowAnonymous={true}>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/" element={<Navigate to="/chat" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
