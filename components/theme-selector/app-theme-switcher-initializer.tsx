"use client"

import { useAppTheme } from "@/hooks/use-app-theme"

// This component's sole purpose is to run the useAppTheme hook's useEffect
// as early as possible on the client-side to apply the theme from local storage.
export function AppThemeSwitcherInitializer() {
  useAppTheme()
  return null // This component renders nothing.
}
