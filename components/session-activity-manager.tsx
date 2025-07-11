"use client"
import { useAuth } from "@/lib/auth-context"
import { useSessionTimeout } from "@/hooks/use-session-timeout"

const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000

export function SessionActivityManager() {
  const { logout, isAuthenticated } = useAuth()

  const handleTimeout = () => {
    if (isAuthenticated) {
      console.log("Session timed out. Logging out user.")
      logout()
      // After logout, ProtectedRoute will handle redirecting to LoginForm
    } else {
      // If user is not authenticated, and timer runs out,
      // they are likely already on a public page or login page.
      // No explicit action needed here as ProtectedRoute handles access.
      // We could potentially show a generic "please login to continue" modal
      // if there were more public, interactive parts of the site.
      console.log("Session timer expired for unauthenticated user.")
    }
  }

  // The hook will now only call onTimeout if the user was initially authenticated
  // or if we decide to enforce login even for anonymous users after timeout.
  // For now, let's make it always active to enforce the "sign in/up requirement".
  useSessionTimeout(handleTimeout, FIFTEEN_MINUTES_IN_MS)

  return null // This component does not render anything
}
