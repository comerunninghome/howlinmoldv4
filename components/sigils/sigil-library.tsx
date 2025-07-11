"use client"

import type React from "react"

interface SigilProps {
  className?: string
  isActive?: boolean
  isHovered?: boolean
}

// Signal/Home Sigil - Radiating energy pattern
export const SignalSigil: React.FC<SigilProps> = ({ className = "w-6 h-6", isActive, isHovered }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <g className={`transition-all duration-500 ${isHovered ? "animate-pulse" : ""}`}>
      <circle cx="12" cy="12" r="2" fill="currentColor" className={`${isActive ? "opacity-100" : "opacity-70"}`} />
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        className={`${isHovered ? "scale-110" : "scale-100"} transition-transform duration-300`}
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
        className={`${isHovered ? "scale-125" : "scale-100"} transition-transform duration-500`}
      />
      <path
        d="M12 2 L12 6 M12 18 L12 22 M2 12 L6 12 M18 12 L22 12"
        stroke="currentColor"
        strokeWidth="1"
        className={`${isHovered ? "rotate-45" : "rotate-0"} transition-transform duration-700 origin-center`}
      />
    </g>
  </svg>
)

// Artifacts Sigil - Ancient vessel with emanating power
export const ArtifactsSigil: React.FC<SigilProps> = ({ className = "w-6 h-6", isActive, isHovered }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <g className={`transition-all duration-500 ${isHovered ? "animate-pulse" : ""}`}>
      <path
        d="M6 8 L18 8 L16 20 L8 20 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className={`${isActive ? "opacity-100" : "opacity-70"}`}
      />
      <path d="M8 8 L8 4 L16 4 L16 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle
        cx="12"
        cy="14"
        r="3"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        className={`${isHovered ? "scale-125" : "scale-100"} transition-transform duration-300`}
      />
      <path
        d="M12 11 L12 17 M9 14 L15 14"
        stroke="currentColor"
        strokeWidth="0.5"
        className={`${isHovered ? "rotate-45" : "rotate-0"} transition-transform duration-500 origin-center`}
      />
    </g>
  </svg>
)

// Booth Sigil - DJ mixing console with energy waves
export const BoothSigil: React.FC<SigilProps> = ({ className = "w-6 h-6", isActive, isHovered }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <g className={`transition-all duration-500 ${isHovered ? "animate-pulse" : ""}`}>
      <rect
        x="4"
        y="10"
        width="16"
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className={`${isActive ? "opacity-100" : "opacity-70"}`}
      />
      <circle cx="8" cy="14" r="1.5" fill="currentColor" />
      <circle cx="16" cy="14" r="1.5" fill="currentColor" />
      <path
        d="M2 6 Q12 2 22 6"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        className={`${isHovered ? "translate-y-1" : "translate-y-0"} transition-transform duration-300`}
      />
      <path
        d="M2 4 Q12 0 22 4"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
        className={`${isHovered ? "translate-y-2" : "translate-y-0"} transition-transform duration-500`}
      />
    </g>
  </svg>
)

export const ZineSigil: React.FC<SigilProps> = ({ className = "w-6 h-6", isActive, isHovered }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <g className={`transition-all duration-500 ${isHovered ? "animate-pulse" : ""}`}>
      <path
        d="M4 6 L20 6 L20 18 L4 18 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className={`${isActive ? "opacity-100" : "opacity-70"}`}
      />
      <path
        d="M7 10 L17 10 M7 12 L15 12 M7 14 L13 14"
        stroke="currentColor"
        strokeWidth="1"
        className={`${isHovered ? "translate-x-1" : "translate-x-0"} transition-transform duration-300`}
      />
      <circle
        cx="18"
        cy="8"
        r="2"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        className={`${isHovered ? "scale-150" : "scale-100"} transition-transform duration-500`}
      />
    </g>
  </svg>
)

export const RitualMixSigil: React.FC<SigilProps> = ({ className = "w-6 h-6", isActive, isHovered }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <g className={`transition-all duration-500 ${isHovered ? "animate-pulse" : ""}`}>
      <path
        d="M8 12 L16 12 L15 20 L9 20 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className={`${isActive ? "opacity-100" : "opacity-70"}`}
      />
      <path d="M10 12 L10 8 L14 8 L14 12" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle
        cx="12"
        cy="16"
        r="2"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        className={`${isHovered ? "scale-125" : "scale-100"} transition-transform duration-300`}
      />
      <path
        d="M8 4 Q12 2 16 4"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        className={`${isHovered ? "rotate-12" : "rotate-0"} transition-transform duration-500 origin-center`}
      />
    </g>
  </svg>
)

export const VinylGridSigil: React.FC<SigilProps> = ({ className = "w-6 h-6", isActive, isHovered }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <g className={`transition-all duration-500 ${isHovered ? "animate-pulse" : ""}`}>
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className={`${isActive ? "opacity-100" : "opacity-70"}`}
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <path
        d="M4 4 L8 8 M16 8 L20 4 M20 20 L16 16 M8 16 L4 20"
        stroke="currentColor"
        strokeWidth="1"
        className={`${isHovered ? "rotate-45" : "rotate-0"} transition-transform duration-700 origin-center`}
      />
    </g>
  </svg>
)

export const VaultSigil: React.FC<SigilProps> = ({ className = "w-6 h-6", isActive, isHovered }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <g className={`transition-all duration-500 ${isHovered ? "animate-pulse" : ""}`}>
      <rect
        x="4"
        y="8"
        width="16"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className={`${isActive ? "opacity-100" : "opacity-70"}`}
      />
      <path d="M8 8 L8 6 Q8 4 12 4 Q16 4 16 6 L16 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle
        cx="12"
        cy="14"
        r="2"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        className={`${isHovered ? "scale-125" : "scale-100"} transition-transform duration-300`}
      />
      <path
        d="M12 16 L12 18"
        stroke="currentColor"
        strokeWidth="1"
        className={`${isHovered ? "translate-y-1" : "translate-y-0"} transition-transform duration-300`}
      />
    </g>
  </svg>
)

export const SonicShrineSigil: React.FC<SigilProps> = ({ className = "w-6 h-6", isActive, isHovered }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <g className={`transition-all duration-500 ${isHovered ? "animate-pulse" : ""}`}>
      <path
        d="M2 12 Q12 6 22 12 Q12 18 2 12"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className={`${isActive ? "opacity-100" : "opacity-70"}`}
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        className={`${isHovered ? "scale-125" : "scale-100"} transition-transform duration-300`}
      />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <path
        d="M6 8 L6 16 M18 8 L18 16"
        stroke="currentColor"
        strokeWidth="0.5"
        className={`${isHovered ? "scale-110" : "scale-100"} transition-transform duration-500 origin-center`}
      />
    </g>
  </svg>
)

export const BroadcastBoothSigil: React.FC<SigilProps> = ({ className = "w-6 h-6", isActive, isHovered }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <g className={`transition-all duration-500 ${isHovered ? "animate-pulse" : ""}`}>
      <path
        d="M12 2 L12 22"
        stroke="currentColor"
        strokeWidth="2"
        className={`${isActive ? "opacity-100" : "opacity-70"}`}
      />
      <path d="M8 6 L16 6 M10 10 L14 10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 8 Q12 4 20 8 M4 12 Q12 8 20 12 M4 16 Q12 12 20 16"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        className={`${isHovered ? "translate-x-2" : "translate-x-0"} transition-transform duration-300`}
      />
    </g>
  </svg>
)

export const DecksABSigil: React.FC<SigilProps> = ({ className = "w-6 h-6", isActive, isHovered }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <g className={`transition-all duration-500 ${isHovered ? "animate-pulse" : ""}`}>
      <circle
        cx="8"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className={`${isActive ? "opacity-100" : "opacity-70"} ${isHovered ? "rotate-45" : "rotate-0"} transition-transform duration-700 origin-center`}
      />
      <circle
        cx="16"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className={`${isActive ? "opacity-100" : "opacity-70"} ${isHovered ? "-rotate-45" : "rotate-0"} transition-transform duration-700 origin-center`}
      />
      <circle cx="8" cy="12" r="1" fill="currentColor" />
      <circle cx="16" cy="12" r="1" fill="currentColor" />
      <path
        d="M12 8 L12 16"
        stroke="currentColor"
        strokeWidth="1"
        className={`${isHovered ? "scale-110" : "scale-100"} transition-transform duration-300 origin-center`}
      />
    </g>
  </svg>
)

export const AdminControlSigil: React.FC<SigilProps> = ({ className = "w-6 h-6", isActive, isHovered }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <g className={`transition-all duration-500 ${isHovered ? "animate-pulse" : ""}`}>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className={`${isActive ? "opacity-100" : "opacity-70"}`}
      />
      <path d="M8 8 L16 8 M8 12 L16 12 M8 16 L16 16" stroke="currentColor" strokeWidth="1" />
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        className={`${isHovered ? "scale-125" : "scale-100"} transition-transform duration-500`}
      />
    </g>
  </svg>
)

export const ExclusivesSigil: React.FC<SigilProps> = ({ className = "w-6 h-6", isActive, isHovered }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <g className={`transition-all duration-500 ${isHovered ? "animate-pulse" : ""}`}>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className={`${isActive ? "opacity-100" : "opacity-70"}`}
      />
      <path
        d="M12 6 L12 18 M6 12 L18 12"
        stroke="currentColor"
        strokeWidth="0.5"
        className={`${isHovered ? "rotate-45" : "rotate-0"} transition-transform duration-700 origin-center`}
      />
      <path
        d="M12 8.5 L13.5 11.5 L16.5 12 L14.5 14 L15 17 L12 15.5 L9 17 L9.5 14 L7.5 12 L10.5 11.5 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className={`${isHovered ? "scale-110" : "scale-100"} transition-transform duration-300 origin-center`}
      />
    </g>
  </svg>
)

// Brand Sigil - Layers of identity, or a stylized 'HM'
export const BrandSigil: React.FC<SigilProps> = ({ className = "w-6 h-6", isActive, isHovered }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <g className={`transition-all duration-500 ${isHovered ? "animate-pulse" : ""}`}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" className={`${isActive ? "opacity-100" : "opacity-70"}`} />
      <path d="M2 17l10 5 10-5" className={`${isHovered ? "translate-y-0.5" : ""} transition-transform duration-300`} />
      <path
        d="M2 12l10 5 10-5"
        className={`${isHovered ? "translate-y-1" : ""} transition-transform duration-500 opacity-60`}
      />
    </g>
  </svg>
)

export const DiscoverySigil: React.FC<SigilProps> = ({ className = "w-6 h-6", isActive, isHovered }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <g className={`transition-all duration-500 ${isHovered ? "animate-pulse" : ""}`}>
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className={`${isActive ? "opacity-100" : "opacity-70"} ${isHovered ? "rotate-12" : ""} transition-transform duration-700 origin-center`}
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        className={`${isHovered ? "scale-125" : ""} transition-transform duration-300`}
      />
    </g>
  </svg>
)
