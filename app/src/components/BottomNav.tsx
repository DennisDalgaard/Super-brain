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
    <nav className="flex bg-bg-secondary border-t border-border h-16 shrink-0">
      {navItems.map(item => {
        const isActive = location.pathname === item.path
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors border-none bg-transparent cursor-pointer ${
              isActive ? 'text-accent' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <item.icon size={22} />
            <span>{t(item.labelKey)}</span>
          </button>
        )
      })}
    </nav>
  )
}
