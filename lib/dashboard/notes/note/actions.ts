'use server'
import { prisma } from '@/lib/prisma'
import { CreateNoteData, UpdateNoteData } from '@/types/notes'

// Fetch Notes
export async function getNotes(userId: string) {
  try {
    // Get today's date at 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get tomorrow's date at 00:00:00
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const notes = await prisma.note.findMany({
      where: { 
        userId,
        createdAt: {
          gte: today,    // Greater than or equal to today 00:00:00
          lt: tomorrow   // Less than tomorrow 00:00:00
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return notes;
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
}

// Create Note
export async function createNote(noteData: CreateNoteData, userId: string) {
  try {
    const note = await prisma.note.create({
      data: {
        title: noteData.title,
        description: noteData.description,
        content: noteData.content,
        userId,
      },
    });
    return note;
  } catch (error) {
    console.error('Error creating note:', error);
    throw new Error('Failed to create note');
  }
}

// Update Note
export async function updateNote(noteData: UpdateNoteData) {
  try {
    const note = await prisma.note.update({
      where: {
        id: noteData.id,
      },
      data: {
        title: noteData.title,
        description: noteData.description,
        content: noteData.content,
      },
    });
    return note;
  } catch (error) {
    console.error('Error updating note:', error);
    throw new Error('Failed to update note');
  }
}

// Delete Note
export async function deleteNote(noteId: string) {
  try {
    const deleteNote = await prisma.note.delete({
      where: {
        id: noteId,
      }
    })
    return deleteNote;
  } catch (error) {
    console.error('Error delete note:', error);
    throw new Error('Failed to delete note');
  }
}
