import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { usePegEntries } from '@/hooks/usePegEntries'
import { BottomNav } from '@/components/BottomNav'
import { SearchBar } from '@/components/SearchBar'
import { Modal } from '@/components/Modal'
import { hasOpenAIKey, generateMnemonicImage } from '@/lib/openai'

export function PegPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { entries, filledCount, totalCount, upsertEntry, deleteEntry } = usePegEntries()
  const [search, setSearch] = useState('')
  const [editModal, setEditModal] = useState<{ number: number; peg_word: string; mnemonic_text: string; ai_description?: string | null; ai_image_url?: string | null } | null>(null)
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  // Build a map of number -> entry
  const entryMap = useMemo(() => {
    const map = new Map<number, typeof entries[0]>()
    entries.forEach(e => map.set(e.number, e))
    return map
  }, [entries])

  // Generate all 100 numbers (00-99)
  const allNumbers = useMemo(() => {
    const nums = Array.from({ length: 100 }, (_, i) => i)
    if (!search) return nums
    return nums.filter(n => {
      const padded = n.toString().padStart(2, '0')
      const entry = entryMap.get(n)
      return padded.includes(search) ||
        entry?.peg_word?.toLowerCase().includes(search.toLowerCase()) ||
        entry?.mnemonic_text?.toLowerCase().includes(search.toLowerCase())
    })
  }, [search, entryMap])

  const openEdit = (num: number) => {
    const existing = entryMap.get(num)
    setEditModal({
      number: num,
      peg_word: existing?.peg_word ?? '',
      mnemonic_text: existing?.mnemonic_text ?? '',
      ai_description: existing?.ai_description ?? null,
      ai_image_url: existing?.ai_image_url ?? null,
    })
    setAiError(null)
  }

  const handleSave = async () => {
    if (!editModal || !editModal.peg_word.trim()) return
    setSaving(true)
    await upsertEntry({
      number: editModal.number,
      peg_word: editModal.peg_word.trim(),
      mnemonic_text: editModal.mnemonic_text.trim() || null,
      ai_description: editModal.ai_description ?? undefined,
      ai_image_url: editModal.ai_image_url ?? undefined,
    })
    setEditModal(null)
    setSaving(false)
  }

  const handleAiGenerate = async () => {
    if (!editModal) return
    if (!hasOpenAIKey()) {
      setAiError(t('ai_no_key'))
      return
    }
    const subject = `Number ${editModal.number.toString().padStart(2, '0')} = ${editModal.peg_word}`
    const mnemonic = editModal.mnemonic_text || editModal.peg_word
    if (!mnemonic.trim()) {
      setAiError(t('ai_need_text'))
      return
    }
    setAiLoading(true)
    setAiError(null)
    try {
      const result = await generateMnemonicImage(subject, mnemonic)
      setEditModal({
        ...editModal,
        ai_description: result.description,
        ai_image_url: result.imageUrl,
      })
    } catch (err) {
      setAiError(err instanceof Error ? err.message : t('ai_error'))
    } finally {
      setAiLoading(false)
    }
  }

  const handleDelete = async (num: number) => {
    const entry = entryMap.get(num)
    if (entry) {
      await deleteEntry(entry.id)
    }
    setEditModal(null)
  }

  const percentage = Math.round((filledCount / totalCount) * 100)

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 h-14 bg-bg-secondary border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate('/')} className="p-2 rounded-lg text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold">Number PEG System</h2>
        </div>
        <span className="text-[13px] font-semibold text-accent bg-bg-card px-2.5 py-1 rounded-full">
          {filledCount}/{totalCount}
        </span>
      </header>

      {/* Progress bar */}
      <div className="h-[3px] bg-bg-input shrink-0">
        <div
          className="h-full bg-gradient-to-r from-accent to-cyan-400 rounded-sm transition-[width] duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <SearchBar placeholder={t('search_peg')} value={search} onChange={setSearch} />

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 grid grid-cols-2 gap-2 content-start">
        {allNumbers.map(num => {
          const entry = entryMap.get(num)
          const padded = num.toString().padStart(2, '0')
          const isFilled = !!entry

          return (
            <button
              key={num}
              onClick={() => openEdit(num)}
              className={`bg-bg-card border rounded-xl p-3.5 cursor-pointer transition-all hover:bg-bg-card-hover text-left min-h-[90px] flex flex-col w-full ${
                isFilled
                  ? 'border-border border-l-[3px] border-l-accent hover:border-border-light'
                  : 'border-border border-dashed opacity-60 hover:opacity-100 hover:border-accent'
              }`}
            >
              <span className="text-[22px] font-bold text-accent mb-1">{padded}</span>
              {isFilled ? (
                <>
                  <span className="text-[15px] font-semibold text-text-primary">{entry.peg_word}</span>
                  {entry.mnemonic_text && (
                    <span className="text-[11px] text-text-secondary mt-1 leading-snug line-clamp-2">{entry.mnemonic_text}</span>
                  )}
                </>
              ) : (
                <span className="text-sm text-text-muted mt-auto">{t('add_peg')}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Edit Modal */}
      <Modal
        open={editModal !== null}
        onClose={() => setEditModal(null)}
        title={editModal ? editModal.number.toString().padStart(2, '0') : ''}
        footer={
          <>
            {entryMap.has(editModal?.number ?? -1) && (
              <button
                onClick={() => editModal && handleDelete(editModal.number)}
                className="py-3 px-6 bg-transparent border border-danger/30 text-danger rounded-lg hover:bg-danger/10 transition-colors cursor-pointer font-medium"
              >
                {t('delete')}
              </button>
            )}
            <button
              onClick={() => setEditModal(null)}
              className="flex-1 py-3 px-6 bg-transparent border border-border text-text-primary rounded-lg hover:bg-bg-card transition-colors cursor-pointer font-medium"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !editModal?.peg_word.trim()}
              className="flex-1 py-3 px-6 bg-accent text-white rounded-lg hover:bg-accent-hover transition-all disabled:opacity-50 cursor-pointer font-medium border-none"
            >
              {t('save')}
            </button>
          </>
        }
      >
        {editModal && (
          <>
            <div className="mb-4">
              <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                {t('peg_word')}
              </label>
              <input
                type="text"
                value={editModal.peg_word}
                onChange={(e) => setEditModal({ ...editModal, peg_word: e.target.value })}
                placeholder="Indtast PEG-ord"
                className="w-full px-4 py-3 bg-bg-input border border-border rounded-lg text-text-primary text-[15px] placeholder:text-text-muted"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                {t('mnemonic')}
              </label>
              <textarea
                value={editModal.mnemonic_text}
                onChange={(e) => setEditModal({ ...editModal, mnemonic_text: e.target.value })}
                placeholder="Beskriv dit mentale billede..."
                rows={3}
                className="w-full px-4 py-3 bg-bg-input border border-border rounded-lg text-text-primary text-[15px] placeholder:text-text-muted resize-y min-h-20"
              />
            </div>
            {editModal.ai_image_url && (
              <div className="mb-4">
                <img
                  src={editModal.ai_image_url}
                  alt="AI mnemonic"
                  className="w-full rounded-xl border border-border"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}
            {editModal.ai_description && (
              <div className="mb-4 bg-bg-input rounded-xl p-3 border-l-[3px] border-l-accent">
                <p className="text-sm text-text-secondary leading-relaxed">{editModal.ai_description}</p>
              </div>
            )}
            {aiError && <p className="text-sm text-danger mb-3">{aiError}</p>}
            <button
              disabled={aiLoading}
              onClick={handleAiGenerate}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-accent to-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer border-none disabled:opacity-50"
            >
              {aiLoading ? <Loader2 size={18} className="animate-spin" /> : '⚡'} {aiLoading ? t('ai_generating') : t('ai_generate')}
            </button>
          </>
        )}
      </Modal>

      <BottomNav />
    </div>
  )
}
