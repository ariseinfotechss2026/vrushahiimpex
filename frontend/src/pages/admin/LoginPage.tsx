import { useState, type FormEvent } from "react"
import { Navigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"
import { ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Mail, Loader2, Sparkles, ArrowRight } from "lucide-react"

export function LoginPage() {
  const { admin, isLoading, login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!isLoading && admin) return <Navigate to="/admin" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await login(email, password)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Login failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-950 px-4 font-sans text-zinc-100 selection:bg-emerald-500 selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 size-[500px] rounded-full bg-emerald-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-[500px] rounded-full bg-teal-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-600/10 blur-[150px]" />

      {/* Grid Pattern Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.8) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative flex w-full max-w-sm flex-col items-center gap-6">
        {/* Card Container */}
        <div className="w-full rounded-2xl border border-zinc-800/80 bg-zinc-900/90 p-6 shadow-2xl backdrop-blur-xl transition-all sm:p-7">

          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="flex size-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-inner shadow-emerald-500/20">
              <Sparkles className="size-5" />
            </div>

            <h1 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Vrushahi Impex
            </h1>
            <p className="mt-0.5 text-xs font-medium text-zinc-400">
              Enterprise Admin Control Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-zinc-300">
                Email Address
              </Label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 size-4 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@vrushahi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 border-zinc-800 bg-zinc-950/70 pl-10 pr-4 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:border-emerald-500 focus-visible:ring-1 focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-zinc-300">
                  Password
                </Label>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 size-4 text-zinc-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 border-zinc-800 bg-zinc-950/70 pl-10 pr-11 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:border-emerald-500 focus-visible:ring-1 focus-visible:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-zinc-500 hover:text-zinc-300 focus:outline-none transition-colors p-1"
                  title={showPassword ? "Hide Password" : "Show Password"}
                  aria-label={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4 text-emerald-400" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="group relative mt-2 h-10 w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-semibold text-white transition-all duration-300 hover:from-emerald-500 hover:to-teal-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin text-white" />
                  Authenticating…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In to Dashboard
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Outer bottom caption */}
        <p className="text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} Vrushahi Impex. All rights reserved.
        </p>
      </div>
    </div>
  )
}
