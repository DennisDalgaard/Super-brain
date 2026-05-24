import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, User, Hash, FileText } from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, labelKey: 'nav_home' },
  { path: '/names', icon: User, labelKey: 'nav_names' },
  { path: '/peg', icon: Hash, labelKey: 'nav_peg' },
  { path: '/notes', icon: FileText, labelKey: 'nav_notes' },
]

export function BottomNav() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className="glass-nav flex h-16 shrink-0"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {navItems.map(item => {
        const isActive = location.pathname === item.path
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors border-none bg-transparent cursor-pointer min-h-[44px] ${
              isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <span
              className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-colors ${
                isActive ? 'bg-[rgba(79,124,255,0.18)] text-[#9CB6FF]' : ''
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.4 : 2} />
            </span>
            <span className={isActive ? 'text-[#9CB6FF]' : ''}>{t(item.labelKey)}</span>
          </button>
        )
      })}
    </nav>
  )
}
