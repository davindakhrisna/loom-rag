"use server"

import { prisma } from "@/lib/prisma"

export async function getDaysWithNotes(userId: string) {
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId,
      },
      select: {
        createdAt: true,
      },
    })

    // Extract unique dates (YYYY-MM-DD format) from notes
    const daysWithNotes = new Set(
      notes.map((note) => {
        const date = new Date(note.createdAt)
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        ).toISOString().split('T')[0]
      })
    )

    return Array.from(daysWithNotes)
  } catch (error) {
    console.error('Error fetching days with notes:', error)
    return []
  }
}
