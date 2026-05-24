import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { useNotes } from '@/hooks/useNotes'
import { BottomNav } from '@/components/BottomNav'
import { SearchBar } from '@/components/SearchBar'
import { Modal } from '@/components/Modal'
import { AppHeader } from '@/components/AppHeader'
import type { Note } from '@/types/database'

// Brand-aligned category styles (text + soft tinted background)
const categoryStyles: Record<string, { bg: string; text: string; border: string }> = {
  Teknik:     { bg: 'rgba(79,124,255,0.16)',  text: '#9CB6FF', border: 'rgba(79,124,255,0.32)' },
  System:     { bg: 'rgba(123,92,255,0.16)',  text: '#B9A6FF', border: 'rgba(123,92,255,0.32)' },
  Tips:       { bg: 'rgba(51,214,255,0.16)',  text: '#7FE5FF', border: 'rgba(51,214,255,0.32)' },
  'Øvelse':   { bg: 'rgba(255,122,26,0.16)',  text: '#FFB073', border: 'rgba(255,122,26,0.32)' },
  Technique:  { bg: 'rgba(79,124,255,0.16)',  text: '#9CB6FF', border: 'rgba(79,124,255,0.32)' },
  Practice:   { bg: 'rgba(255,122,26,0.16)',  text: '#FFB073', border: 'rgba(255,122,26,0.32)' },
}

const defaultStyle = { bg: 'rgba(79,124,255,0.16)', text: '#9CB6FF', border: 'rgba(79,124,255,0.32)' }
const defaultCategories = ['Teknik', 'System', 'Tips', 'Øvelse']

function CategoryChip({ category }: { category: string }) {
  const s = categoryStyles[category] ?? defaultStyle
  return (
    <span
      className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-[0.06em]"
      style={{ backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {category}
    </span>
  )
}

export function NotesPage() {
  const { t } = useTranslation()
  const { notes, addNote, updateNote, deleteNote } = useNotes()
  const [search, setSearch] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [detailModal, setDetailModal] = useState<Note | null>(null)
  const [editMode, setEditMode] = useState(false)

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
    <div className="flex flex-col h-screen max-w-[480px] mx-auto relative">
      <AppHeader
        back
        title={t('notes_title')}
        right={
          <button
            onClick={() => setAddModalOpen(true)}
            aria-label={t('new_note')}
            className="p-2.5 rounded-full text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Plus size={22} />
          </button>
        }
      />

      <SearchBar placeholder={t('search_notes')} value={search} onChange={setSearch} />

      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {filteredNotes.length === 0 ? (
          <p className="text-center text-text-muted py-12">{t('no_notes')}</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {filteredNotes.map(note => (
              <li key={note.id}>
                <button
                  onClick={() => { setDetailModal(note); setEditMode(false) }}
                  className="block w-full text-left glass-card p-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(0,0,0,0.4)] border-none"
                >
                  {note.category && (
                    <div className="mb-2.5">
                      <CategoryChip category={note.category} />
                    </div>
                  )}
                  <h3 className="text-[16px] font-semibold mb-1.5 tracking-tight">{note.title}</h3>
                  <p className="text-[13px] text-text-secondary leading-snug line-clamp-2">{note.content}</p>
                  <div className="text-xs text-text-muted mt-2.5">
                    {new Date(note.created_at).toLocaleDateString()}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setAddModalOpen(true)}
        aria-label={t('new_note')}
        className="absolute bottom-20 right-4 w-14 h-14 rounded-full brand-gradient brand-glow border-none text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer z-10"
      >
        <Plus size={26} />
      </button>

      {/* Add Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={t('new_note')}
        large
        footer={
          <>
            <button onClick={() => setAddModalOpen(false)} className="flex-1 py-3 px-6 btn-ghost rounded-full cursor-pointer font-medium min-h-[44px]">
              {t('cancel')}
            </button>
            <button onClick={handleAdd} disabled={saving || !newTitle.trim()} className="flex-1 py-3 px-6 btn-brand rounded-full cursor-pointer font-medium min-h-[44px]">
              {t('save')}
            </button>
          </>
        }
      >
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">{t('note_category')}</label>
          <div className="flex gap-2 flex-wrap">
            {defaultCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setNewCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border cursor-pointer transition-colors min-h-[36px] ${
                  newCategory === cat
                    ? 'brand-gradient border-transparent text-white'
                    : 'bg-transparent border-[rgba(123,92,255,0.22)] text-text-secondary hover:border-[rgba(123,92,255,0.4)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">{t('note_title')}</label>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Navn på teknikken..."
            className="w-full px-4 py-3 glass-input rounded-2xl text-[15px] min-h-[48px]"
          />
        </div>
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">{t('note_content')}</label>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Skriv din note her..."
            rows={10}
            className="w-full px-4 py-3 glass-input rounded-2xl text-[15px] resize-y min-h-40"
          />
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={detailModal !== null}
        onClose={() => setDetailModal(null)}
        title={detailModal?.title ?? ''}
        large
        footer={
          editMode ? (
            <>
              <button onClick={() => setEditMode(false)} className="flex-1 py-3 px-6 btn-ghost rounded-full cursor-pointer font-medium min-h-[44px]">
                {t('cancel')}
              </button>
              <button onClick={handleUpdate} disabled={saving} className="flex-1 py-3 px-6 btn-brand rounded-full cursor-pointer font-medium min-h-[44px]">
                {t('save')}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => detailModal && handleDelete(detailModal.id)} className="flex-1 py-3 px-6 bg-transparent border border-[rgba(255,77,77,0.35)] text-danger rounded-full hover:bg-[rgba(255,77,77,0.08)] transition-colors cursor-pointer font-medium min-h-[44px]">
                {t('delete')}
              </button>
              <button onClick={() => setEditMode(true)} className="flex-1 py-3 px-6 btn-brand rounded-full cursor-pointer font-medium min-h-[44px]">
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
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">{t('note_category')}</label>
                <div className="flex gap-2 flex-wrap">
                  {defaultCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setDetailModal({ ...detailModal, category: cat })}
                      className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border cursor-pointer transition-colors min-h-[36px] ${
                        detailModal.category === cat
                          ? 'brand-gradient border-transparent text-white'
                          : 'bg-transparent border-[rgba(123,92,255,0.22)] text-text-secondary hover:border-[rgba(123,92,255,0.4)]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">{t('note_title')}</label>
                <input
                  type="text"
                  value={detailModal.title}
                  onChange={(e) => setDetailModal({ ...detailModal, title: e.target.value })}
                  className="w-full px-4 py-3 glass-input rounded-2xl text-[15px] min-h-[48px]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">{t('note_content')}</label>
                <textarea
                  value={detailModal.content}
                  onChange={(e) => setDetailModal({ ...detailModal, content: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-3 glass-input rounded-2xl text-[15px] resize-y min-h-40"
                />
              </div>
            </>
          ) : (
            <>
              {detailModal.category && (
                <div className="mb-4">
                  <CategoryChip category={detailModal.category} />
                </div>
              )}
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                {detailModal.content}
              </div>
              <div className="text-xs text-text-muted mt-4 pt-3 border-t border-[rgba(123,92,255,0.16)]">
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
