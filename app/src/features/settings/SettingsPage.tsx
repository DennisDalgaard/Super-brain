import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getOpenAIKey, setOpenAIKey } from '@/lib/openai'
import { AppHeader } from '@/components/AppHeader'

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [apiKey, setApiKey] = useState(getOpenAIKey() ?? '')
  const [keySaved, setKeySaved] = useState(false)

  const handleLangChange = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('superbrain-lang', lang)
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto">
      <AppHeader back title={t('settings')} />

      <div className="flex-1 overflow-y-auto px-4 py-5 pb-10">
        {/* Profile */}
        <Section title={t('profile')}>
          <Row label={t('name')} value={user?.user_metadata?.full_name || '—'} />
          <Divider />
          <Row label={t('email')} value={user?.email || '—'} />
        </Section>

        {/* App settings */}
        <Section title={t('settings')}>
          <div className="flex items-center justify-between px-4 py-3.5 text-[15px] min-h-[52px]">
            <span className="text-text-primary">{t('language')}</span>
            <div className="flex gap-1.5">
              {['da', 'en'].map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLangChange(lang)}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold border cursor-pointer transition-colors min-h-[36px] ${
                    i18n.language === lang
                      ? 'brand-gradient border-transparent text-white'
                      : 'bg-transparent border-[rgba(123,92,255,0.22)] text-text-secondary hover:border-[rgba(123,92,255,0.4)]'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <Divider />
          <Row label={t('theme')} value="Dark" />
        </Section>

        {/* AI / OpenAI */}
        <Section title="AI">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[15px] text-text-primary">{t('openai_key')}</span>
              {keySaved && (
                <span className="flex items-center gap-1 text-xs text-[#33D6FF]">
                  <Check size={14} /> {t('openai_key_saved')}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setKeySaved(false) }}
                placeholder={t('openai_key_placeholder')}
                className="flex-1 px-4 py-2.5 glass-input rounded-full text-sm min-h-[44px]"
              />
              <button
                onClick={() => { setOpenAIKey(apiKey); setKeySaved(true) }}
                className="px-5 py-2.5 btn-brand rounded-full text-sm font-semibold cursor-pointer min-h-[44px]"
              >
                {t('save')}
              </button>
            </div>
            <p className="text-xs text-text-muted mt-2.5 leading-relaxed">{t('openai_key_desc')}</p>
          </div>
        </Section>

        {/* Data */}
        <Section title="Data">
          <div className="flex items-center justify-between px-4 py-3.5 text-[15px] min-h-[52px]">
            <span className="text-text-primary">{t('export_data')}</span>
            <button className="px-4 py-1.5 btn-ghost rounded-full text-[13px] font-semibold cursor-pointer min-h-[36px]">
              JSON
            </button>
          </div>
        </Section>

        <button
          onClick={handleLogout}
          className="w-full py-3.5 px-6 bg-transparent border border-[rgba(255,77,77,0.35)] text-danger rounded-full hover:bg-[rgba(255,77,77,0.08)] transition-colors cursor-pointer font-semibold text-[15px] min-h-[48px]"
        >
          {t('logout')}
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-2.5 px-1">
        {title}
      </h3>
      <div className="glass-card overflow-hidden">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 text-[15px] min-h-[52px]">
      <span className="text-text-primary">{label}</span>
      <span className="text-text-secondary text-sm truncate ml-3 text-right">{value}</span>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-[rgba(123,92,255,0.16)] mx-4" />
}
