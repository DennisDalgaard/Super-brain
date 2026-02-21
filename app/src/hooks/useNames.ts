import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Name, NameInsert } from '@/types/database'

export function useNames() {
  const [names, setNames] = useState<Name[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNames = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('names')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching names:', error)
    } else {
      setNames((data as Name[]) ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchNames()
  }, [fetchNames])

  const addName = async (name: NameInsert) => {
    const { data, error } = await supabase
      .from('names')
      .insert(name)
      .select()
      .single()

    if (error) {
      console.error('Error adding name:', error)
      return { data: null, error }
    }

    const row = data as Name
    setNames(prev => [row, ...prev])
    return { data: row, error: null }
  }

  const updateName = async (id: string, updates: Partial<Name>) => {
    const { data, error } = await supabase
      .from('names')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating name:', error)
      return { data: null, error }
    }

    const row = data as Name
    setNames(prev => prev.map(n => (n.id === id ? row : n)))
    return { data: row, error: null }
  }

  const deleteName = async (id: string) => {
    const { error } = await supabase.from('names').delete().eq('id', id)

    if (error) {
      console.error('Error deleting name:', error)
      return { error }
    }

    setNames(prev => prev.filter(n => n.id !== id))
    return { error: null }
  }

  return { names, loading, addName, updateName, deleteName, refetch: fetchNames }
}
