import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function ProtectedRoute() {
  const { admin, isLoading } = useAuth()

  if (isLoading) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>
  if (!admin) return <Navigate to="/admin/login" replace />

  return <Outlet />
}
