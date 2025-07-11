"use client"

import { useState, useEffect, useCallback } from "react"
import { appThemes } from "@/config/app-themes"

const THEME_STORAGE_KEY = "howlin-mold-active-theme"

export function useAppTheme() {
  const [activeThemeId, setActiveThemeId] = useState<string>(appThemes[0].id)

  const applyTheme = useCallback((themeId: string) => {
    const theme = appThemes.find((t) => t.id === themeId)
    if (!theme) {
      console.warn(`Theme with id "${themeId}" not found.`)
      return
    }

    // Clear previous font classes
    appThemes.forEach((t) => {
      if (t.fontClass) {
        document.body.classList.remove(t.fontClass)
      }
    })

    // Add new font class
    if (theme.fontClass) {
      document.body.classList.add(theme.fontClass)
    }

    // Apply CSS variables
    const root = document.documentElement
    Object.entries(theme.cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [])

  const setActiveThemeAndApply = useCallback(
    (themeId: string) => {
      const themeExists = appThemes.some((t) => t.id === themeId)
      if (themeExists) {
        setActiveThemeId(themeId)
        localStorage.setItem(THEME_STORAGE_KEY, themeId)
        applyTheme(themeId)
      }
    },
    [applyTheme],
  )

  useEffect(() => {
    const storedThemeId = localStorage.getItem(THEME_STORAGE_KEY)
    const themeIdToApply =
      storedThemeId && appThemes.some((t) => t.id === storedThemeId) ? storedThemeId : appThemes[0].id

    setActiveThemeId(themeIdToApply)
    applyTheme(themeIdToApply)
  }, [applyTheme])

  return {
    themes: appThemes,
    activeThemeId,
    setActiveThemeAndApply,
  }
}
