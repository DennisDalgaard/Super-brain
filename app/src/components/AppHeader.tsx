import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Logo } from './Logo'

interface AppHeaderProps {
  title?: string
  back?: boolean
  showLogo?: boolean
  right?: ReactNode
}

export function AppHeader({ title, back = false, showLogo = false, right }: AppHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 px-4 h-14 glass-header shrink-0">
      <div className="flex items-center gap-2.5 min-w-0">
        {back && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Tilbage"
            className="-ml-2 p-2.5 rounded-full text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        {showLogo && <Logo size={32} />}
        {title && (
          <h1 className="text-[17px] font-semibold tracking-tight truncate text-text-primary">
            {title}
          </h1>
        )}
      </div>
      {right && <div className="flex items-center gap-1.5 shrink-0">{right}</div>}
    </header>
  )
}
