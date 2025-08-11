"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, SettingsIcon, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

type TimerMode = "work" | "shortBreak" | "longBreak"

interface Settings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsUntilLongBreak: number
  autoStartBreaks: boolean
  autoStartWork: boolean
  soundEnabled: boolean
}

export default function PomodoroTimer() {
  const [settings, setSettings] = useState<Settings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: false,
    autoStartWork: false,
    soundEnabled: true,
  })

  const [mode, setMode] = useState<TimerMode>("work")
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/audio/notification.wav")
    audioRef.current.preload = "auto"
    return () => {
      if (audioRef.current) {
        audioRef.current = null
      }
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false)

      // Play sound notification
      if (settings.soundEnabled && audioRef.current) {
        audioRef.current.play().catch(() => {
          // Ignore audio play errors
        })
      }

      if (mode === "work") {
        const newCompletedSessions = completedSessions + 1
        setCompletedSessions(newCompletedSessions)

        // Determine next break type
        const isLongBreak = newCompletedSessions % settings.sessionsUntilLongBreak === 0
        const nextMode = isLongBreak ? "longBreak" : "shortBreak"
        setMode(nextMode)

        const nextDuration = isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration
        setTimeLeft(nextDuration * 60)

        if (settings.autoStartBreaks) {
          setIsRunning(true)
        }
      } else {
        // Break finished, switch to work
        setMode("work")
        setTimeLeft(settings.workDuration * 60)

        if (settings.autoStartWork) {
          setIsRunning(true)
        }
      }
    }
  }, [timeLeft, isRunning, mode, completedSessions, settings])

  // Update timer when settings change
  useEffect(() => {
    if (mode === "work") {
      setTimeLeft(settings.workDuration * 60)
    } else if (mode === "shortBreak") {
      setTimeLeft(settings.shortBreakDuration * 60)
    } else {
      setTimeLeft(settings.longBreakDuration * 60)
    }
  }, [settings, mode])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getTotalTime = () => {
    if (mode === "work") return settings.workDuration * 60
    if (mode === "shortBreak") return settings.shortBreakDuration * 60
    return settings.longBreakDuration * 60
  }

  const getProgress = () => {
    const total = getTotalTime()
    return ((total - timeLeft) / total) * 100
  }

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    if (mode === "work") {
      setTimeLeft(settings.workDuration * 60)
    } else if (mode === "shortBreak") {
      setTimeLeft(settings.shortBreakDuration * 60)
    } else {
      setTimeLeft(settings.longBreakDuration * 60)
    }
  }

  const getModeLabel = () => {
    switch (mode) {
      case "work":
        return "Focus Time"
      case "shortBreak":
        return "Short Break"
      case "longBreak":
        return "Long Break"
    }
  }

  const getModeColor = () => {
    switch (mode) {
      case "work":
        return "bg-red-500"
      case "shortBreak":
        return "bg-green-500"
      case "longBreak":
        return "bg-blue-500"
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={`${getModeColor()} text-white border-0`}>
              {getModeLabel()}
            </Badge>
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <SettingsIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Timer Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="work">Work (minutes)</Label>
                      <Input
                        id="work"
                        type="number"
                        min="1"
                        max="60"
                        value={settings.workDuration}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            workDuration: Number.parseInt(e.target.value) || 25,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="shortBreak">Short Break</Label>
                      <Input
                        id="shortBreak"
                        type="number"
                        min="1"
                        max="30"
                        value={settings.shortBreakDuration}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            shortBreakDuration: Number.parseInt(e.target.value) || 5,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="longBreak">Long Break</Label>
                      <Input
                        id="longBreak"
                        type="number"
                        min="1"
                        max="60"
                        value={settings.longBreakDuration}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            longBreakDuration: Number.parseInt(e.target.value) || 15,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="sessions">Sessions until Long Break</Label>
                      <Input
                        id="sessions"
                        type="number"
                        min="2"
                        max="10"
                        value={settings.sessionsUntilLongBreak}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            sessionsUntilLongBreak: Number.parseInt(e.target.value) || 4,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoBreaks">Auto-start breaks</Label>
                      <Switch
                        id="autoBreaks"
                        checked={settings.autoStartBreaks}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            autoStartBreaks: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoWork">Auto-start work</Label>
                      <Switch
                        id="autoWork"
                        checked={settings.autoStartWork}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            autoStartWork: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound">Sound notifications</Label>
                      <Switch
                        id="sound"
                        checked={settings.soundEnabled}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            soundEnabled: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <CardTitle className="text-sm text-muted-foreground">Session {completedSessions + 1}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {/* Circular Progress */}
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-muted-foreground/20"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                className={`transition-all duration-1000 ${mode === "work" ? "text-red-500" : mode === "shortBreak" ? "text-green-500" : "text-blue-500"
                  }`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold">{formatTime(timeLeft)}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {settings.soundEnabled ? (
                    <Volume2 className="h-4 w-4 mx-auto" />
                  ) : (
                    <VolumeX className="h-4 w-4 mx-auto" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <Button onClick={handleStart} size="lg" className="px-8">
                <Play className="h-5 w-5 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} size="lg" variant="secondary" className="px-8">
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={handleReset} size="lg" variant="outline">
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>

          {/* Session Progress */}
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Completed Sessions: {completedSessions}</div>
            <div className="flex justify-center gap-1">
              {Array.from({ length: settings.sessionsUntilLongBreak }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${i < (completedSessions % settings.sessionsUntilLongBreak) ? "bg-primary" : "bg-muted-foreground/20"
                    }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
