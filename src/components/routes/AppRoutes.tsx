import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth/AuthContext'
import { Login } from '@components/auth/Login'
import { Register } from '@components/auth/Register'
import { Dashboard } from '@components/dashboard/Dashboard'

export function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

      {/* Protected routes */}
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
    </Routes>
  )
} 