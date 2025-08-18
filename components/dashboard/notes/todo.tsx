"use client"

import { useEffect, useState } from "react"
import { Plus, X, Sunrise, Moon, Sun } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  getTodos,
  createTodo,
  deleteTodo,
  toggleTodo,
  getOrCreateTodayTodo
} from "@/lib/dashboard/notes/todo/actions"
import { SessionProps } from "@/types/session"
import { TimeSlotType, TodoState, Period } from "@/types/todo"

export default function TodoListSection({ session }: SessionProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTimeSlot, setActiveTimeSlot] = useState<TimeSlotType>("morning")
  const [todos, setTodos] = useState<TodoState>({
    morning: [],
    noon: [],
    evening: []
  })
  const [newTodo, setNewTodo] = useState("")
  const [currentTodoId, setCurrentTodoId] = useState<string | null>(null)

  useEffect(() => {
    const loadTodos = async () => {
      if (!session?.user?.id) return

      try {
        // Get or create today's todo and set the ID
        const todo = await getOrCreateTodayTodo(session.user.id)
        setCurrentTodoId(todo.id)

        // Fetch all time slots for today
        const timeSlots = await getTodos(session.user.id)

        // Transform time slots into the expected state format
        const formattedTodos = timeSlots.reduce((acc, slot) => {
          const period = slot.period.toLowerCase() as TimeSlotType
          if (!acc[period]) acc[period] = []

          acc[period].push({
            ...slot,
            text: slot.text || ''
          })
          return acc
        }, {} as TodoState)

        setTodos({
          morning: formattedTodos.morning || [],
          noon: formattedTodos.noon || [],
          evening: formattedTodos.evening || []
        })
      } catch (error) {
        console.error('Error loading todos:', error)
      }
    }

    loadTodos()
  }, [session?.user?.id])

  const openDrawer = (timeSlot: TimeSlotType) => {
    setActiveTimeSlot(timeSlot)
    setIsDrawerOpen(true)
  }

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      await toggleTodo(id, completed)
      setTodos(prev => ({
        ...prev,
        [activeTimeSlot]: prev[activeTimeSlot].map(todo =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      }))
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  const handleAddTodo = async () => {
    if (!newTodo.trim() || !currentTodoId) return

    try {
      const period = activeTimeSlot.charAt(0).toUpperCase() + activeTimeSlot.slice(1) as Period
      const newTodoItem = await createTodo(currentTodoId, period, newTodo.trim())

      setTodos(prev => ({
        ...prev,
        [activeTimeSlot]: [
          ...prev[activeTimeSlot],
          { ...newTodoItem, text: newTodoItem.text || '' }
        ]
      }))

      setNewTodo("")
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id)
      setTodos(prev => ({
        ...prev,
        [activeTimeSlot]: prev[activeTimeSlot].filter(todo => todo.id !== id)
      }))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const getTimeSlotTitle = (slot: TimeSlotType) => {
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

  const getTimeSlotIcon = (slot: TimeSlotType) => {
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
                <Sunrise className="w-6 h-6" />
              </CardContent>
            </Card>

            {/* Noon Block */}
            <Card
              className="justify-center items-center flex min-h-28 bg-amber-500 cursor-pointer hover:bg-amber-600 transition-colors"
              onClick={() => openDrawer("noon")}
            >
              <CardContent className="flex flex-col justify-center items-center gap-2">
                <Sun className="w-6 h-6" />
              </CardContent>
            </Card>

            {/* Evening Block */}
            <Card
              className="justify-center items-center flex min-h-28 bg-blue-500 cursor-pointer hover:bg-blue-600 transition-colors"
              onClick={() => openDrawer("evening")}
            >
              <CardContent className="flex flex-col justify-center items-center gap-2">
                <Moon className="w-6 h-6" />
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
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                maxLength={32}
                className="flex-1"
              />
              <Button
                onClick={handleAddTodo}
                size="sm"
                disabled={!newTodo.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground mb-4 flex-shrink-0">{newTodo.length}/32 characters</div>

            <div className="space-y-2 overflow-y-auto flex-1">
              {todos[activeTimeSlot]?.map((todo) => (
                <Card
                  key={todo.id}
                  className="flex flex-row items-center justify-between p-3"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleTodo(todo.id, todo.completed)}
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}
                    >
                      {todo.text}
                    </label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
              {todos[activeTimeSlot]?.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No tasks yet. Add one above!</p>
                </div>
              )}
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
