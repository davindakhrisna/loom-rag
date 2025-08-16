"use client"

import { useState } from "react"
import { Plus, X, Sunrise, Moon, Sun } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export default function TodoListSection() {
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
          <Button
            size="icon"
            className={`absolute left-0 top-1/2 -translate-x-1/2 rounded-full cursor-pointer w-8 h-12 shadow-md ${activeTimeSlot === 'morning' ? 'dark:text-white bg-red-500 hover:bg-red-600' :
              activeTimeSlot === 'noon' ? 'dark:text-white bg-amber-500 hover:bg-amber-600' :
                'dark:text-white bg-blue-500 hover:bg-blue-600'
              }`}
            onClick={() => setIsDrawerOpen(false)}
          >
            {getTimeSlotIcon(activeTimeSlot)}
          </Button>
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
