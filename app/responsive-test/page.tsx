"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SporeNavigation } from "@/components/navigation/spore-navigation"
import { Monitor, Smartphone, Tablet, Laptop, MonitorSpeaker } from "lucide-react"

const deviceSizes = [
  {
    name: "Mobile Portrait",
    width: 375,
    height: 667,
    icon: Smartphone,
    breakpoint: "sm",
    description: "iPhone SE, small phones",
  },
  {
    name: "Mobile Landscape",
    width: 667,
    height: 375,
    icon: Smartphone,
    breakpoint: "sm",
    description: "iPhone SE landscape",
  },
  {
    name: "Large Mobile",
    width: 414,
    height: 896,
    icon: Smartphone,
    breakpoint: "sm",
    description: "iPhone 11 Pro, large phones",
  },
  {
    name: "Tablet Portrait",
    width: 768,
    height: 1024,
    icon: Tablet,
    breakpoint: "md",
    description: "iPad, small tablets",
  },
  {
    name: "Tablet Landscape",
    width: 1024,
    height: 768,
    icon: Tablet,
    breakpoint: "lg",
    description: "iPad landscape",
  },
  {
    name: "Laptop",
    width: 1366,
    height: 768,
    icon: Laptop,
    breakpoint: "lg",
    description: "Small laptops, netbooks",
  },
  {
    name: "Desktop",
    width: 1920,
    height: 1080,
    icon: Monitor,
    breakpoint: "xl",
    description: "Standard desktop monitors",
  },
  {
    name: "Large Desktop",
    width: 2560,
    height: 1440,
    icon: MonitorSpeaker,
    breakpoint: "2xl",
    description: "Large desktop monitors",
  },
]

export default function ResponsiveTestPage() {
  const [selectedDevice, setSelectedDevice] = useState(deviceSizes[6]) // Default to Desktop
  const [currentBreakpoint, setCurrentBreakpoint] = useState("")
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })

      // Determine current breakpoint
      if (window.innerWidth < 640) setCurrentBreakpoint("sm")
      else if (window.innerWidth < 768) setCurrentBreakpoint("md")
      else if (window.innerWidth < 1024) setCurrentBreakpoint("lg")
      else if (window.innerWidth < 1280) setCurrentBreakpoint("xl")
      else setCurrentBreakpoint("2xl")
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const TestComponent = ({ device }: { device: (typeof deviceSizes)[0] }) => {
    const Icon = device.icon
    return (
      <div className="border border-primary/20 rounded-lg overflow-hidden bg-black/50">
        <div className="bg-primary/10 p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{device.name}</span>
            <Badge variant="outline" className="text-xs">
              {device.breakpoint}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {device.width} × {device.height}
          </span>
        </div>
        <div
          className="bg-background overflow-hidden relative"
          style={{
            width: Math.min(device.width, 400),
            height: Math.min(device.height, 300),
            transform: `scale(${Math.min(400 / device.width, 300 / device.height, 1)})`,
            transformOrigin: "top left",
          }}
        >
          <iframe
            src="/"
            className="w-full h-full border-0 pointer-events-none"
            style={{
              width: device.width,
              height: device.height,
            }}
            title={`${device.name} Preview`}
          />
        </div>
        <div className="p-2 text-xs text-muted-foreground">{device.description}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SporeNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 sacred-text text-primary">Responsive Layout Testing</h1>
          <p className="text-muted-foreground mb-6">
            Test the Howlin Mold interface across different screen sizes and devices to ensure optimal user experience.
          </p>

          {/* Current Window Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Current Window Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Window Size</div>
                  <div className="text-lg font-mono">
                    {windowSize.width} × {windowSize.height}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Current Breakpoint</div>
                  <Badge variant="outline" className="text-lg">
                    {currentBreakpoint}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Device Category</div>
                  <div className="text-lg">
                    {windowSize.width < 768
                      ? "Mobile"
                      : windowSize.width < 1024
                        ? "Tablet"
                        : windowSize.width < 1920
                          ? "Desktop"
                          : "Large Desktop"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Device to Preview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {deviceSizes.map((device) => {
              const Icon = device.icon
              return (
                <Button
                  key={device.name}
                  variant={selectedDevice.name === device.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDevice(device)}
                  className="flex items-center space-x-2 h-auto p-3"
                >
                  <Icon className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{device.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {device.width}×{device.height}
                    </div>
                  </div>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Selected Device Preview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Device Preview: {selectedDevice.name}</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center">
                <div
                  className="border-2 border-primary/30 rounded-lg overflow-hidden bg-black shadow-2xl"
                  style={{
                    width: Math.min(selectedDevice.width * 0.5, 800),
                    height: Math.min(selectedDevice.height * 0.5, 600),
                  }}
                >
                  <div className="bg-primary/10 p-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <selectedDevice.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{selectedDevice.name}</span>
                      <Badge variant="outline">{selectedDevice.breakpoint}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {selectedDevice.width} × {selectedDevice.height}
                    </span>
                  </div>
                  <iframe
                    src="/"
                    className="w-full h-full border-0"
                    style={{
                      width: selectedDevice.width * 0.5,
                      height: selectedDevice.height * 0.5,
                      transform: "scale(1)",
                    }}
                    title={`${selectedDevice.name} Preview`}
                  />
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">{selectedDevice.description}</div>
            </CardContent>
          </Card>
        </div>

        {/* All Devices Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">All Device Previews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {deviceSizes.map((device) => (
              <TestComponent key={device.name} device={device} />
            ))}
          </div>
        </div>

        {/* Responsive Testing Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Testing Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Navigation Testing</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Mobile menu collapses properly on small screens</li>
                  <li>✓ Desktop dropdown menus work on larger screens</li>
                  <li>✓ Touch targets are appropriately sized for mobile</li>
                  <li>✓ Logo and branding remain visible at all sizes</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Layout Testing</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Text remains readable at all screen sizes</li>
                  <li>✓ Cards and components stack properly on mobile</li>
                  <li>✓ No horizontal scrolling on mobile devices</li>
                  <li>✓ Proper spacing and padding across breakpoints</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Interactive Elements</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Buttons are touch-friendly on mobile</li>
                  <li>✓ Hover effects work properly on desktop</li>
                  <li>✓ Form inputs are appropriately sized</li>
                  <li>✓ Modal dialogs fit within viewport</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
