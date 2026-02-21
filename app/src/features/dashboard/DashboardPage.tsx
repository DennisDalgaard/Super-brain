import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { User, Hash, FileText, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useNames } from '@/hooks/useNames'
import { usePegEntries } from '@/hooks/usePegEntries'
import { useNotes } from '@/hooks/useNotes'
import { BottomNav } from '@/components/BottomNav'

export function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { names } = useNames()
  const { filledCount, totalCount } = usePegEntries()
  const { notes } = useNotes()

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 h-14 bg-bg-secondary border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🧠</span>
          <h2 className="text-lg font-semibold">SuperBrain</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/settings')}
            className="p-2 rounded-lg text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={() => signOut()}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-sm font-semibold text-white border-none cursor-pointer"
            title={t('logout')}
          >
            {initial}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-5 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{t('welcome')}, {displayName} 👋</h1>
          <p className="text-text-secondary text-[15px]">{t('welcome_sub')}</p>
        </div>

        {/* Feature cards */}
        <div className="flex flex-col gap-3 mb-8">
          <FeatureCard
            onClick={() => navigate('/names')}
            icon={<User size={32} className="text-white" />}
            gradient="from-indigo-500 to-purple-500"
            title={t('names_title')}
            desc={t('names_desc')}
            count={`${names.length} ${t('nav_names').toLowerCase()}`}
          />
          <FeatureCard
            onClick={() => navigate('/peg')}
            icon={<Hash size={32} className="text-white" />}
            gradient="from-amber-500 to-red-500"
            title={t('peg_title')}
            desc={t('peg_desc')}
            count={`${filledCount}/${totalCount} ${t('filled')}`}
          />
          <FeatureCard
            onClick={() => navigate('/notes')}
            icon={<FileText size={32} className="text-white" />}
            gradient="from-emerald-500 to-cyan-500"
            title={t('notes_title')}
            desc={t('notes_desc')}
            count={`${notes.length} ${t('nav_notes').toLowerCase()}`}
          />
        </div>

        {/* Stats */}
        <h2 className="text-lg font-semibold mb-3">{t('progress')}</h2>
        <div className="grid grid-cols-3 gap-2.5">
          <StatCard value={names.length} label={t('names_memorized')} />
          <StatCard value={`${Math.round((filledCount / totalCount) * 100)}%`} label={t('peg_progress')} />
          <StatCard value={notes.length} label={t('techniques_saved')} />
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

function FeatureCard({ onClick, icon, gradient, title, desc, count }: {
  onClick: () => void
  icon: React.ReactNode
  gradient: string
  title: string
  desc: string
  count: string
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-5 bg-bg-card border border-border rounded-2xl cursor-pointer transition-all hover:bg-bg-card-hover hover:border-border-light hover:-translate-y-0.5 hover:shadow-lg text-left w-full"
    >
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold mb-0.5">{title}</h3>
        <p className="text-[13px] text-text-secondary mb-1">{desc}</p>
        <span className="text-xs text-accent font-medium">{count}</span>
      </div>
    </button>
  )
}

function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-4 text-center">
      <span className="block text-[28px] font-bold text-accent mb-1">{value}</span>
      <span className="text-xs text-text-secondary">{label}</span>
    </div>
  )
}
