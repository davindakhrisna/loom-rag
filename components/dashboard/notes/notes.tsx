"use client"

import { useState } from "react"
import * as React from "react"
import Link from "next/link"
import { Edit, Plus, Heart, ChevronLeft, Asterisk, X, ChevronRight, Sunrise, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

export function TodoListSection() {
  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-white">Todo List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {/* Morning Block */}
          <Link href="/dashboard/notes/todo">
            <Card className="justify-center items-center flex min-h-28 bg-red-500 cursor-pointer hover:bg-red-600 transition-colors">
              <CardContent className="flex flex-col justify-center items-center gap-2">
                <Sunrise />
              </CardContent>
            </Card>
          </Link>

          {/* Noon Block */}
          <Link href="/dashboard/notes/todo">
            <Card className="justify-center items-center flex min-h-28 bg-amber-400 cursor-pointer hover:bg-amber-500 transition-colors">
              <CardContent className="flex flex-col justify-center items-center gap-2">
                <Sun />
              </CardContent>
            </Card>
          </Link>

          {/* Evening Block */}
          <Link href="/dashboard/notes/todo">
            <Card className="justify-center items-center flex min-h-28 bg-indigo-700 cursor-pointer hover:bg-blue-900 transition-colors">
              <CardContent className="flex flex-col justify-center items-center gap-2">
                <Moon />
              </CardContent>
            </Card>
          </Link>

        </div>
      </CardContent>
    </Card>
  )
}

export function TodaysNotesSection() {
  const [currentPage, setCurrentPage] = useState(0)
  const notesPerPage = 3

  const todaysNotes = [
    {
      id: 1,
      title: "Meeting Notes - Project Alpha",
      content: "Discussed timeline and deliverables. Need to follow up on budget approval.",
      time: "2:30 PM",
    },
    {
      id: 2,
      title: "Ideas for Blog Post",
      content: "Write about productivity tips for remote workers. Include personal experiences.",
      time: "11:15 AM",
    },
    {
      id: 3,
      title: "Quick Reminder",
      content: "Don't forget to backup project files before the weekend.",
      time: "9:45 AM",
    },
    {
      id: 4,
      title: "Research Notes",
      content: "Found interesting article about AI trends. Need to bookmark for later reading.",
      time: "8:20 AM",
    },
  ]

  const totalPages = Math.ceil(todaysNotes.length / notesPerPage)
  const currentNotes = todaysNotes.slice(currentPage * notesPerPage, (currentPage + 1) * notesPerPage)

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-white">Today&apos;s Notes</CardTitle>
        <Link href="/dashboard/notes/log">
          <Button variant="outline" size="sm" className="border-gray-600 cursor-pointer text-gray-300 hover:bg-gray-700 bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="sm:min-h-90.5 flex flex-col justify-between">
        <div className="space-y-4">
          {currentNotes.map((note) => (
            <Card key={note.id} className="py-4 border-l-4 border-l-blue-400">
              <CardContent className="">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-white">{note.title}</h3>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-400">{note.time}</span>
                    <Button variant="ghost" size="sm" className="cursor-pointer h-6 w-6 p-0 text-gray-400 hover:bg-gray-600">
                      <Edit />
                    </Button>
                    <Button variant="ghost" size="sm" className="cursor-pointer h-6 w-6 p-0 text-gray-400 hover:bg-gray-600">
                      <X />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{note.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="cursor-pointer border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-400">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="cursor-pointer border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MotivationBlock() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-white">
          <Heart className="w-5 h-5 mr-2 text-red-500" />
          Daily Motivation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="text-sm italic text-gray-300 leading-relaxed">
          &quot;Everything you do and its consequences, is your choice.&quot;
        </blockquote>
      </CardContent>
    </Card>
  )
}

export function CalendarSection() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <Card className="mb-8 min-h-117">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="text-xl text-white">Progress Calendar</CardTitle>
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

export function ActionButton() {
  return (
    <Button className="w-full cursor-pointer">
      <Link href="/dashboard" className="w-full flex items-center justify-center gap-1">
        <Asterisk />
        Your Current Level: 69

      </Link>
    </Button>
  )
}
