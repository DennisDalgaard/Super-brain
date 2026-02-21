import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus } from 'lucide-react'
import { useNotes } from '@/hooks/useNotes'
import { BottomNav } from '@/components/BottomNav'
import { SearchBar } from '@/components/SearchBar'
import { Modal } from '@/components/Modal'
import type { Note } from '@/types/database'

const categoryColors: Record<string, string> = {
  Teknik: '#6366f1',
  System: '#10b981',
  Tips: '#ec4899',
  'Øvelse': '#06b6d4',
  Technique: '#6366f1',
  Practice: '#06b6d4',
}

const defaultCategories = ['Teknik', 'System', 'Tips', 'Øvelse']

export function NotesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { notes, addNote, updateNote, deleteNote } = useNotes()
  const [search, setSearch] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [detailModal, setDetailModal] = useState<Note | null>(null)
  const [editMode, setEditMode] = useState(false)

  // Add form state
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newCategory, setNewCategory] = useState('Teknik')
  const [saving, setSaving] = useState(false)

  const filteredNotes = useMemo(() => {
    if (!search) return notes
    const q = search.toLowerCase()
    return notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.category?.toLowerCase().includes(q)
    )
  }, [notes, search])

  const handleAdd = async () => {
    if (!newTitle.trim() || !newContent.trim()) return
    setSaving(true)
    await addNote({
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
    })
    setNewTitle('')
    setNewContent('')
    setNewCategory('Teknik')
    setAddModalOpen(false)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await deleteNote(id)
    setDetailModal(null)
  }

  const handleUpdate = async () => {
    if (!detailModal) return
    setSaving(true)
    await updateNote(detailModal.id, {
      title: detailModal.title,
      content: detailModal.content,
      category: detailModal.category,
    })
    setEditMode(false)
    setSaving(false)
  }

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 h-14 bg-bg-secondary border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate('/')} className="p-2 rounded-lg text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold">{t('notes_title')}</h2>
        </div>
        <button onClick={() => setAddModalOpen(true)} className="p-2 rounded-lg text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer">
          <Plus size={22} />
        </button>
      </header>

      <SearchBar placeholder={t('search_notes')} value={search} onChange={setSearch} />

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {filteredNotes.length === 0 ? (
          <p className="text-center text-text-muted py-12">{t('no_notes')}</p>
        ) : (
          filteredNotes.map(note => (
            <button
              key={note.id}
              onClick={() => { setDetailModal(note); setEditMode(false) }}
              className="block w-full text-left bg-bg-card border border-border rounded-xl p-4 mb-2.5 cursor-pointer transition-all hover:bg-bg-card-hover hover:border-border-light hover:-translate-y-0.5"
            >
              {note.category && (
                <span
                  className="inline-block text-[11px] font-semibold text-white px-2.5 py-0.5 rounded-full mb-2.5 uppercase tracking-wide"
                  style={{ background: categoryColors[note.category] || '#6366f1' }}
                >
                  {note.category}
                </span>
              )}
              <h3 className="text-base font-semibold mb-1.5">{note.title}</h3>
              <p className="text-[13px] text-text-secondary leading-snug line-clamp-2">{note.content}</p>
              <div className="text-xs text-text-muted mt-2">
                {new Date(note.created_at).toLocaleDateString()}
              </div>
            </button>
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setAddModalOpen(true)}
        className="absolute bottom-20 right-4 w-14 h-14 rounded-full bg-accent border-none text-white flex items-center justify-center shadow-[0_4px_16px_rgba(99,102,241,0.3)] hover:bg-accent-hover hover:scale-110 transition-all cursor-pointer z-10"
      >
        <Plus size={24} />
      </button>

      {/* Add Note Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={t('new_note')}
        large
        footer={
          <>
            <button onClick={() => setAddModalOpen(false)} className="flex-1 py-3 px-6 bg-transparent border border-border text-text-primary rounded-lg hover:bg-bg-card transition-colors cursor-pointer font-medium">
              {t('cancel')}
            </button>
            <button onClick={handleAdd} disabled={saving || !newTitle.trim()} className="flex-1 py-3 px-6 bg-accent text-white rounded-lg hover:bg-accent-hover transition-all disabled:opacity-50 cursor-pointer font-medium border-none">
              {t('save')}
            </button>
          </>
        }
      >
        <div className="mb-4">
          <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">{t('note_category')}</label>
          <div className="flex gap-2 flex-wrap">
            {defaultCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setNewCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border cursor-pointer transition-colors ${
                  newCategory === cat
                    ? 'bg-accent border-accent text-white'
                    : 'bg-bg-input border-border text-text-secondary hover:border-border-light'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">{t('note_title')}</label>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Navn på teknikken..."
            className="w-full px-4 py-3 bg-bg-input border border-border rounded-lg text-text-primary text-[15px] placeholder:text-text-muted"
          />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">{t('note_content')}</label>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Skriv din note her..."
            rows={10}
            className="w-full px-4 py-3 bg-bg-input border border-border rounded-lg text-text-primary text-[15px] placeholder:text-text-muted resize-y min-h-40"
          />
        </div>
      </Modal>

      {/* Note Detail Modal */}
      <Modal
        open={detailModal !== null}
        onClose={() => setDetailModal(null)}
        title={detailModal?.title ?? ''}
        large
        footer={
          editMode ? (
            <>
              <button onClick={() => setEditMode(false)} className="flex-1 py-3 px-6 bg-transparent border border-border text-text-primary rounded-lg hover:bg-bg-card transition-colors cursor-pointer font-medium">
                {t('cancel')}
              </button>
              <button onClick={handleUpdate} disabled={saving} className="flex-1 py-3 px-6 bg-accent text-white rounded-lg hover:bg-accent-hover transition-all disabled:opacity-50 cursor-pointer font-medium border-none">
                {t('save')}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => detailModal && handleDelete(detailModal.id)} className="flex-1 py-3 px-6 bg-transparent border border-danger/30 text-danger rounded-lg hover:bg-danger/10 transition-colors cursor-pointer font-medium">
                {t('delete')}
              </button>
              <button onClick={() => setEditMode(true)} className="flex-1 py-3 px-6 bg-accent text-white rounded-lg hover:bg-accent-hover transition-all cursor-pointer font-medium border-none">
                {t('edit')}
              </button>
            </>
          )
        }
      >
        {detailModal && (
          editMode ? (
            <>
              <div className="mb-4">
                <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">{t('note_category')}</label>
                <div className="flex gap-2 flex-wrap">
                  {defaultCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setDetailModal({ ...detailModal, category: cat })}
                      className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border cursor-pointer transition-colors ${
                        detailModal.category === cat
                          ? 'bg-accent border-accent text-white'
                          : 'bg-bg-input border-border text-text-secondary hover:border-border-light'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">{t('note_title')}</label>
                <input
                  type="text"
                  value={detailModal.title}
                  onChange={(e) => setDetailModal({ ...detailModal, title: e.target.value })}
                  className="w-full px-4 py-3 bg-bg-input border border-border rounded-lg text-text-primary text-[15px]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">{t('note_content')}</label>
                <textarea
                  value={detailModal.content}
                  onChange={(e) => setDetailModal({ ...detailModal, content: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-3 bg-bg-input border border-border rounded-lg text-text-primary text-[15px] resize-y min-h-40"
                />
              </div>
            </>
          ) : (
            <>
              {detailModal.category && (
                <span
                  className="inline-block text-[11px] font-semibold text-white px-2.5 py-0.5 rounded-full mb-4 uppercase tracking-wide"
                  style={{ background: categoryColors[detailModal.category] || '#6366f1' }}
                >
                  {detailModal.category}
                </span>
              )}
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                {detailModal.content}
              </div>
              <div className="text-xs text-text-muted mt-4 pt-3 border-t border-border">
                {t('created')}: {new Date(detailModal.created_at).toLocaleDateString()}
              </div>
            </>
          )
        )}
      </Modal>

      <BottomNav />
    </div>
  )
}
