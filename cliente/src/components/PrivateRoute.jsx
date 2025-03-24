import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthProvider"

export default function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && user.rol !== "admin") {
    return <Navigate to="/" replace />
  }

  return children
}

