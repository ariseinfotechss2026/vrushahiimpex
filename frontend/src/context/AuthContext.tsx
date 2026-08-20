import { createContext, useContext, type ReactNode } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { api, ApiError } from "@/lib/api"

interface Admin {
  id: string
  name: string
  email: string
}

interface AuthContextValue {
  admin: Admin | null | undefined
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const isAdminPath = typeof window !== "undefined" && window.location.pathname.startsWith("/admin")

  const { data: admin, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await api.get<Admin>("/auth/me")
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) return null
        throw err
      }
    },
    enabled: isAdminPath,
    staleTime: 10 * 60 * 1000,
    retry: false,
  })

  async function login(email: string, password: string) {
    const data = await api.post<Admin>("/auth/login", { email, password })
    queryClient.setQueryData(["me"], data)
  }

  async function logout() {
    await api.post("/auth/logout")
    queryClient.setQueryData(["me"], null)
  }

  return <AuthContext.Provider value={{ admin, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
