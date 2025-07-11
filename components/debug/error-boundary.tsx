"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  componentName?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.componentName || "component"}:`, error, errorInfo)
    this.setState({ errorInfo })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const componentName = this.props.componentName || "Component"
      const isSynthAltar = componentName.toLowerCase().includes("synth")

      if (isSynthAltar) {
        return (
          <Card className="m-4 my-12 border-amber-500/50 bg-amber-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Zap className="h-5 w-5" />
                Altar Instability Detected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                The Sonic Altar has encountered a temporary fluctuation. Please try re-initializing the ritual.
              </p>
              <Button onClick={this.handleRetry} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Re-initialize Altar
              </Button>
              <details className="mt-2 text-left">
                <summary className="cursor-pointer text-xs text-muted-foreground">Technical Details</summary>
                <pre className="mt-2 max-h-40 overflow-auto rounded bg-black/20 p-2 text-xs">
                  {this.state.error?.message}
                  {this.state.error?.stack}
                </pre>
              </details>
            </CardContent>
          </Card>
        )
      }

      return (
        <Card className="m-4 border-red-500/50 bg-red-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Component Error: {this.props.componentName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button onClick={this.handleRetry} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-muted-foreground">Technical Details</summary>
              <pre className="mt-2 max-h-40 overflow-auto rounded bg-black/20 p-2 text-xs">
                {this.state.error?.stack}
              </pre>
            </details>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
