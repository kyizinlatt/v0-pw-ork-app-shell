"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Redirect to dashboard
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl border border-border shadow-sm p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            PWork
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visa & Work Permit Management
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}
