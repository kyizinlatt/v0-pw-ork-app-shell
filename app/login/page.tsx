"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Demo: show error for invalid credentials
    if (email !== "admin@pwork.com" || password !== "admin123") {
      setError("Invalid email or password. Try admin@pwork.com / admin123")
      setIsLoading(false)
      return
    }

    // Redirect to dashboard
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-indigo-600">PWork</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Case Management System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Remember me for 30 days
                </label>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="p-4 rounded-lg bg-muted border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Demo Credentials
            </p>
            <p className="text-sm text-foreground font-mono">
              admin@pwork.com / admin123
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-indigo-600 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-3xl font-bold mb-4 text-balance">
            Streamline your visa and work permit processing
          </h2>
          <p className="text-indigo-100 text-lg leading-relaxed">
            PWork helps you manage cases efficiently with real-time tracking,
            SLA monitoring, and seamless communication with partners and
            customers.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">2,847</p>
              <p className="text-sm text-indigo-200">Cases Processed</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">98%</p>
              <p className="text-sm text-indigo-200">On-time Delivery</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-indigo-200">Active Partners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
