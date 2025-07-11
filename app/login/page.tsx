"use client"

import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <LoginForm />
      {message && (
        <Alert variant="destructive" className="mt-4 bg-red-900/50 border-red-500/50 text-white">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="mt-6 text-sm text-muted-foreground">
        <p className="font-semibold mb-2 text-foreground/80">Demo Account:</p>
        <div className="space-y-1 font-mono text-xs">
          <p>admin@howlinmold.com / admin123</p>
        </div>
      </div>
    </div>
  )
}
