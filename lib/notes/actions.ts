'use server'
import { prisma } from '@/lib/prisma'
import { Note } from '@/types/notes'

export async function getNotes(userId: string) {
  try {
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return notes
  } catch (error) {
    console.error('Error fetching notes:', error)
    return []
  }
}

type CreateNoteData = {
  title: string;
  description: string | null;
  content: string;
};

type UpdateNoteData = {
  id: string;
  title: string;
  description: string | null;
  content: string;
};

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

export async function updateNote(noteData: UpdateNoteData, userId: string) {
  try {
    const note = await prisma.note.update({
      where: { 
        id: noteData.id,
        userId
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
