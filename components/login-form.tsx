"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useSound } from "@/contexts/sound-context" // Import useSound

export function LoginForm() {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { playSound } = useSound() // Use the hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    playSound("click") // Play click sound on attempt

    if (!email || !password) {
      setError("Please fill in all fields")
      playSound("error") // Play error sound
      return
    }

    const success = await login(email, password)
    if (!success) {
      setError("Invalid email or password")
      playSound("error") // Play error sound
    } else {
      playSound("success") // Play success sound (though navigation will likely happen)
    }
  }

  const handleButtonClick = () => {
    playSound("click")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-teal-950/30 px-4">
      <Card className="w-full max-w-md bg-black/70 border-primary/40 backdrop-blur bb-interactive-bg-shimmer">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 bb-interactive-pulse-glow" />
          <CardTitle className="text-2xl sacred-text text-primary-foreground bb-interactive-link-glow">
            HOWLIN MOLD
          </CardTitle>
          <p className="text-foreground/70 font-poetic">Enter the myth-machine</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... (email and password inputs) ... */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-teal-100 bb-interactive-link-glow">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900/50 border-primary/50 text-teal-100 focus:bb-interactive-border-accent"
                placeholder="admin@howlinmold.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-teal-100 bb-interactive-link-glow">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-900/50 border-primary/50 text-teal-100 pr-10 focus:bb-interactive-border-accent"
                  placeholder="Enter password"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-teal-300 hover:text-teal-100 bb-interactive-pulse-glow"
                  onClick={() => {
                    playSound("click")
                    setShowPassword(!showPassword)
                  }}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-accent text-primary-foreground bb-interactive-border-accent bb-interactive-pulse-glow"
              disabled={isLoading}
              // onClick={handleButtonClick} // handleSubmit already plays a click
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Enter"
              )}
            </Button>
          </form>

          {/* ... (demo credentials) ... */}
          <div className="mt-6 p-4 bg-teal-950/30 rounded-lg border border-primary/30">
            <p className="text-xs text-foreground/70 mb-2">Demo Credentials:</p>
            <p className="text-xs text-foreground/90">admin@howlinmold.com / admin123</p>
            <p className="text-xs text-foreground/90">user@howlinmold.com / user123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
