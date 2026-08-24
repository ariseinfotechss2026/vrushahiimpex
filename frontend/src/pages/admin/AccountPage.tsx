import { useState, useEffect, type FormEvent, type ChangeEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"
import { useSiteSettings } from "@/lib/queries"
import { api, ApiError } from "@/lib/api"
import { getImage } from "@/assets/images"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Eye,
  EyeOff,
  Lock,
  UserCheck,
  KeyRound,
  Loader2,
  ShieldCheck,
  Mail,
  User,
  Image as ImageIcon,
  Upload,
} from "lucide-react"

export function AccountPage() {
  const { admin } = useAuth()
  const { data: settings } = useSiteSettings()
  const queryClient = useQueryClient()

  // Profile Form States
  const [name, setName] = useState(admin?.name || "")
  const [email, setEmail] = useState(admin?.email || "")

  // Sync state when admin object loads
  useEffect(() => {
    if (admin) {
      setName(admin.name || "")
      setEmail(admin.email || "")
    }
  }, [admin])

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Logo Form States
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const currentLogoUrl = settings?.companyInfo?.logo?.url || getImage("vrushahilogo.png")

  // Handle Logo File Selection
  function handleLogoFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file")
        return
      }
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  // Profile Mutation
  const profileMutation = useMutation({
    mutationFn: () => api.patch("/auth/me", { name, email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] })
      toast.success("Profile updated successfully")
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Profile update failed"),
  })

  // Password Mutation
  const passwordMutation = useMutation({
    mutationFn: () => api.patch("/auth/me/password", { currentPassword, newPassword }),
    onSuccess: () => {
      toast.success("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Password update failed"),
  })

  // Logo Mutation
  const logoMutation = useMutation({
    mutationFn: async () => {
      if (!logoFile) {
        throw new Error("Please select an image file to upload")
      }
      const formData = new FormData()
      formData.append("logo", logoFile)
      return api.put("/settings", formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] })
      toast.success("Website Logo updated successfully!")
      setLogoFile(null)
      setLogoPreview(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Logo update failed"),
  })

  function handleProfileSubmit(e: FormEvent) {
    e.preventDefault()
    profileMutation.mutate()
  }

  function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    passwordMutation.mutate()
  }

  function handleLogoSubmit(e: FormEvent) {
    e.preventDefault()
    logoMutation.mutate()
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* 1. Admin Profile Overview Card */}
      <Card className="border-border/60 shadow-sm bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <UserCheck className="size-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Admin Profile</CardTitle>
              <CardDescription>Update your personal account credentials</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 size-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    required
                    placeholder="Administrator Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="admin@vrushahi.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={profileMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-2 cursor-pointer"
            >
              {profileMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving Profile…
                </>
              ) : (
                <>
                  <UserCheck className="size-4" />
                  Save Profile Details
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 2. Website & Brand Logo Management Card */}
      <Card className="border-border/60 shadow-sm bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <ImageIcon className="size-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Website & Brand Logo</CardTitle>
              <CardDescription>Update the primary brand logo displayed across header, footer & portal</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogoSubmit} className="space-y-5">
            {/* Current Logo Preview */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Current Active Logo</Label>
              <div className="flex items-center gap-4 rounded-xl border border-border/80 bg-zinc-950 p-4 shadow-inner">
                <img
                  src={logoPreview || currentLogoUrl}
                  alt="Active Logo"
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-auto max-w-[200px] object-contain drop-shadow-md"
                />
                <div className="text-xs text-zinc-400">
                  <span className="font-semibold text-emerald-400">
                    {logoPreview ? "Previewing New Logo" : "Current Website Logo"}
                  </span>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Recommended: Transparent PNG or SVG logo for best display.
                  </p>
                </div>
              </div>
            </div>

            {/* Upload File Input */}
            <div className="space-y-2">
              <Label htmlFor="logoFile">Upload New Logo Image</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="logoFile"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  className="cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={logoMutation.isPending || !logoFile}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
            >
              {logoMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Uploading Logo…
                </>
              ) : (
                <>
                  <Upload className="size-4" />
                  Update Website Logo
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 3. Security Password Card */}
      <Card className="border-border/60 shadow-sm bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
              <KeyRound className="size-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Security Settings</CardTitle>
              <CardDescription>Update your account access password</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 size-4 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors p-1"
                  title={showCurrentPassword ? "Hide Password" : "Show Password"}
                  aria-label={showCurrentPassword ? "Hide Password" : "Show Password"}
                >
                  {showCurrentPassword ? <EyeOff className="size-4 text-emerald-500" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 size-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors p-1"
                  title={showNewPassword ? "Hide Password" : "Show Password"}
                  aria-label={showNewPassword ? "Hide Password" : "Show Password"}
                >
                  {showNewPassword ? <EyeOff className="size-4 text-emerald-500" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={passwordMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-2 cursor-pointer"
            >
              {passwordMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Updating Password…
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" />
                  Update Security Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
