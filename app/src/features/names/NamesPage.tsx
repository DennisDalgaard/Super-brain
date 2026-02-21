import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, ChevronRight, ImageIcon, Loader2 } from 'lucide-react'
import { useNames } from '@/hooks/useNames'
import { BottomNav } from '@/components/BottomNav'
import { SearchBar } from '@/components/SearchBar'
import { Modal } from '@/components/Modal'
import { hasOpenAIKey, generateMnemonicImage } from '@/lib/openai'
import type { Name } from '@/types/database'

const avatarGradients = [
  'from-indigo-500 to-purple-500',
  'from-amber-500 to-red-500',
  'from-emerald-500 to-cyan-500',
  'from-pink-500 to-rose-500',
  'from-violet-500 to-fuchsia-500',
  'from-blue-500 to-indigo-500',
]

export function NamesPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { names, addName, updateName, deleteName } = useNames()
  const [search, setSearch] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [detailModal, setDetailModal] = useState<Name | null>(null)
  const [editMode, setEditMode] = useState(false)

  // Add form state
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
    <div className="flex flex-col h-screen max-w-[480px] mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 h-14 bg-bg-secondary border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate('/')} className="p-2 rounded-lg text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold">{t('names_title')}</h2>
        </div>
        <button onClick={() => setAddModalOpen(true)} className="p-2 rounded-lg text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer">
          <Plus size={22} />
        </button>
      </header>

      <SearchBar placeholder={t('search_names')} value={search} onChange={setSearch} />

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {filteredNames.length === 0 ? (
          <p className="text-center text-text-muted py-12">{t('no_names')}</p>
        ) : (
          filteredNames.map((name, i) => (
            <button
              key={name.id}
              onClick={() => { setDetailModal(name); setEditMode(false) }}
              className="flex items-center gap-3 p-3.5 bg-bg-card border border-border rounded-xl mb-2 cursor-pointer transition-all hover:bg-bg-card-hover hover:border-border-light w-full text-left"
            >
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center font-semibold text-lg text-white shrink-0`}>
                {name.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold mb-0.5">{name.full_name}</h3>
                {name.mnemonic_text && (
                  <p className="text-[13px] text-text-secondary truncate">{name.mnemonic_text}</p>
                )}
              </div>
              <div className="flex items-center gap-2 text-text-muted shrink-0">
                {name.ai_image_url && <ImageIcon size={14} className="text-accent opacity-70" />}
                <ChevronRight size={16} />
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

      {/* Add Name Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={t('add_name')}
        footer={
          <>
            <button onClick={() => setAddModalOpen(false)} className="flex-1 py-3 px-6 bg-transparent border border-border text-text-primary rounded-lg hover:bg-bg-card transition-colors cursor-pointer font-medium">
              {t('cancel')}
            </button>
            <button onClick={handleAdd} disabled={saving || !newName.trim()} className="flex-1 py-3 px-6 bg-accent text-white rounded-lg hover:bg-accent-hover transition-all disabled:opacity-50 cursor-pointer font-medium border-none">
              {t('save')}
            </button>
          </>
        }
      >
        <div className="mb-4">
          <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">{t('full_name')}</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="F.eks. Anders Jensen"
            className="w-full px-4 py-3 bg-bg-input border border-border rounded-lg text-text-primary text-[15px] placeholder:text-text-muted"
          />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">{t('mnemonic')}</label>
          <textarea
            value={newMnemonic}
            onChange={(e) => setNewMnemonic(e.target.value)}
            placeholder="F.eks. En AND der spiser JENSENs bøfgryde"
            rows={3}
            className="w-full px-4 py-3 bg-bg-input border border-border rounded-lg text-text-primary text-[15px] placeholder:text-text-muted resize-y min-h-20"
          />
        </div>
        {aiError && (
          <p className="text-sm text-danger mb-3">{aiError}</p>
        )}
        <button
          disabled={aiLoading}
          onClick={() => handleAiGenerate(newName, newMnemonic, async (desc, url) => {
            // Save the name first, then update with AI data
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
          className="w-full py-3.5 px-5 bg-gradient-to-r from-accent to-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer border-none disabled:opacity-50"
        >
          {aiLoading ? <Loader2 size={18} className="animate-spin" /> : '⚡'} {aiLoading ? t('ai_generating') : t('ai_generate')}
        </button>
      </Modal>

      {/* Name Detail Modal */}
      <Modal
        open={detailModal !== null}
        onClose={() => setDetailModal(null)}
        title={detailModal?.full_name ?? ''}
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
                <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">{t('full_name')}</label>
                <input
                  type="text"
                  value={detailModal.full_name}
                  onChange={(e) => setDetailModal({ ...detailModal, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-bg-input border border-border rounded-lg text-text-primary text-[15px]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">{t('mnemonic')}</label>
                <textarea
                  value={detailModal.mnemonic_text ?? ''}
                  onChange={(e) => setDetailModal({ ...detailModal, mnemonic_text: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-bg-input border border-border rounded-lg text-text-primary text-[15px] resize-y min-h-20"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">{t('mnemonic')}</h4>
                <p className="text-[15px] leading-relaxed">{detailModal.mnemonic_text || '—'}</p>
              </div>
              {detailModal.ai_image_url && (
                <div className="mb-5">
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">{t('ai_image_label')}</h4>
                  <img
                    src={detailModal.ai_image_url}
                    alt="AI mnemonic"
                    className="w-full rounded-xl border border-border"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}
              {detailModal.ai_description && (
                <div className="mb-5">
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">{t('ai_description_label')}</h4>
                  <div className="bg-bg-input rounded-xl p-4 border-l-[3px] border-l-accent">
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
                className="w-full py-3 px-5 bg-gradient-to-r from-accent to-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer border-none disabled:opacity-50 text-sm"
              >
                {aiLoading ? <Loader2 size={16} className="animate-spin" /> : '⚡'} {aiLoading ? t('ai_generating') : (detailModal.ai_image_url ? t('ai_generate_image') : t('ai_generate'))}
              </button>
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
