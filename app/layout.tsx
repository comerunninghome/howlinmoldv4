import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Orbitron, EB_Garamond, Inter, Syne } from "next/font/google"
import { cn } from "@/lib/utils"
import ClientLayout from "./client"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
  display: "swap",
})

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-syne",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Howlin Mold - Spore Network",
  description: "A spore-node ecosystem for music discovery and sonic attunement. Connect, discover, create.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(
        "dark",
        spaceGrotesk.variable,
        orbitron.variable,
        ebGaramond.variable,
        inter.variable,
        syne.variable,
      )}
      suppressHydrationWarning
    >
      <body className={`font-sans bg-background text-foreground`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
