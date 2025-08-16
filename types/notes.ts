// Interface
export interface Note {
  id: string
  userId: string
  title: string
  description: string | null
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface NoteDialogProps {
  note?: Note
  onSave: (noteData: CreateNoteData | UpdateNoteData) => Promise<void>
  trigger?: React.ReactNode
}

// Types
export type CreateNoteData = {
  title: string;
  description: string | null;
  content: string;
};

export type UpdateNoteData = {
  id: string;
  title: string;
  description: string | null;
  content: string;
};

export type FormData = {
  id?: string;
  title: string;
  description: string | null;
  content: string;
}
