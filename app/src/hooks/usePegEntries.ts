import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { PegEntry, PegEntryInsert } from '@/types/database'

export function usePegEntries() {
  const [entries, setEntries] = useState<PegEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('peg_entries')
      .select('*')
      .order('number', { ascending: true })

    if (error) {
      console.error('Error fetching peg entries:', error)
    } else {
      setEntries((data as PegEntry[]) ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const upsertEntry = async (entry: PegEntryInsert) => {
    const { data, error } = await supabase
      .from('peg_entries')
      .upsert(entry, { onConflict: 'user_id,number' })
      .select()
      .single()

    if (error) {
      console.error('Error upserting peg entry:', error)
      return { data: null, error }
    }

    const row = data as PegEntry
    setEntries(prev => {
      const existing = prev.findIndex(e => e.number === row.number)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = row
        return updated
      }
      return [...prev, row].sort((a, b) => a.number - b.number)
    })

    return { data: row, error: null }
  }

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.from('peg_entries').delete().eq('id', id)

    if (error) {
      console.error('Error deleting peg entry:', error)
      return { error }
    }

    setEntries(prev => prev.filter(e => e.id !== id))
    return { error: null }
  }

  const filledCount = entries.length
  const totalCount = 100

  return { entries, loading, upsertEntry, deleteEntry, filledCount, totalCount, refetch: fetchEntries }
}
