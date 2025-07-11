import { AppThemeSwitcher } from "@/components/theme-selector/app-theme-switcher"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10 flex justify-center items-start min-h-screen">
      <Card className="w-full max-w-lg bb-interactive-bg-shimmer border-primary/20 shadow-lg shadow-primary/5">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-orbitron text-primary-foreground">Ecosystem Configuration</CardTitle>
          </div>
          <CardDescription className="pt-2 font-poetic text-foreground/80">
            Calibrate your sensory experience within the Howlin Mold matrix.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">Select Visual Theme</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Reboot the visual matrix of the ecosystem. Your selection is saved locally to this device and browser.
            </p>
            <AppThemeSwitcher />
          </div>
          {/* Future settings can be added here */}
        </CardContent>
      </Card>
    </div>
  )
}
