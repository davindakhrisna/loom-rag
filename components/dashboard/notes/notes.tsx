"use client"

import { useState } from "react"
import * as React from "react"
import Link from "next/link"
import { Edit, Plus, Heart, ChevronLeft, Asterisk, X, ChevronRight, Sunrise, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export function TodoListSection() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTimeSlot, setActiveTimeSlot] = useState<"morning" | "noon" | "evening">("morning")
  const [todos, setTodos] = useState({
    morning: [
      { id: 1, text: "Review daily goals", completed: false },
      { id: 2, text: "Check emails", completed: true },
      { id: 3, text: "Morning workout", completed: false },
    ],
    noon: [
      { id: 4, text: "Team meeting", completed: false },
      { id: 5, text: "Project review", completed: true },
      { id: 6, text: "Lunch break", completed: false },
    ],
    evening: [
      { id: 7, text: "Wrap up tasks", completed: false },
      { id: 8, text: "Plan tomorrow", completed: false },
      { id: 9, text: "Personal time", completed: true },
    ],
  })
  const [newTodo, setNewTodo] = useState("")

  const openDrawer = (timeSlot: "morning" | "noon" | "evening") => {
    setActiveTimeSlot(timeSlot)
    setIsDrawerOpen(true)
  }

  const toggleTodo = (id: number) => {
    setTodos((prev) => ({
      ...prev,
      [activeTimeSlot]: prev[activeTimeSlot].map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    }))
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      const newId =
        Math.max(
          ...Object.values(todos)
            .flat()
            .map((t) => t.id),
        ) + 1
      setTodos((prev) => ({
        ...prev,
        [activeTimeSlot]: [...prev[activeTimeSlot], { id: newId, text: newTodo.trim(), completed: false }],
      }))
      setNewTodo("")
    }
  }

  const deleteTodo = (id: number) => {
    setTodos((prev) => ({
      ...prev,
      [activeTimeSlot]: prev[activeTimeSlot].filter((todo) => todo.id !== id),
    }))
  }

  const getTimeSlotTitle = (slot: string) => {
    switch (slot) {
      case "morning":
        return "Morning Tasks"
      case "noon":
        return "Afternoon Tasks"
      case "evening":
        return "Evening Tasks"
      default:
        return "Tasks"
    }
  }

  const getTimeSlotIcon = (slot: string) => {
    switch (slot) {
      case "morning":
        return <Sunrise className="w-5 h-5" />
      case "noon":
        return <Sun className="w-5 h-5" />
      case "evening":
        return <Moon className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <>
      <Card className="h-fit">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl dark:text-white">Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {/* Morning Block */}
            <Card
              className="justify-center items-center flex min-h-28 bg-red-500 cursor-pointer hover:bg-red-600 transition-colors"
              onClick={() => openDrawer("morning")}
            >
              <CardContent className="flex flex-col justify-center items-center gap-2">
                <Sunrise />
              </CardContent>
            </Card>

            {/* Noon Block */}
            <Card
              className="justify-center items-center flex min-h-28 bg-amber-500 cursor-pointer hover:bg-amber-600 transition-colors"
              onClick={() => openDrawer("noon")}
            >
              <CardContent className="flex flex-col justify-center items-center gap-2">
                <Sun />
              </CardContent>
            </Card>

            {/* Evening Block */}
            <Card
              className="justify-center items-center flex min-h-28 bg-blue-500 cursor-pointer hover:bg-blue-600 transition-colors"
              onClick={() => openDrawer("evening")}
            >
              <CardContent className="flex flex-col justify-center items-center gap-2">
                <Moon />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Todo Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] ml-auto mr-0 flex flex-col">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle className="flex items-center gap-2">
              {getTimeSlotIcon(activeTimeSlot)}
              {getTimeSlotTitle(activeTimeSlot)}
            </SheetTitle>
            <SheetDescription>Manage your {activeTimeSlot} tasks and stay organized</SheetDescription>
          </SheetHeader>

          <div className="flex-1 flex flex-col mt-6 min-h-0">
            <div className="flex gap-2 flex-shrink-0 mb-4">
              <Input
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                maxLength={32}
                className="flex-1"
              />
              <Button onClick={addTodo} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground mb-4 flex-shrink-0">{newTodo.length}/32 characters</div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {todos[activeTimeSlot].map((todo) => (
                <div key={todo.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="mt-0.5 flex-shrink-0 cursor-pointer"
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`flex-1 text-sm cursor-pointer break-words leading-relaxed ${todo.completed ? "line-through text-muted-foreground" : ""
                      }`}
                  >
                    {todo.text}
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                    className="h-8 w-8 p-0 text-muted-foreground cursor-pointer hover:text-destructive flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 rounded-lg bg-muted flex-shrink-0">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>
                  {todos[activeTimeSlot].filter((t) => t.completed).length} / {todos[activeTimeSlot].length} completed
                </span>
              </div>
              <div className="mt-2 w-full bg-background rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(todos[activeTimeSlot].filter((t) => t.completed).length / todos[activeTimeSlot].length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
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
        <CardTitle className="text-xl dark:text-white">Today&apos;s Notes</CardTitle>
        <Link href="/dashboard/notes/log">
          <Button variant="outline" size="sm" className="border-black dark:border-gray-600 cursor-pointer text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="sm:min-h-90.5 flex flex-col justify-between">
        <div className="space-y-4">
          {currentNotes.map((note) => (
            <Card key={note.id} className="py-4 border-l-4 border-l-blue-500">
              <CardContent className="">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium dark:text-white">{note.title}</h3>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs dark:text-gray-400">{note.time}</span>
                    <Button variant="ghost" size="sm" className="cursor-pointer h-6 w-6 p-0 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <Edit />
                    </Button>
                    <Button variant="ghost" size="sm" className="cursor-pointer h-6 w-6 p-0 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <X />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed">{note.content}</p>
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
              className="cursor-pointer border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 bg-transparent"
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
              className="cursor-pointer border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 bg-transparent"
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
        <CardTitle className="flex items-center text-lg dark:text-white">
          <Heart className="w-5 h-5 mr-2 text-red-500" />
          Daily Motivation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="text-sm italic text-gray-600 dark:text-gray-300 leading-relaxed">
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
