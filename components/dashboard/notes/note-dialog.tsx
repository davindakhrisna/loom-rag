"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit3 } from "lucide-react"
import { Note } from "@/types/notes"

interface NoteDialogProps {
  note?: Note
  onSave: (noteData: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  trigger?: React.ReactNode
}

export function NoteDialog({ note, onSave, trigger }: NoteDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>({
    title: note?.title || "",
    description: note?.description || "",
    content: note?.content || "",
  })

  const isEditing = !!note

  const handleSave = async () => {
    if (!formData.title.trim()) return

    try {
      if (onSave) {
        await onSave(formData)
      }
      
      if (!isEditing) {
        setFormData({ title: "", description: "", content: "" })
      }
      setOpen(false)
    } catch (error) {
      console.error('Error saving note:', error)
      throw error // Re-throw to allow parent to handle the error
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && note) {
      setFormData({
        title: note.title,
        description: note.description || "",
        content: note.content,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={isEditing ? "ghost" : "default"} size={isEditing ? "sm" : "default"}>
            {isEditing ? (
              <>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl">{isEditing ? "Edit Note" : "Add New Note"}</DialogTitle>
          <DialogDescription className="text-base">
            {isEditing
              ? "Make changes to your note below."
              : "Create a new note with a title, description, and content."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter note title..."
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Brief description of your note..."
              value={formData.description || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value || null }))}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Content
            </Label>
            <Textarea
              id="content"
              placeholder="Write your note content here..."
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              className="min-h-[200px] text-base resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} className="px-6">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.title.trim()} className="px-6">
            {isEditing ? "Save Changes" : "Add Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
