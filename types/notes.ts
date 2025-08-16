export interface Note {
  id: string
  userId: string
  title: string
  description: string | null
  content: string
  createdAt: Date
  updatedAt: Date
}
