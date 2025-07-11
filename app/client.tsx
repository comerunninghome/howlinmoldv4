"use client"

import type React from "react"
import { AppProviders } from "@/app/providers"
import { ErrorBoundary } from "@/components/debug/error-boundary"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary componentName="ClientLayout">
      <AppProviders>{children}</AppProviders>
    </ErrorBoundary>
  )
}
