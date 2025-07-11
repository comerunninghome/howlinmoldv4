"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export function NavigationDebug() {
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-teal-400 p-4 rounded-lg border border-teal-500/30 text-xs font-mono z-50">
      <div>Current Path: {pathname}</div>
      <div>Authenticated: {isAuthenticated ? "Yes" : "No"}</div>
      <div>User: {user?.name || "None"}</div>
      <div>Role: {user?.role || "None"}</div>
    </div>
  )
}
