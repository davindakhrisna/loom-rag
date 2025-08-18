"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDaysWithNotes } from "@/lib/dashboard/notes/calendar/actions"
import { SessionProps } from "@/types/session"

export default function CalendarSection({ session }: SessionProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [daysWithNotes, setDaysWithNotes] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchDaysWithNotes = async () => {
      if (!session?.user?.id) return

      try {
        const days = await getDaysWithNotes(session.user.id)
        setDaysWithNotes(new Set(days))
      } catch (error) {
        console.error('Failed to fetch days with notes:', error)
      }
    }

    fetchDaysWithNotes()
  }, [session?.user?.id])

  const dayHasNote = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return daysWithNotes.has(dateStr)
  }

  return (
    <Card className="min-h-118">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="text-xl dark:text-white">Progress Calendar</CardTitle>
        <CardDescription>Shows how your progress been going</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow-sm"
          captionLayout="dropdown"
          modifiers={{
            hasNote: (day) => dayHasNote(day)
          }}
          modifiersClassNames={{
            hasNote: 'text-green-400'
          }}
        />
      </CardContent>
    </Card>
  )
}
