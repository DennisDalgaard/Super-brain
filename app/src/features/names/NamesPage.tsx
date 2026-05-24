import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, ChevronRight, ImageIcon, Loader2, Sparkles } from 'lucide-react'
import { useNames } from '@/hooks/useNames'
import { BottomNav } from '@/components/BottomNav'
import { SearchBar } from '@/components/SearchBar'
import { Modal } from '@/components/Modal'
import { AppHeader } from '@/components/AppHeader'
import { hasOpenAIKey, generateMnemonicImage } from '@/lib/openai'
import type { Name } from '@/types/database'

// Brand-aligned avatar gradients
const avatarGradients = [
  'brand-gradient',
  'brand-gradient-cyan',
  'brand-gradient-warm',
]

export function NamesPage() {
  const { t, i18n } = useTranslation()
  const { names, addName, updateName, deleteName } = useNames()
  const [search, setSearch] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [detailModal, setDetailModal] = useState<Name | null>(null)
  const [editMode, setEditMode] = useState(false)

  const [newName, setNewName] = useState('')
  const [newMnemonic, setNewMnemonic] = useState('')
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  const filteredNames = useMemo(() => {
    if (!search) return names
    const q = search.toLowerCase()
    return names.filter(n =>
      n.full_name.toLowerCase().includes(q) ||
      n.mnemonic_text?.toLowerCase().includes(q)
    )
  }, [names, search])

  const handleAdd = async () => {
    if (!newName.trim()) return
    setSaving(true)
    await addName({ full_name: newName.trim(), mnemonic_text: newMnemonic.trim() || null })
    setNewName('')
    setNewMnemonic('')
    setAddModalOpen(false)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await deleteName(id)
    setDetailModal(null)
  }

  const handleAiGenerate = async (name: string, mnemonic: string, onResult: (desc: string, url: string) => void) => {
    if (!hasOpenAIKey()) {
      setAiError(t('ai_no_key'))
      return
    }
    if (!mnemonic.trim()) {
      setAiError(t('ai_need_text'))
      return
    }
    setAiLoading(true)
    setAiError(null)
    try {
      const result = await generateMnemonicImage(name, mnemonic, i18n.language)
      onResult(result.description, result.imageUrl)
    } catch (err) {
      setAiError(err instanceof Error ? err.message : t('ai_error'))
    } finally {
      setAiLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!detailModal) return
    setSaving(true)
    await updateName(detailModal.id, {
      full_name: detailModal.full_name,
      mnemonic_text: detailModal.mnemonic_text,
    })
    setEditMode(false)
    setSaving(false)
  }

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto relative">
      <AppHeader
        back
        title={t('names_title')}
        right={
          <button
            onClick={() => setAddModalOpen(true)}
            aria-label={t('add_name')}
            className="p-2.5 rounded-full text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Plus size={22} />
          </button>
        }
      />

      <SearchBar placeholder={t('search_names')} value={search} onChange={setSearch} />

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {filteredNames.length === 0 ? (
          <p className="text-center text-text-muted py-12">{t('no_names')}</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {filteredNames.map((name, i) => (
              <li key={name.id}>
                <button
                  onClick={() => { setDetailModal(name); setEditMode(false) }}
                  className="flex items-center gap-3 p-3.5 glass-card cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(0,0,0,0.4)] w-full text-left border-none min-h-[68px]"
                >
                  <div
                    className={`w-11 h-11 rounded-full ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center font-semibold text-lg text-white shrink-0 shadow-[0_6px_18px_rgba(79,124,255,0.35)]`}
                  >
                    {name.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold mb-0.5 text-text-primary tracking-tight">
                      {name.full_name}
                    </h3>
                    {name.mnemonic_text && (
                      <p className="text-[13px] text-text-secondary truncate">{name.mnemonic_text}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-text-muted shrink-0">
                    {name.ai_image_url && <ImageIcon size={14} className="text-[#9CB6FF] opacity-80" />}
                    <ChevronRight size={16} />
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
        aria-label={t('add_name')}
        className="absolute bottom-20 right-4 w-14 h-14 rounded-full brand-gradient brand-glow border-none text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer z-10"
      >
        <Plus size={26} />
      </button>

      {/* Add Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={t('add_name')}
        footer={
          <>
            <button onClick={() => setAddModalOpen(false)} className="flex-1 py-3 px-6 btn-ghost rounded-full cursor-pointer font-medium min-h-[44px]">
              {t('cancel')}
            </button>
            <button onClick={handleAdd} disabled={saving || !newName.trim()} className="flex-1 py-3 px-6 btn-brand rounded-full cursor-pointer font-medium min-h-[44px]">
              {t('save')}
            </button>
          </>
        }
      >
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">{t('full_name')}</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="F.eks. Anders Jensen"
            className="w-full px-4 py-3 glass-input rounded-2xl text-[15px] min-h-[48px]"
          />
        </div>
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">{t('mnemonic')}</label>
          <textarea
            value={newMnemonic}
            onChange={(e) => setNewMnemonic(e.target.value)}
            placeholder="F.eks. En AND der spiser JENSENs bøfgryde"
            rows={3}
            className="w-full px-4 py-3 glass-input rounded-2xl text-[15px] resize-y min-h-20"
          />
        </div>
        {aiError && <p className="text-sm text-danger mb-3">{aiError}</p>}
        <button
          disabled={aiLoading}
          onClick={() => handleAiGenerate(newName, newMnemonic, async (desc, url) => {
            if (!newName.trim()) return
            setSaving(true)
            const result = await addName({
              full_name: newName.trim(),
              mnemonic_text: newMnemonic.trim() || null,
              ai_description: desc,
              ai_image_url: url,
            })
            if (result.data) {
              setNewName('')
              setNewMnemonic('')
              setAddModalOpen(false)
              setAiError(null)
            }
            setSaving(false)
          })}
          className="w-full py-3.5 px-5 btn-brand rounded-full font-medium flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
        >
          {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {aiLoading ? t('ai_generating') : t('ai_generate')}
        </button>
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={detailModal !== null}
        onClose={() => setDetailModal(null)}
        title={detailModal?.full_name ?? ''}
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
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">{t('full_name')}</label>
                <input
                  type="text"
                  value={detailModal.full_name}
                  onChange={(e) => setDetailModal({ ...detailModal, full_name: e.target.value })}
                  className="w-full px-4 py-3 glass-input rounded-2xl text-[15px] min-h-[48px]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">{t('mnemonic')}</label>
                <textarea
                  value={detailModal.mnemonic_text ?? ''}
                  onChange={(e) => setDetailModal({ ...detailModal, mnemonic_text: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 glass-input rounded-2xl text-[15px] resize-y min-h-20"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-5">
                <h4 className="text-[11px] font-semibold text-text-secondary uppercase tracking-[0.08em] mb-2">{t('mnemonic')}</h4>
                <p className="text-[15px] leading-relaxed">{detailModal.mnemonic_text || '—'}</p>
              </div>
              {detailModal.ai_image_url && (
                <div className="mb-5">
                  <h4 className="text-[11px] font-semibold text-text-secondary uppercase tracking-[0.08em] mb-2">{t('ai_image_label')}</h4>
                  <img
                    src={detailModal.ai_image_url}
                    alt="AI mnemonic"
                    className="w-full rounded-2xl border border-[rgba(123,92,255,0.18)]"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}
              {detailModal.ai_description && (
                <div className="mb-5">
                  <h4 className="text-[11px] font-semibold text-text-secondary uppercase tracking-[0.08em] mb-2">{t('ai_description_label')}</h4>
                  <div className="glass-card-soft p-4 border-l-[3px] border-l-[#7B5CFF]">
                    <p className="text-sm text-text-secondary leading-relaxed">{detailModal.ai_description}</p>
                  </div>
                </div>
              )}
              {aiError && <p className="text-sm text-danger mb-3">{aiError}</p>}
              <button
                disabled={aiLoading}
                onClick={() => handleAiGenerate(
                  detailModal.full_name,
                  detailModal.mnemonic_text ?? '',
                  async (desc, url) => {
                    const result = await updateName(detailModal.id, {
                      ai_description: desc,
                      ai_image_url: url,
                    })
                    if (result.data) {
                      setDetailModal(result.data)
                      setAiError(null)
                    }
                  }
                )}
                className="w-full py-3 px-5 btn-brand rounded-full font-medium flex items-center justify-center gap-2 cursor-pointer text-sm min-h-[44px]"
              >
                {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {aiLoading ? t('ai_generating') : (detailModal.ai_image_url ? t('ai_generate_image') : t('ai_generate'))}
              </button>
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
