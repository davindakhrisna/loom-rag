"use client"

import { useState, useEffect } from "react"
import { Session } from "next-auth"
import { getNotes, createNote, updateNote, deleteNote } from '@/lib/dashboard/notes/note/actions'
import { CreateNoteData, UpdateNoteData } from '@/types/notes'
import { ChevronLeft, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NoteDialog } from "@/components/dashboard/notes/note-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Note } from "@/types/notes"

interface NotesProps {
  session: Session | null;
}

export function TodaysNotesSection({ session }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const notesPerPage = 3

  // Fetch Notes
  useEffect(() => {
    const fetchNotes = async () => {
      if (session?.user?.id) {
        try {
          setIsLoading(true)
          setError(null)
          const userNotes = await getNotes(session.user.id)
          setNotes(userNotes)
        } catch (err) {
          console.error('Failed to fetch notes:', err)
          setError('Failed to load notes. Please try again.')
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchNotes()
  }, [session?.user?.id])

  // Pagination
  const totalPages = Math.ceil(notes.length / notesPerPage)
  const currentNotes = notes.slice(currentPage * notesPerPage, (currentPage + 1) * notesPerPage)
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

  // Handle Save Note
  const handleSaveNote = async (noteData: CreateNoteData | UpdateNoteData) => {
    const userId = session?.user?.id;
    try {
      setIsLoading(true);
      setError(null);

      if ('id' in noteData) {
        // For updates
        if (!noteData.id) {
          throw new Error('Expected Notes, Returns Nothing');
        }
        await updateNote({ ...noteData, id: noteData.id });
      } else {
        // For new notes
        await createNote(noteData, userId!);
      }

      // Refresh the notes list
      const updatedNotes = await getNotes(userId!);
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error saving note:', error);
      setError('Failed to save note. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    deleteNote(noteId);

    // Refresh the notes list after deletion
    const updatedNotes = await getNotes(userId!);
    setNotes(updatedNotes);
  }

  const userId = session?.user?.id;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl dark:text-white">Today&apos;s Notes</CardTitle>
        <NoteDialog
          onSave={async (noteData) => {
            await handleSaveNote(noteData);
            const updatedNotes = await getNotes(userId!);
            setNotes(updatedNotes);
          }}
        />
      </CardHeader>
      <CardContent className="sm:min-h-90.5 flex flex-col justify-between">
        <div className="space-y-4">
          {isLoading && <p className="text-sm">Loading notes...</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {!isLoading && !error && currentNotes.length === 0 ? (
            <p className="text-muted-foreground text-sm">No notes yet. Create your first note!</p>
          ) : (
            currentNotes.map((note) => (
              <NoteDialog
                key={note.id}
                note={note}
                onSave={async (noteData) => {
                  await handleSaveNote(noteData);
                  const updatedNotes = await getNotes(userId!);
                  setNotes(updatedNotes);
                }}
                trigger={
                  <Card className="py-4 relative border-l-4 border-l-blue-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium dark:text-white">{note.title}</h3>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs dark:text-gray-400">
                            {note?.createdAt ? new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No date'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 cursor-pointer p-0 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteNote(note.id)
                              // Add delete functionality here
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed line-clamp-2">
                        {note.description || note.content || "-"}
                      </p>
                    </CardContent>
                  </Card>
                }
              />
            ))
          )}
        </div>

        {/* Pagination */}
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
            disabled={currentPage === totalPages - 1 || notes.length <= 3}
            className="cursor-pointer border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 bg-transparent"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
