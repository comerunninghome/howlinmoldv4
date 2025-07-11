"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation" // Import useRouter
import {
  Orbit,
  Waves,
  CircleDotDashed,
  RadioTower,
  DiscAlbum,
  Gem,
  Eye,
  XSquare,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
} from "lucide-react"

// --- Portal Icons ---
const PortalIcon = ({ id, className = "w-6 h-6", color }: { id: string; className?: string; color?: string }) => {
  const iconStyle = color ? { color } : {}
  const icons: { [key: string]: React.ReactNode } = {
    "ritual-mix": <Orbit className={className} style={iconStyle} />,
    "vinyl-grid": <DiscAlbum className={className} style={iconStyle} />,
    vault: <Gem className={className} style={iconStyle} />,
    shrine: <Eye className={className} style={iconStyle} />,
    broadcast: <RadioTower className={className} style={iconStyle} />,
    "decks-ab": (
      <div className="flex items-center justify-center">
        <CircleDotDashed
          className={`${className} w-5 h-5 mr-0.5 animate-spin`}
          style={{ ...iconStyle, animationDuration: "10s" }}
        />
        <Waves className={`${className} w-5 h-5 ml-0.5`} style={iconStyle} />
      </div>
    ),
    exit: <XSquare className={className} style={iconStyle} />,
    tutorial: <HelpCircle className={className} style={iconStyle} />,
    navConsole: <SlidersHorizontal className={className} style={iconStyle} />,
  }
  return icons[id] || <div className={`${className} rounded-full`} style={{ backgroundColor: color || "#ccc" }} />
}

// --- Navigation Console Items ---
const navConsoleItems = [
  {
    id: "ritual-mix",
    label: "Ritual Mix",
    path: "/ritual-mix", // Navigates to app/ritual-mix/page.tsx
    color: "#8b5cf6",
    tutorialText: "Craft unique audio blends in the **Ritual Mix** chamber.",
  },
  {
    id: "vinyl-grid",
    label: "Vinyl Grid",
    path: "/vinyl-grid", // Navigates to app/vinyl-grid/page.tsx
    color: "#ec4899",
    tutorialText: "Explore **Vinyl Grid** artifacts and their sonic histories.",
  },
  {
    id: "vault",
    label: "The Vault",
    path: "/the-vault", // Navigates to app/the-vault/page.tsx
    color: "#06b6d4",
    tutorialText: "Enter **The Vault** to discover rare and hidden gems.",
  },
  {
    id: "shrine",
    label: "Sonic Shrine",
    path: "/sonic-shrine", // Navigates to app/sonic-shrine/page.tsx
    color: "#10b981",
    tutorialText: "Visit the **Sonic Shrine** for reflection and inspiration.",
  },
  {
    id: "broadcast",
    label: "Broadcast Booth",
    path: "/broadcast-booth", // Navigates to app/broadcast-booth/page.tsx
    color: "#ef4444",
    tutorialText: "Tune into the **Broadcast Booth** for live transmissions.",
  },
  {
    id: "decks-ab",
    label: "Decks A/B",
    path: "/decks-ab", // Navigates to app/decks-ab/page.tsx
    color: "#facc15",
    tutorialText: "Engage **Decks A & B** to sculpt your soundscapes.",
  },
]

// --- Animated Waveform & Radial Chart ---
const AnimatedWaveform = ({ points = 30, height = 40, color = "#facc15" }) => {
  const [pathData, setPathData] = useState("")
  useEffect(() => {
    const animate = () => {
      let d = "M 0 " + height / 2
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * 100
        const y =
          height / 2 +
          Math.sin(i * 0.5 + Date.now() * 0.002) * (height * 0.2) +
          Math.sin(i * 0.2 + Date.now() * 0.001) * (height * 0.3)
        d += ` L ${x} ${y}`
      }
      setPathData(d)
    }
    const id = setInterval(animate, 50)
    return () => clearInterval(id)
  }, [points, height])
  return (
    <svg viewBox={`0 0 100 ${height}`} width="100%" height="100%" preserveAspectRatio="none">
      <motion.path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        style={{ filter: `drop-shadow(0 0 5px ${color})` }}
      />
    </svg>
  )
}

const RadialChart = ({ rings = 5, color = "#f59e0b" }) => (
  <motion.div className="relative w-full h-full flex items-center justify-center">
    {Array.from({ length: rings }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border"
        style={{ borderColor: color }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: [0, 0.5, 0] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: i * 0.6, ease: "easeInOut" }}
        style={{ width: `${((i + 1) / rings) * 100}%`, height: `${((i + 1) / rings) * 100}%` }}
      />
    ))}
  </motion.div>
)

// --- Background Grid Animation ---
const BackgroundGrid = () => {
  const gridSize = 20
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: [0, 0.5, 0.2, 0.5, 0],
      transition: { duration: 8, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY, delay: i * 0.1 },
    }),
  }
  return (
    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
      {Array.from({ length: gridSize }).map((_, i) => (
        <motion.line
          key={`h-${i}`}
          x1="0%"
          y1={`${(i / (gridSize - 1)) * 100}%`}
          x2="100%"
          y2={`${(i / (gridSize - 1)) * 100}%`}
          stroke="rgba(120, 120, 120, 0.1)"
          strokeWidth="1"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          custom={i}
        />
      ))}
      {Array.from({ length: gridSize }).map((_, i) => (
        <motion.line
          key={`v-${i}`}
          x1={`${(i / (gridSize - 1)) * 100}%`}
          y1="0%"
          x2={`${(i / (gridSize - 1)) * 100}%`}
          y2="100%"
          stroke="rgba(120, 120, 120, 0.1)"
          strokeWidth="1"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          custom={i + gridSize}
        />
      ))}
    </svg>
  )
}

type TutorialStep = { id: string; text: string; targetElement?: string; color?: string } | null

// --- Main Dashboard Component ---
export default function RitualDashboard({ onExit }: { onExit: () => void }) {
  const router = useRouter() // Initialize the router
  const [activeNavItem, setActiveNavItem] = useState<string | null>(navConsoleItems[0].id)
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null)
  const [runTutorial, setRunTutorial] = useState(false)
  const [tutorialStepIndex, setTutorialStepIndex] = useState(0)

  const tutorialConfig = [
    {
      id: "nav-console-intro",
      text: "This is the **Navigation Console**. Select an item to tune into a Howlin Mold chamber. Clicking an active item will navigate you.",
      targetElement: "nav-console",
      color: "#eab308",
    },
    ...navConsoleItems.map((item) => ({
      id: `nav-item-${item.id}`,
      text: item.tutorialText,
      targetElement: `nav-item-${item.id}`,
      color: item.color,
    })),
    {
      id: "tutorial-exit-buttons",
      text: "Use these controls to **manage the tutorial** or **exit the dashboard**.",
      targetElement: "fixed-controls",
      color: "#3b82f6",
    },
  ]

  const currentTutorialStep: TutorialStep = runTutorial ? tutorialConfig[tutorialStepIndex] : null

  const startTutorial = useCallback(() => {
    setTutorialStepIndex(0)
    setRunTutorial(true)
    setActiveNavItem(null)
  }, [])

  const nextTutorialStep = () => setTutorialStepIndex((prev) => (prev + 1) % tutorialConfig.length)
  const prevTutorialStep = () =>
    setTutorialStepIndex((prev) => (prev - 1 + tutorialConfig.length) % tutorialConfig.length)
  const endTutorial = () => {
    setRunTutorial(false)
    setActiveNavItem(navConsoleItems[0].id)
  }

  useEffect(() => {
    const hasVisited = localStorage.getItem("ritualDashboardVisited_v3")
    if (!hasVisited) {
      startTutorial()
      localStorage.setItem("ritualDashboardVisited_v3", "true")
    }
  }, [startTutorial])

  const handleNavItemClick = (item: (typeof navConsoleItems)[0]) => {
    if (runTutorial) return // Disable navigation during tutorial

    if (activeNavItem === item.id) {
      // If the item is already active, navigate to its path.
      router.push(item.path)
    } else {
      // Otherwise, just set it as the active item in the dashboard.
      setActiveNavItem(item.id)
    }
  }

  const numNavItems = navConsoleItems.length
  const angleStep = 360 / numNavItems
  const consoleRadius = 140

  return (
    <div className="relative flex items-center justify-center w-full h-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden font-mono text-white">
      <BackgroundGrid />

      <motion.div
        className="absolute w-64 h-64 opacity-20"
        animate={{
          scale: activeNavItem ? 1.2 : 1,
          opacity: activeNavItem ? 0.3 : 0.1,
          borderColor: navConsoleItems.find((item) => item.id === activeNavItem)?.color || "#facc15",
        }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <RadialChart rings={7} color={navConsoleItems.find((item) => item.id === activeNavItem)?.color || "#facc15"} />
      </motion.div>

      <motion.div
        className="absolute w-96 h-24 opacity-30"
        animate={{ y: activeNavItem ? 20 : -20, opacity: activeNavItem ? 0.4 : 0.2 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <AnimatedWaveform
          points={50}
          height={60}
          color={navConsoleItems.find((item) => item.id === activeNavItem)?.color || "#06b6d4"}
        />
      </motion.div>

      <motion.div id="nav-console" className="absolute left-1/2 w-1 h-1 top-[45%]">
        {navConsoleItems.map((item, index) => {
          const angle = angleStep * index - 90
          const x = Math.cos((angle * Math.PI) / 180) * consoleRadius
          const y = Math.sin((angle * Math.PI) / 180) * consoleRadius
          const isCurrentTutorialTarget = runTutorial && currentTutorialStep?.targetElement === `nav-item-${item.id}`

          return (
            <motion.button
              key={item.id}
              id={`nav-item-${item.id}`}
              className="absolute flex flex-col items-center justify-center cursor-pointer group"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
                minWidth: "80px",
                zIndex: activeNavItem === item.id || isCurrentTutorialTarget ? 20 : 10,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: activeNavItem === item.id || isCurrentTutorialTarget ? 1.15 : 1,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              whileHover={{ scale: 1.1 }}
              onHoverStart={() => setHoveredNavItem(item.id)}
              onHoverEnd={() => setHoveredNavItem(null)}
              onClick={() => handleNavItemClick(item)} // Updated onClick handler
            >
              <div
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                style={{
                  borderColor: item.color + "80",
                  backgroundColor: item.color + "33",
                  boxShadow:
                    activeNavItem === item.id || isCurrentTutorialTarget
                      ? `0 0 20px ${item.color}`
                      : hoveredNavItem === item.id
                        ? `0 0 15px ${item.color}`
                        : `0 0 8px ${item.color}80`,
                }}
              >
                <PortalIcon id={item.id} className="w-8 h-8" color={item.color} />
              </div>
              <span
                className="mt-2 text-xs font-orbitron font-semibold transition-all duration-300 group-hover:text-yellow-400 text-center tracking-wider"
                style={{
                  color:
                    activeNavItem === item.id || isCurrentTutorialTarget ? item.color : "hsl(var(--foreground)/0.7)",
                  textShadow: activeNavItem === item.id || isCurrentTutorialTarget ? `0 0 8px ${item.color}` : "none",
                }}
              >
                {item.label.toUpperCase()}
              </span>
              {(isCurrentTutorialTarget ||
                (runTutorial && currentTutorialStep?.targetElement === "nav-console" && index === 0)) && (
                <motion.div className="absolute inset-[-6px] rounded-full border-2 border-yellow-400 animate-pulse" />
              )}
            </motion.button>
          )
        })}
        <motion.div className="absolute w-20 h-20 rounded-full border-2 border-amber-500/50 bg-black/50 top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <PortalIcon id="navConsole" className="w-10 h-10 text-amber-400" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {activeNavItem && !runTutorial && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-xl max-w-md text-center border-2 backdrop-blur-sm"
            style={{ borderColor: navConsoleItems.find((item) => item.id === activeNavItem)?.color || "#facc15" }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            <div className="flex items-center justify-center mb-3">
              <PortalIcon
                id={activeNavItem}
                className="w-10 h-10 mr-3"
                color={navConsoleItems.find((item) => item.id === activeNavItem)?.color}
              />
              <h3
                className="text-2xl font-bold capitalize"
                style={{ color: navConsoleItems.find((item) => item.id === activeNavItem)?.color || "#facc15" }}
              >
                {navConsoleItems.find((item) => item.id === activeNavItem)?.label}
              </h3>
            </div>
            <p className="text-gray-300 text-sm">
              Tuned into: {navConsoleItems.find((item) => item.id === activeNavItem)?.label}. Signal active. Click again
              to enter.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {runTutorial && currentTutorialStep && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 bg-opacity-95 p-6 rounded-xl shadow-2xl border-2 max-w-md text-center backdrop-blur-md"
              style={{ borderColor: currentTutorialStep.color || "#facc15" }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <div className="flex items-center justify-center mb-4">
                <PortalIcon
                  id={
                    currentTutorialStep.targetElement?.startsWith("nav-item-")
                      ? currentTutorialStep.targetElement.replace("nav-item-", "")
                      : "navConsole"
                  }
                  className="w-10 h-10 mr-3"
                  color={currentTutorialStep.color}
                />
                <h3 className="text-2xl font-extrabold" style={{ color: currentTutorialStep.color || "#facc15" }}>
                  {currentTutorialStep.targetElement === "nav-console"
                    ? "Navigation Console"
                    : navConsoleItems.find((item) => `nav-item-${item.id}` === currentTutorialStep.targetElement)
                        ?.label || "Guidance"}
                </h3>
              </div>
              <p
                className="text-foreground/90 font-poetic text-lg mb-6 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentTutorialStep.text }}
              />
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={prevTutorialStep}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors duration-200"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="w-6 h-6 text-yellow-400" />
                </button>
                <span className="text-yellow-300 text-lg font-semibold">
                  {tutorialStepIndex + 1} / {tutorialConfig.length}
                </span>
                <button
                  onClick={nextTutorialStep}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors duration-200"
                  aria-label="Next step"
                >
                  <ChevronRight className="w-6 h-6 text-yellow-400" />
                </button>
              </div>
              <button
                onClick={endTutorial}
                className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors transform hover:scale-105"
              >
                End Tutorial
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="fixed-controls" className="absolute top-8 right-8 flex space-x-4 z-40">
        {!runTutorial && (
          <motion.button
            onClick={startTutorial}
            className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            title="Start Tutorial"
          >
            <HelpCircle className="w-7 h-7 text-white" />
          </motion.button>
        )}
        <motion.button
          onClick={onExit}
          className="p-3 bg-red-600 hover:bg-red-700 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, rotate: -10 }}
          whileTap={{ scale: 0.9 }}
          title="Exit Dashboard"
        >
          <XSquare className="w-7 h-7 text-white" />
        </motion.button>
      </div>
    </div>
  )
}
