export type Period = 'Morning' | 'Noon' | 'Evening'

export type TimeSlot = {
  id: string
  todoId: string
  period: Period
  text: string | null
  completed: boolean
}

export type Todo = {
  id: string
  userId: string
  slots: TimeSlot[]
  createdAt: Date
  updatedAt: Date
}

export type TodoItem = TimeSlot & {
  // For UI compatibility
  text: string
}

export type TimeSlotType = 'morning' | 'noon' | 'evening'

export type TodoState = {
  [key in TimeSlotType]: TodoItem[]
}
