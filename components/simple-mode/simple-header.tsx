"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2 } from "lucide-react"

export function SimpleHeader() {
  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Simple Mode</h1>
          <p className="text-muted-foreground">Just the music, nothing else</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Volume2 className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Audio Player Active</span>
      </div>
    </header>
  )
}
