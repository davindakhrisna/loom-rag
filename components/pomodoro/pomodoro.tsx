"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
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
    const audio = new Audio("/audio/notification.wav")
    audio.preload = "auto"
    audioRef.current = audio

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Prime audio on first user interaction
  const primeAudio = useCallback(() => {
    if (audioRef.current && settings.soundEnabled) {
      audioRef.current.play().then(() => {
        audioRef.current?.pause()
        audioRef.current!.currentTime = 0
      }).catch(() => { /* ignore autoplay error */ })
    }
  }, [settings.soundEnabled])

  // Play sound notification
  const playSound = useCallback(() => {
    if (settings.soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((error) => {
        console.warn("Failed to play sound (autoplay blocked?)", error)
      })
    }
  }, [settings.soundEnabled])

  // Update timer duration when mode or settings change
  useEffect(() => {
    if (mode === "work") {
      setTimeLeft(settings.workDuration * 60)
    } else if (mode === "shortBreak") {
      setTimeLeft(settings.shortBreakDuration * 60)
    } else {
      setTimeLeft(settings.longBreakDuration * 60)
    }
  }, [mode, settings])

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
      playSound()

      if (mode === "work") {
        const newCompletedSessions = completedSessions + 1
        setCompletedSessions(newCompletedSessions)

        const isLongBreak = newCompletedSessions % settings.sessionsUntilLongBreak === 0
        const nextMode = isLongBreak ? "longBreak" : "shortBreak"
        setMode(nextMode)

        const nextDuration = isLongBreak
          ? settings.longBreakDuration * 60
          : settings.shortBreakDuration * 60
        setTimeLeft(nextDuration)

        if (settings.autoStartBreaks) {
          setIsRunning(true)
        }
      } else {
        setMode("work")
        setTimeLeft(settings.workDuration * 60)
        if (settings.autoStartWork) {
          setIsRunning(true)
        }
      }
    }
  }, [
    timeLeft,
    isRunning,
    mode,
    completedSessions,
    settings.autoStartBreaks,
    settings.autoStartWork,
    settings.sessionsUntilLongBreak,
    settings.workDuration,
    settings.shortBreakDuration,
    settings.longBreakDuration,
    playSound,
  ])

  // Memoize total time and progress
  const totalTime = useMemo(() => {
    if (mode === "work") return settings.workDuration * 60
    if (mode === "shortBreak") return settings.shortBreakDuration * 60
    return settings.longBreakDuration * 60
  }, [mode, settings])

  const progress = useMemo(() => {
    return totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0
  }, [totalTime, timeLeft])

  const CIRCUMFERENCE = 2 * Math.PI * 45 // Precompute circumference

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  // Unified settings updater
  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }, [])

  // Controls
  const handleStart = useCallback(() => {
    setIsRunning(true)
    primeAudio() // Unlock audio on first interaction
  }, [primeAudio])

  const handlePause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    if (mode === "work") {
      setTimeLeft(settings.workDuration * 60)
    } else if (mode === "shortBreak") {
      setTimeLeft(settings.shortBreakDuration * 60)
    } else {
      setTimeLeft(settings.longBreakDuration * 60)
    }
  }, [mode, settings])

  const getModeLabel = useCallback(() => {
    switch (mode) {
      case "work": return "Focus Time"
      case "shortBreak": return "Short Break"
      case "longBreak": return "Long Break"
    }
  }, [mode])

  const getModeColor = useCallback(() => {
    switch (mode) {
      case "work": return "bg-red-500"
      case "shortBreak": return "bg-green-500"
      case "longBreak": return "bg-blue-500"
    }
  }, [mode])

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={`${getModeColor()} text-white border-0`}>
              {getModeLabel()}
            </Badge>
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open settings">
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
                      <Label htmlFor="work" className="mb-2">Work (minutes)</Label>
                      <Input
                        id="work"
                        type="number"
                        min="1"
                        max="60"
                        value={settings.workDuration}
                        onChange={(e) =>
                          updateSetting("workDuration", Math.max(1, parseInt(e.target.value) || 25))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="shortBreak" className="mb-2">Short Break</Label>
                      <Input
                        id="shortBreak"
                        type="number"
                        min="1"
                        max="30"
                        value={settings.shortBreakDuration}
                        onChange={(e) =>
                          updateSetting("shortBreakDuration", Math.max(1, parseInt(e.target.value) || 5))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="longBreak" className="mb-2">Long Break</Label>
                      <Input
                        id="longBreak"
                        type="number"
                        min="1"
                        max="60"
                        value={settings.longBreakDuration}
                        onChange={(e) =>
                          updateSetting("longBreakDuration", Math.max(1, parseInt(e.target.value) || 15))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="sessions" className="mb-2">Sessions until Long Break</Label>
                      <Input
                        id="sessions"
                        type="number"
                        min="2"
                        max="10"
                        value={settings.sessionsUntilLongBreak}
                        onChange={(e) =>
                          updateSetting("sessionsUntilLongBreak", Math.max(2, parseInt(e.target.value) || 4))
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
                        onCheckedChange={(checked) => updateSetting("autoStartBreaks", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoWork">Auto-start work</Label>
                      <Switch
                        id="autoWork"
                        checked={settings.autoStartWork}
                        onCheckedChange={(checked) => updateSetting("autoStartWork", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound">Sound notifications</Label>
                      <Switch
                        id="sound"
                        checked={settings.soundEnabled}
                        onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
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
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}
                className={`transition-all duration-1000 ${mode === "work" ? "text-red-500" : mode === "shortBreak" ? "text-green-500" : "text-blue-500"}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold" aria-live="polite">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {settings.soundEnabled ? (
                    <Volume2 className="h-4 w-4 mx-auto" aria-label="Sound enabled" />
                  ) : (
                    <VolumeX className="h-4 w-4 mx-auto" aria-label="Sound disabled" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <Button onClick={handleStart} size="lg" className="px-8" aria-label="Start timer">
                <Play className="h-5 w-5 mr-2" />
                Start
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                size="lg"
                variant="secondary"
                className="px-8"
                aria-label="Pause timer"
              >
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </Button>
            )}
            <Button
              onClick={handleReset}
              size="lg"
              variant="outline"
              aria-label="Reset timer"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>

          {/* Session Progress */}
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">
              Completed Sessions: {completedSessions}
            </div>
            <div className="flex justify-center gap-1">
              {Array.from({ length: settings.sessionsUntilLongBreak }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${i < (completedSessions % settings.sessionsUntilLongBreak)
                    ? "bg-primary"
                    : "bg-muted-foreground/20"
                    }`}
                  aria-label={
                    i < completedSessions % settings.sessionsUntilLongBreak
                      ? `Completed session ${i + 1}`
                      : `Pending session ${i + 1}`
                  }
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <p className="mt-8 text-sm text-gray-400">Disclamer: Your progress will dissapear if you move to other page</p>
    </div>
  )
}
