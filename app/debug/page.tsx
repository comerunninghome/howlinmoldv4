"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorBoundary } from "@/components/debug/error-boundary"

// Dynamically import the new WebSocketClient component
const WebSocketClient = dynamic(() => import("@/components/websocket/websocket-client"), {
  loading: () => (
    <Card className="w-full max-w-5xl mx-auto bg-gray-800 text-gray-100 rounded-lg shadow-xl border border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-bold text-purple-400">Howlin Mold WebSocket Client</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 text-slate-400">Loading WebSocket Client...</p>
      </CardContent>
    </Card>
  ),
  ssr: false, // Important for components that rely on browser APIs like WebSocket
})

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-inter flex flex-col items-center py-12">
      <h1 className="text-5xl font-bold text-center mb-10 text-primary font-orbitron responsive-text-overlay">
        Debug Console
      </h1>
      <p className="text-lg text-slate-400 text-center mb-12 max-w-2xl responsive-text-overlay">
        Access various debugging tools and system diagnostics for the Howlin Mold platform.
      </p>

      <div className="w-full max-w-6xl space-y-12">
        {/* Existing Page Diagnostics */}
        <ErrorBoundary
          componentName="PageDiagnostics"
          fallback={
            <Card className="bg-destructive/10 border border-destructive text-destructive-foreground p-6">
              <p>Error loading Page Diagnostics.</p>
            </Card>
          }
        >
          <Suspense
            fallback={
              <Card className="bg-gray-800 rounded-lg shadow-xl p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="text-center text-slate-400 mt-4">Loading Page Diagnostics...</p>
              </Card>
            }
          >
            {/* Assuming PageDiagnostics is imported and used here */}
            {/* <PageDiagnostics /> */}
            <Card className="bg-gray-800 rounded-lg shadow-xl p-8 border border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Page Diagnostics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  This section would display real-time performance metrics, component render times, and other diagnostic
                  information. (Placeholder)
                </p>
              </CardContent>
            </Card>
          </Suspense>
        </ErrorBoundary>

        {/* New WebSocket Client Section */}
        <ErrorBoundary
          componentName="WebSocketClient"
          fallback={
            <Card className="bg-destructive/10 border border-destructive text-destructive-foreground p-6">
              <p>Error loading WebSocket Client. Please check console for details.</p>
            </Card>
          }
        >
          <Suspense
            fallback={
              <Card className="w-full max-w-5xl mx-auto bg-gray-800 text-gray-100 rounded-lg shadow-xl border border-primary/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-4xl font-bold text-purple-400">Howlin Mold WebSocket Client</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                  <p className="mt-4 text-slate-400">Loading WebSocket Client...</p>
                </CardContent>
              </Card>
            }
          >
            <WebSocketClient />
          </Suspense>
        </ErrorBoundary>

        {/* You can add more debug components here */}
      </div>
    </div>
  )
}
