import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

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
      <header className="flex items-center px-4 py-3 h-14 bg-bg-secondary border-b border-border shrink-0">
        <button onClick={() => navigate('/')} className="p-2 rounded-lg text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold ml-2">{t('settings')}</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {/* Profile */}
        <div className="mb-7">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">{t('profile')}</h3>
          <div className="bg-bg-card rounded-lg">
            <div className="flex items-center justify-between px-4 py-3.5 text-[15px]">
              <span>{t('name')}</span>
              <span className="text-text-secondary text-sm">{user?.user_metadata?.full_name || '—'}</span>
            </div>
            <div className="h-px bg-border mx-4" />
            <div className="flex items-center justify-between px-4 py-3.5 text-[15px]">
              <span>{t('email')}</span>
              <span className="text-text-secondary text-sm">{user?.email || '—'}</span>
            </div>
          </div>
        </div>

        {/* App settings */}
        <div className="mb-7">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">{t('settings')}</h3>
          <div className="bg-bg-card rounded-lg">
            <div className="flex items-center justify-between px-4 py-3.5 text-[15px]">
              <span>{t('language')}</span>
              <select
                value={i18n.language}
                onChange={(e) => handleLangChange(e.target.value)}
                className="bg-bg-input border border-border text-text-primary px-3 py-1.5 rounded-lg text-sm"
              >
                <option value="da">Dansk</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="h-px bg-border mx-4" />
            <div className="flex items-center justify-between px-4 py-3.5 text-[15px]">
              <span>{t('theme')}</span>
              <span className="text-text-secondary text-sm">Dark</span>
            </div>
          </div>
        </div>

        {/* Data */}
        <div className="mb-7">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Data</h3>
          <div className="bg-bg-card rounded-lg">
            <div className="flex items-center justify-between px-4 py-3.5 text-[15px]">
              <span>{t('export_data')}</span>
              <button className="px-3.5 py-1.5 bg-transparent border border-border text-text-primary rounded-lg text-[13px] font-medium hover:bg-bg-card-hover cursor-pointer transition-colors">
                JSON
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 px-6 bg-transparent border border-danger/30 text-danger rounded-lg hover:bg-danger/10 transition-colors cursor-pointer font-medium text-[15px]"
        >
          {t('logout')}
        </button>
      </div>
    </div>
  )
}
