"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Loader2, Wifi, WifiOff, MessageSquare, Zap, Archive, Brain, Activity } from "lucide-react"

const WS_URL = "wss://echo.websocket.org" // Placeholder WebSocket URL
const USER_ID = "user_123" // Simulated user ID

export default function WebSocketClient() {
  const [wsStatus, setWsStatus] = useState("Disconnected")
  const [messages, setMessages] = useState<Array<{ type: string; content: string }>>([])
  const [presenceUsers, setPresenceUsers] = useState<Record<string, string>>({})
  const [artifactMemory, setArtifactMemory] = useState<Record<string, any>>({})
  const [sigilChat, setSigilChat] = useState<Array<{ userId: string; message: string }>>([])
  const [telemetryData, setTelemetryData] = useState<Record<string, any>>({})

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 10
  const reconnectInterval = 3000

  const appendMessage = useCallback((type: string, content: string) => {
    setMessages((prev) => [...prev, { type, content }])
  }, [])

  const connectWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected.")
      return
    }

    setWsStatus("Connecting...")
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      setWsStatus("Connected")
      console.log("WebSocket Connected")
      reconnectAttempts.current = 0
      appendMessage("system", "WebSocket Connected!")
      sendWsMessage({ type: "userPresence", payload: { userId: USER_ID, status: "online" } })
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        appendMessage("received", event.data)

        switch (data.type) {
          case "canonizationEvent":
            appendMessage("canonization", `Canonization: ${data.payload.ceremonyId} - ${data.payload.status}`)
            break
          case "userPresence":
            setPresenceUsers((prev) => ({ ...prev, [data.payload.userId]: data.payload.status }))
            appendMessage("presence", `User ${data.payload.userId} is ${data.payload.status}`)
            break
          case "attunementPulse":
            appendMessage("attunement", `Attunement Pulse from ${data.payload.userId}`)
            break
          case "artifactSync":
            setArtifactMemory(data.payload)
            appendMessage("artifact", "Artifact Memory Synced!")
            break
          case "sigilChat":
            setSigilChat((prev) => [...prev, { userId: data.payload.userId, message: data.payload.message }])
            appendMessage("chat", `SigilChat [${data.payload.userId}]: ${data.payload.message}`)
            break
          case "telemetry":
            setTelemetryData((prev) => ({ ...prev, ...data.payload }))
            appendMessage("telemetry", `Telemetry Update: ${JSON.stringify(data.payload)}`)
            break
          default:
            appendMessage("unknown", `Unknown message type: ${data.type}`)
        }
      } catch (e: any) {
        console.error("Failed to parse WebSocket message:", e, event.data)
        appendMessage("error", `Error parsing message: ${event.data}`)
      }
    }

    ws.onclose = (event) => {
      setWsStatus("Disconnected")
      appendMessage("system", `WebSocket Disconnected: ${event.code} - ${event.reason}`)
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++
        setWsStatus(`Reconnecting (${reconnectAttempts.current})...`)
        setTimeout(connectWebSocket, reconnectInterval)
      } else {
        setWsStatus("Failed to connect after multiple attempts.")
        appendMessage("error", "Max reconnect attempts reached. Please refresh.")
      }
    }

    ws.onerror = (error) => {
      setWsStatus("Error")
      appendMessage("error", `WebSocket Error: ${error.message || "Unknown error"}`)
      ws.close()
    }

    wsRef.current = ws
  }, [appendMessage])

  const sendWsMessage = useCallback(
    (message: any) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try {
          const jsonMessage = JSON.stringify(message)
          wsRef.current.send(jsonMessage)
          appendMessage("sent", jsonMessage)
        } catch (e: any) {
          appendMessage("error", `Failed to send message: ${e.message}`)
        }
      } else {
        appendMessage("warning", "WebSocket not connected. Cannot send message.")
      }
    },
    [appendMessage],
  )

  useEffect(() => {
    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
        console.log("WebSocket closed on unmount.")
      }
    }
  }, [connectWebSocket])

  // Event triggers
  const triggerCanonizationEvent = () => {
    sendWsMessage({
      type: "canonizationEvent",
      payload: { ceremonyId: `ceremony_${Date.now()}`, status: "initiated", timestamp: Date.now() },
    })
  }

  const triggerAttunementPulse = () => {
    sendWsMessage({
      type: "attunementPulse",
      payload: { userId: USER_ID, timestamp: Date.now(), signalStrength: Math.random().toFixed(2) },
    })
  }

  const triggerArtifactSync = () => {
    sendWsMessage({
      type: "artifactSync",
      payload: {
        lastSynced: Date.now(),
        data: {
          artifact_A: { version: 2, contentHash: "abc123xyz" },
          artifact_B: { version: 5, contentHash: "def456uvw" },
        },
      },
    })
  }

  const sendSigilChatMessage = () => {
    const message = prompt("Enter SigilChat message:")
    if (message) {
      sendWsMessage({
        type: "sigilChat",
        payload: { userId: USER_ID, message, timestamp: Date.now() },
      })
    }
  }

  const sendTelemetryUpdate = () => {
    sendWsMessage({
      type: "telemetry",
      payload: {
        cpuUsage: (Math.random() * 100).toFixed(2),
        memoryUsage: (Math.random() * 1024).toFixed(2) + "MB",
        activeUsers: Object.keys(presenceUsers).length,
        timestamp: Date.now(),
      },
    })
  }

  return (
    <Card className="w-full max-w-5xl mx-auto bg-gray-800 text-gray-100 rounded-lg shadow-xl border border-primary/20">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-4xl font-bold text-purple-400">Howlin Mold WebSocket Client</CardTitle>
        <CardDescription className="text-slate-300">
          Monitor and interact with the core WebSocket services.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <span
            className={cn(
              "text-lg font-semibold px-4 py-2 rounded-full flex items-center gap-2",
              wsStatus === "Connected"
                ? "bg-green-600 text-white"
                : wsStatus.includes("Connecting") || wsStatus.includes("Reconnecting")
                  ? "bg-yellow-600 text-white"
                  : "bg-red-600 text-white",
            )}
          >
            {wsStatus === "Connected" && <Wifi className="w-5 h-5" />}
            {wsStatus.includes("Connecting") || wsStatus.includes("Reconnecting") ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : null}
            {wsStatus.includes("Disconnected") || wsStatus.includes("Error") ? <WifiOff className="w-5 h-5" /> : null}
            Status: {wsStatus}
          </span>
          {(wsStatus.includes("Disconnected") || wsStatus.includes("Error")) && (
            <Button
              onClick={connectWebSocket}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md"
            >
              Reconnect
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button onClick={triggerCanonizationEvent} className="w-full bg-purple-600 hover:bg-purple-700">
            <Zap className="w-4 h-4 mr-2" /> Trigger Canonization Event
          </Button>
          <Button onClick={triggerAttunementPulse} className="w-full bg-indigo-600 hover:bg-indigo-700">
            <Activity className="w-4 h-4 mr-2" /> Send Attunement Pulse
          </Button>
          <Button onClick={triggerArtifactSync} className="w-full bg-teal-600 hover:bg-teal-700">
            <Archive className="w-4 h-4 mr-2" /> Request Artifact Sync
          </Button>
          <Button onClick={sendSigilChatMessage} className="w-full bg-pink-600 hover:bg-pink-700">
            <MessageSquare className="w-4 h-4 mr-2" /> Send SigilChat Message
          </Button>
          <Button onClick={sendTelemetryUpdate} className="w-full bg-orange-600 hover:bg-orange-700">
            <Brain className="w-4 h-4 mr-2" /> Send Telemetry Update
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-700 border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Live Log</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 w-full rounded-md border border-primary/30 p-2 bg-gray-900 text-slate-300 text-xs font-mono">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-500 py-4">No messages yet.</div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={cn(
                        "break-words",
                        msg.type === "system" && "text-blue-400",
                        msg.type === "sent" && "text-green-400",
                        msg.type === "received" && "text-yellow-400",
                        msg.type === "error" && "text-red-400",
                        msg.type === "warning" && "text-orange-400",
                        msg.type === "canonization" && "text-purple-300",
                        msg.type === "presence" && "text-indigo-300",
                        msg.type === "attunement" && "text-cyan-300",
                        msg.type === "artifact" && "text-teal-300",
                        msg.type === "chat" && "text-pink-300",
                        msg.type === "telemetry" && "text-orange-300",
                      )}
                    >
                      {msg.content}
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="bg-gray-700 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Presence Users</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-24 w-full rounded-md border border-primary/30 p-2 bg-gray-900 text-slate-300 text-xs font-mono">
                  {Object.keys(presenceUsers).length === 0 ? (
                    <div className="text-center text-slate-500 py-2">No users present.</div>
                  ) : (
                    Object.entries(presenceUsers).map(([id, status]) => (
                      <div key={id} className="flex justify-between">
                        <span>{id}:</span>
                        <span className={cn(status === "online" ? "text-green-400" : "text-red-400")}>{status}</span>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Artifact Memory</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-24 w-full rounded-md border border-primary/30 p-2 bg-gray-900 text-slate-300 text-xs font-mono">
                  {Object.keys(artifactMemory).length === 0 ? (
                    <div className="text-center text-slate-500 py-2">No artifact data.</div>
                  ) : (
                    <pre className="whitespace-pre-wrap break-all">{JSON.stringify(artifactMemory, null, 2)}</pre>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Telemetry Data</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-24 w-full rounded-md border border-primary/30 p-2 bg-gray-900 text-slate-300 text-xs font-mono">
                  {Object.keys(telemetryData).length === 0 ? (
                    <div className="text-center text-slate-500 py-2">No telemetry data.</div>
                  ) : (
                    <pre className="whitespace-pre-wrap break-all">{JSON.stringify(telemetryData, null, 2)}</pre>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-center text-xs text-slate-500 pt-6">
        Note: This client uses a placeholder WebSocket URL (wss://echo.websocket.org) for demonstration.
      </CardFooter>
    </Card>
  )
}
