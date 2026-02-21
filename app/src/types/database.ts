export interface Database {
  public: {
    Tables: {
      names: {
        Row: {
          id: string
          user_id: string
          full_name: string
          mnemonic_text: string | null
          ai_description: string | null
          ai_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          full_name: string
          mnemonic_text?: string | null
          ai_description?: string | null
          ai_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          mnemonic_text?: string | null
          ai_description?: string | null
          ai_image_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      peg_entries: {
        Row: {
          id: string
          user_id: string
          number: number
          peg_word: string
          mnemonic_text: string | null
          ai_description: string | null
          ai_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          number: number
          peg_word: string
          mnemonic_text?: string | null
          ai_description?: string | null
          ai_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          number?: number
          peg_word?: string
          mnemonic_text?: string | null
          ai_description?: string | null
          ai_image_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          title: string
          content: string
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          category?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Name = Database['public']['Tables']['names']['Row']
export type NameInsert = Database['public']['Tables']['names']['Insert']
export type PegEntry = Database['public']['Tables']['peg_entries']['Row']
export type PegEntryInsert = Database['public']['Tables']['peg_entries']['Insert']
export type Note = Database['public']['Tables']['notes']['Row']
export type NoteInsert = Database['public']['Tables']['notes']['Insert']
