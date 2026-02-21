import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Note, NoteInsert } from '@/types/database'

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notes:', error)
    } else {
      setNotes((data as Note[]) ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const addNote = async (note: NoteInsert) => {
    const { data, error } = await supabase
      .from('notes')
      .insert(note)
      .select()
      .single()

    if (error) {
      console.error('Error adding note:', error)
      return { data: null, error }
    }

    const row = data as Note
    setNotes(prev => [row, ...prev])
    return { data: row, error: null }
  }

  const updateNote = async (id: string, updates: Partial<Note>) => {
    const { data, error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating note:', error)
      return { data: null, error }
    }

    const row = data as Note
    setNotes(prev => prev.map(n => (n.id === id ? row : n)))
    return { data: row, error: null }
  }

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', id)

    if (error) {
      console.error('Error deleting note:', error)
      return { error }
    }

    setNotes(prev => prev.filter(n => n.id !== id))
    return { error: null }
  }

  return { notes, loading, addNote, updateNote, deleteNote, refetch: fetchNotes }
}
