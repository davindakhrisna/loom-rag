"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CalendarSection() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <Card className="mb-8 min-h-117">
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
        />
      </CardContent>
    </Card>
  )
}
