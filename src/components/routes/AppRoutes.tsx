import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@contexts/auth/AuthContext'
import { Layout } from '@components/layout/Layout'
import { Login } from '@components/auth/Login'
import { Register } from '@components/auth/Register'
import { Dashboard } from '@components/dashboard/Dashboard'
import { ProjectDetails } from '@components/projects/ProjectDetails'

export function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

      {/* Protected routes */}
      <Route element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
      </Route>
    </Routes>
  )
} 