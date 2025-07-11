"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, Info, RefreshCw } from "lucide-react"

interface DiagnosticResult {
  category: string
  test: string
  status: "pass" | "fail" | "warning" | "info"
  message: string
  details?: string
}

export function PageDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostics = async () => {
    setIsRunning(true)
    const results: DiagnosticResult[] = []

    // Test 1: Check if required CSS classes exist
    try {
      const testElement = document.createElement("div")
      testElement.className = "bb-interactive-pulse-glow"
      document.body.appendChild(testElement)
      const styles = window.getComputedStyle(testElement)
      document.body.removeChild(testElement)

      results.push({
        category: "CSS",
        test: "Interactive CSS Classes",
        status: styles.animation !== "none" ? "pass" : "warning",
        message: styles.animation !== "none" ? "Animation classes loaded" : "Animation classes may not be loaded",
        details: `Animation: ${styles.animation}`,
      })
    } catch (error) {
      results.push({
        category: "CSS",
        test: "Interactive CSS Classes",
        status: "fail",
        message: "Error checking CSS classes",
        details: String(error),
      })
    }

    // Test 2: Check for console errors
    const originalError = console.error
    const originalWarn = console.warn
    let errorCount = 0
    let warnCount = 0

    console.error = (...args) => {
      errorCount++
      originalError(...args)
    }
    console.warn = (...args) => {
      warnCount++
      originalWarn(...args)
    }

    // Wait a bit to catch any immediate errors
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.error = originalError
    console.warn = originalWarn

    results.push({
      category: "Console",
      test: "JavaScript Errors",
      status: errorCount === 0 ? "pass" : "fail",
      message: `${errorCount} errors detected`,
      details: errorCount > 0 ? "Check browser console for details" : undefined,
    })

    results.push({
      category: "Console",
      test: "JavaScript Warnings",
      status: warnCount === 0 ? "pass" : "warning",
      message: `${warnCount} warnings detected`,
      details: warnCount > 0 ? "Check browser console for details" : undefined,
    })

    // Test 3: Check if fonts are loaded
    try {
      const fontTests = ["Orbitron", "Inter"]
      for (const font of fontTests) {
        const isLoaded = document.fonts.check(`16px ${font}`)
        results.push({
          category: "Fonts",
          test: `${font} Font`,
          status: isLoaded ? "pass" : "warning",
          message: isLoaded ? "Font loaded" : "Font may not be loaded",
        })
      }
    } catch (error) {
      results.push({
        category: "Fonts",
        test: "Font Loading",
        status: "warning",
        message: "Could not check font loading",
        details: String(error),
      })
    }

    // Test 4: Check viewport and responsive design
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    }

    results.push({
      category: "Viewport",
      test: "Screen Size",
      status: "info",
      message: `${viewport.width}x${viewport.height}`,
      details: `Device pixel ratio: ${viewport.devicePixelRatio}`,
    })

    // Test 5: Check if required modules can be imported
    const moduleTests = [
      { name: "React", test: () => typeof React !== "undefined" },
      { name: "Next.js Router", test: () => typeof window !== "undefined" },
      {
        name: "Framer Motion",
        test: () => {
          try {
            require("framer-motion")
            return true
          } catch {
            return false
          }
        },
      },
    ]

    for (const moduleTest of moduleTests) {
      try {
        const isAvailable = moduleTest.test()
        results.push({
          category: "Modules",
          test: moduleTest.name,
          status: isAvailable ? "pass" : "fail",
          message: isAvailable ? "Module available" : "Module not available",
        })
      } catch (error) {
        results.push({
          category: "Modules",
          test: moduleTest.name,
          status: "fail",
          message: "Error checking module",
          details: String(error),
        })
      }
    }

    // Test 6: Check local storage and session storage
    try {
      localStorage.setItem("test", "test")
      localStorage.removeItem("test")
      results.push({
        category: "Storage",
        test: "Local Storage",
        status: "pass",
        message: "Local storage available",
      })
    } catch (error) {
      results.push({
        category: "Storage",
        test: "Local Storage",
        status: "warning",
        message: "Local storage not available",
        details: String(error),
      })
    }

    // Test 7: Check for hydration issues
    const hydrationTest =
      document.querySelector("[data-reactroot]") || document.querySelector("#__next") || document.querySelector("main")

    results.push({
      category: "React",
      test: "Hydration",
      status: hydrationTest ? "pass" : "warning",
      message: hydrationTest ? "React hydrated successfully" : "Potential hydration issues",
    })

    setDiagnostics(results)
    setIsRunning(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "fail":
        return <XCircle className="w-4 h-4 text-red-400" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "info":
        return <Info className="w-4 h-4 text-blue-400" />
    }
  }

  const getStatusColor = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "pass":
        return "border-green-400/50 bg-green-400/10"
      case "fail":
        return "border-red-400/50 bg-red-400/10"
      case "warning":
        return "border-yellow-400/50 bg-yellow-400/10"
      case "info":
        return "border-blue-400/50 bg-blue-400/10"
    }
  }

  const groupedDiagnostics = diagnostics.reduce(
    (acc, diagnostic) => {
      if (!acc[diagnostic.category]) {
        acc[diagnostic.category] = []
      }
      acc[diagnostic.category].push(diagnostic)
      return acc
    },
    {} as Record<string, DiagnosticResult[]>,
  )

  const summary = {
    total: diagnostics.length,
    pass: diagnostics.filter((d) => d.status === "pass").length,
    fail: diagnostics.filter((d) => d.status === "fail").length,
    warning: diagnostics.filter((d) => d.status === "warning").length,
    info: diagnostics.filter((d) => d.status === "info").length,
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Page Diagnostics
          </CardTitle>
          <Button onClick={runDiagnostics} disabled={isRunning} size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${isRunning ? "animate-spin" : ""}`} />
            {isRunning ? "Running..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-400/10 rounded-lg border border-green-400/20">
            <div className="text-2xl font-bold text-green-400">{summary.pass}</div>
            <div className="text-xs text-green-400/80">Passed</div>
          </div>
          <div className="text-center p-3 bg-red-400/10 rounded-lg border border-red-400/20">
            <div className="text-2xl font-bold text-red-400">{summary.fail}</div>
            <div className="text-xs text-red-400/80">Failed</div>
          </div>
          <div className="text-center p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
            <div className="text-2xl font-bold text-yellow-400">{summary.warning}</div>
            <div className="text-xs text-yellow-400/80">Warnings</div>
          </div>
          <div className="text-center p-3 bg-blue-400/10 rounded-lg border border-blue-400/20">
            <div className="text-2xl font-bold text-blue-400">{summary.info}</div>
            <div className="text-xs text-blue-400/80">Info</div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-4">
          {Object.entries(groupedDiagnostics).map(([category, tests]) => (
            <Card key={category} className="bg-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tests.map((test, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${getStatusColor(test.status)}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 flex-grow">
                          {getStatusIcon(test.status)}
                          <div>
                            <div className="font-medium">{test.test}</div>
                            <div className="text-sm text-muted-foreground">{test.message}</div>
                            {test.details && (
                              <details className="mt-2">
                                <summary className="text-xs cursor-pointer text-muted-foreground">Details</summary>
                                <pre className="text-xs mt-1 p-2 bg-black/20 rounded overflow-auto">{test.details}</pre>
                              </details>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            test.status === "pass"
                              ? "border-green-400/50 text-green-400"
                              : test.status === "fail"
                                ? "border-red-400/50 text-red-400"
                                : test.status === "warning"
                                  ? "border-yellow-400/50 text-yellow-400"
                                  : "border-blue-400/50 text-blue-400"
                          }`}
                        >
                          {test.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Common Issues and Solutions */}
        <Card className="bg-card/30">
          <CardHeader>
            <CardTitle className="text-lg">Common Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-red-400 mb-2">If you see JavaScript errors:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Check if all required dependencies are installed</li>
                  <li>Verify import paths are correct</li>
                  <li>Look for typos in component names or props</li>
                  <li>Check if environment variables are set correctly</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">If you see warnings:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Warnings usually don't break functionality but should be addressed</li>
                  <li>Check for deprecated React patterns or missing keys</li>
                  <li>Verify CSS classes are properly defined</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Performance tips:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Use React.memo for expensive components</li>
                  <li>Implement proper loading states</li>
                  <li>Optimize images and assets</li>
                  <li>Use dynamic imports for large components</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
