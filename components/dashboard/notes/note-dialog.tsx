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
import { Plus } from "lucide-react"
import { CreateNoteData, UpdateNoteData, NoteDialogProps, FormData } from "@/types/notes"

export function NoteDialog({ note, onSave, trigger }: NoteDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    id: note?.id,
    title: note?.title || "",
    description: note?.description || null,
    content: note?.content || "",
  })

  // Logic Editing
  const isEditing = !!note

  // Handle Save
  const handleSave = async () => {
    if (!formData.title.trim()) return

    try {
      if (onSave) {
        const noteData = isEditing
          ? { ...formData, id: note!.id } as UpdateNoteData
          : {
            title: formData.title,
            description: formData.description,
            content: formData.content
          } as CreateNoteData

        await onSave(noteData)
      }
      if (!isEditing) {
        setFormData({ id: "", title: "", description: "", content: "" })
      }
      setOpen(false)
    } catch (error) {
      console.error('Error saving note:', error)
      throw error
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && note) {
      setFormData({
        id: note.id,
        title: note.title,
        description: note.description,
        content: note.content,
      })
    } else if (!newOpen && !isEditing) {
      // Reset form when closing dialog for new notes
      setFormData({
        title: "",
        description: null,
        content: "",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="cursor-pointer" variant="default" size="default">
            <Plus className="h-4 w-4 mr-2" />
            Add Note
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
              maxLength={16}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="text-base"
            />
            <div className="text-xs text-muted-foreground mb-4 flex-shrink-0">{formData.title.length}/16 characters</div>
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
              className="h-[200px] w-full text-base resize-none whitespace-pre-wrap break-words"
            />
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} className="px-6 cursor-pointer">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.title.trim()} className="px-6 cursor-pointer">
            {isEditing ? "Save Changes" : "Add Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
