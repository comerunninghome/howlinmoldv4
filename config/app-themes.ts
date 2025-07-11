import type { AppTheme } from "@/lib/types"

// Default theme (based on original dark theme for contrast)
export const defaultTheme: AppTheme = {
  id: "default",
  name: "Default Mode",
  fontClass: "font-default", // Uses --font-inter by default
  cssVariables: {
    "--background": "hsl(222.2, 84%, 4.9%)", // Dark blue-black
    "--foreground": "hsl(210, 40%, 98%)", // Light grey/white
    "--background-start": "hsl(222.2, 70%, 7%)", // Slightly lighter dark blue for gradient

    "--card": "hsl(222.2, 80%, 7%)", // Dark card
    "--card-foreground": "hsl(210, 40%, 95%)",
    "--card-glow": "hsl(210, 50%, 60%)", // A cool blue glow

    "--popover": "hsl(222.2, 84%, 4.9%)",
    "--popover-foreground": "hsl(210, 40%, 98%)",

    "--primary": "hsl(210, 70%, 75%)", // Brighter blue for primary actions
    "--primary-foreground": "hsl(222.2, 84%, 4.9%)", // Dark text on primary

    "--secondary": "hsl(217.2, 32.6%, 17.5%)", // Muted dark blue
    "--secondary-foreground": "hsl(210, 40%, 90%)",

    "--muted": "hsl(217.2, 25%, 25%)",
    "--muted-foreground": "hsl(215, 20.2%, 65.1%)",

    "--accent": "hsl(190, 70%, 60%)", // A cyan/teal accent
    "--accent-foreground": "hsl(222.2, 84%, 4.9%)",

    "--destructive": "hsl(0, 62.8%, 50.6%)", // Red for destructive actions
    "--destructive-foreground": "hsl(210, 40%, 98%)",

    "--border": "hsl(217.2, 32.6%, 25%)", // Slightly more visible border
    "--input": "hsl(217.2, 32.6%, 17.5%)",
    "--ring": "hsl(210, 70%, 65%)", // Focus ring

    "--radius": "0.5rem",

    // Barcelona Bloom specific custom variables - reset for default
    "--bb-glow": "transparent",
    "--bb-shadow": "transparent",
    "--bb-link-hover": "hsl(210, 70%, 85%)", // Lighter blue for link hover
  },
}

// Barcelona Bloom Theme - Inspired by Kris Kool Google Doodle
export const barcelonaBloomTheme: AppTheme = {
  id: "barcelona-bloom",
  name: "🌺 Barcelona Bloom",
  fontClass: "font-syne", // Syne font for its artistic, modular feel
  cssVariables: {
    // Base: Deep, rich background with warm, light text
    "--background": "hsl(260, 30%, 12%)", // Deep Indigo/Purple (inspired by dark blues/shadows in Doodle)
    "--foreground": "hsl(35, 50%, 92%)", // Warm Antique Cream/Light Gold (for text)
    "--background-start": "hsl(260, 30%, 18%)", // Slightly lighter for gradient

    // Cards: Could be slightly lighter or use a contrasting muted tone
    "--card": "hsl(260, 28%, 16%)", // A slightly lighter shade of the background
    "--card-foreground": "hsl(35, 50%, 90%)",
    "--card-glow": "hsl(45, 100%, 70%)", // Gold/Yellow glow from Doodle

    // Popover: Consistent with card or background
    "--popover": "hsl(260, 28%, 14%)",
    "--popover-foreground": "hsl(35, 50%, 92%)",

    // Primary Actions: Vibrant Red or Ochre from Doodle
    "--primary": "hsl(0, 75%, 60%)", // Vibrant Red (inspired by Doodle's reds)
    "--primary-foreground": "hsl(35, 100%, 98%)", // Very light cream/white for text on primary

    // Secondary Elements: Muted Earth Tones or Greens
    "--secondary": "hsl(140, 35%, 45%)", // Muted Leafy Green (from Doodle)
    "--secondary-foreground": "hsl(35, 50%, 92%)",

    // Muted Text/Elements:
    "--muted": "hsl(260, 15%, 45%)", // Desaturated version of background for muted elements
    "--muted-foreground": "hsl(35, 30%, 70%)", // Softer cream for muted text

    // Accent: Bright, contrasting color from Doodle
    "--accent": "hsl(180, 70%, 65%)", // Bright Cyan/Teal (from Doodle's blues/greens)
    "--accent-foreground": "hsl(260, 30%, 12%)", // Dark text on accent

    // Destructive Actions:
    "--destructive": "hsl(0, 70%, 55%)",
    "--destructive-foreground": "hsl(35, 100%, 98%)",

    // Borders & Inputs: Dark, defined lines
    "--border": "hsl(260, 20%, 30%)", // Darker, defined border, like outlines
    "--input": "hsl(260, 25%, 20%)", // Input background
    "--ring": "hsl(45, 100%, 65%)", // Gold/Yellow focus ring

    "--radius": "0.5rem",

    // Custom Barcelona Bloom variables from user spec, inspired by Doodle
    "--bb-glow": "hsl(45, 100%, 70%)", // Luminous Gold/Yellow (from Doodle highlights)
    "--bb-shadow": "rgba(40, 20, 60, 0.3)", // A darker, slightly purple shadow
    "--bb-link-hover": "hsl(0, 80%, 70%)", // Brighter red for link hover
  },
}

export const appThemes: AppTheme[] = [defaultTheme, barcelonaBloomTheme]
