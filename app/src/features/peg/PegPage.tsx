import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Sparkles } from 'lucide-react'
import { usePegEntries } from '@/hooks/usePegEntries'
import { BottomNav } from '@/components/BottomNav'
import { SearchBar } from '@/components/SearchBar'
import { Modal } from '@/components/Modal'
import { AppHeader } from '@/components/AppHeader'
import { hasOpenAIKey, generateMnemonicImage } from '@/lib/openai'

export function PegPage() {
  const { t, i18n } = useTranslation()
  const { entries, filledCount, totalCount, upsertEntry, deleteEntry } = usePegEntries()
  const [search, setSearch] = useState('')
  const [editModal, setEditModal] = useState<{ number: number; peg_word: string; mnemonic_text: string; ai_description?: string | null; ai_image_url?: string | null } | null>(null)
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  const entryMap = useMemo(() => {
    const map = new Map<number, typeof entries[0]>()
    entries.forEach(e => map.set(e.number, e))
    return map
  }, [entries])

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
      const result = await generateMnemonicImage(subject, mnemonic, i18n.language)
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
    if (entry) await deleteEntry(entry.id)
    setEditModal(null)
  }

  const percentage = Math.round((filledCount / totalCount) * 100)

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto">
      <AppHeader
        back
        title="Number PEG"
        right={
          <span className="pill">
            {filledCount}/{totalCount}
          </span>
        }
      />

      {/* Progress bar */}
      <div className="h-[3px] bg-[rgba(123,92,255,0.12)] shrink-0">
        <div
          className="h-full brand-gradient transition-[width] duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <SearchBar placeholder={t('search_peg')} value={search} onChange={setSearch} />

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 grid grid-cols-2 gap-3 content-start">
        {allNumbers.map(num => {
          const entry = entryMap.get(num)
          const padded = num.toString().padStart(2, '0')
          const isFilled = !!entry

          return (
            <button
              key={num}
              onClick={() => openEdit(num)}
              className={`rounded-[18px] p-3.5 cursor-pointer transition-all text-left min-h-[100px] flex flex-col w-full border ${
                isFilled
                  ? 'glass-card hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(0,0,0,0.36)] border-[rgba(79,124,255,0.18)]'
                  : 'bg-[rgba(27,27,52,0.55)] border-dashed border-[rgba(123,92,255,0.22)] opacity-70 hover:opacity-100 hover:border-[rgba(79,124,255,0.5)]'
              }`}
            >
              <span className="text-[22px] font-bold tracking-tight mb-1" style={{ color: '#4F7CFF' }}>
                {padded}
              </span>
              {isFilled ? (
                <>
                  <span className="text-[15px] font-semibold text-text-primary truncate">{entry.peg_word}</span>
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
                className="py-3 px-5 bg-transparent border border-[rgba(255,77,77,0.35)] text-danger rounded-full hover:bg-[rgba(255,77,77,0.08)] transition-colors cursor-pointer font-medium min-h-[44px]"
              >
                {t('delete')}
              </button>
            )}
            <button
              onClick={() => setEditModal(null)}
              className="flex-1 py-3 px-5 btn-ghost rounded-full cursor-pointer font-medium min-h-[44px]"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !editModal?.peg_word.trim()}
              className="flex-1 py-3 px-5 btn-brand rounded-full cursor-pointer font-medium min-h-[44px]"
            >
              {t('save')}
            </button>
          </>
        }
      >
        {editModal && (
          <>
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">
                {t('peg_word')}
              </label>
              <input
                type="text"
                value={editModal.peg_word}
                onChange={(e) => setEditModal({ ...editModal, peg_word: e.target.value })}
                placeholder="Indtast PEG-ord"
                className="w-full px-4 py-3 glass-input rounded-2xl text-[15px] min-h-[48px]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">
                {t('mnemonic')}
              </label>
              <textarea
                value={editModal.mnemonic_text}
                onChange={(e) => setEditModal({ ...editModal, mnemonic_text: e.target.value })}
                placeholder="Beskriv dit mentale billede..."
                rows={3}
                className="w-full px-4 py-3 glass-input rounded-2xl text-[15px] resize-y min-h-20"
              />
            </div>
            {editModal.ai_image_url && (
              <div className="mb-4">
                <img
                  src={editModal.ai_image_url}
                  alt="AI mnemonic"
                  className="w-full rounded-2xl border border-[rgba(123,92,255,0.18)]"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}
            {editModal.ai_description && (
              <div className="mb-4 glass-card-soft p-3 border-l-[3px] border-l-[#7B5CFF]">
                <p className="text-sm text-text-secondary leading-relaxed">{editModal.ai_description}</p>
              </div>
            )}
            {aiError && <p className="text-sm text-danger mb-3">{aiError}</p>}
            <button
              disabled={aiLoading}
              onClick={handleAiGenerate}
              className="w-full py-3.5 px-5 btn-brand rounded-full font-medium flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {aiLoading ? t('ai_generating') : t('ai_generate')}
            </button>
          </>
        )}
      </Modal>

      <BottomNav />
    </div>
  )
}
