"use server"

import { prisma } from '@/lib/prisma'
import { TimeSlot, Period } from '@/types/todo'

const getTodayRange = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  return { today, tomorrow }
}

export async function getOrCreateTodayTodo(userId: string) {
  try {
    const { today, tomorrow } = getTodayRange()

    // Find or create today's todo
    let todo = await prisma.todo.findFirst({
      where: {
        userId,
        createdAt: { gte: today, lt: tomorrow }
      },
      include: {
        slots: true
      }
    })

    if (!todo) {
      todo = await prisma.todo.create({
        data: {
          userId,
          slots: {
            create: []
          }
        },
        include: {
          slots: true
        }
      })
    }

    return todo
  } catch (error) {
    console.error('Error getting or creating todo:', error)
    throw new Error('Failed to get or create todo')
  }
}

export async function getTodos(userId: string) {
  try {
    const todo = await getOrCreateTodayTodo(userId)
    return todo.slots || []
  } catch (error) {
    console.error('Error getting todos:', error)
    return []
  }
}

export async function createTodo(
  todoId: string,
  period: Period,
  text: string
): Promise<TimeSlot> {
  try {
    return await prisma.timeSlot.create({
      data: {
        todoId,
        period,
        text,
        completed: false
      }
    })
  } catch (error) {
    console.error('Error creating todo:', error)
    throw new Error('Failed to create todo')
  }
}

export async function deleteTodo(id: string): Promise<void> {
  try {
    await prisma.timeSlot.delete({
      where: { id }
    })
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw new Error('Failed to delete todo')
  }
}

export async function toggleTodo(id: string, completed: boolean): Promise<void> {
  try {
    await prisma.timeSlot.update({
      where: { id },
      data: { completed: !completed }
    })
  } catch (error) {
    console.error('Error toggling todo:', error)
    throw new Error('Failed to toggle todo')
  }
}
