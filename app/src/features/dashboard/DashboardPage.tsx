import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { User, Hash, FileText, Settings, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useNames } from '@/hooks/useNames'
import { usePegEntries } from '@/hooks/usePegEntries'
import { useNotes } from '@/hooks/useNotes'
import { BottomNav } from '@/components/BottomNav'
import { AppHeader } from '@/components/AppHeader'

export function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { names } = useNames()
  const { filledCount, totalCount } = usePegEntries()
  const { notes } = useNotes()

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const initial = displayName.charAt(0).toUpperCase()
  const pegPercentage = Math.round((filledCount / totalCount) * 100)

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto">
      <AppHeader
        showLogo
        title="SuperBrain"
        right={
          <>
            <button
              onClick={() => navigate('/settings')}
              aria-label={t('settings')}
              className="p-2.5 rounded-full text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => signOut()}
              title={t('logout')}
              aria-label={t('logout')}
              className="w-9 h-9 rounded-full brand-gradient flex items-center justify-center text-sm font-semibold text-white border-none cursor-pointer shadow-[0_4px_16px_rgba(79,124,255,0.4)]"
            >
              {initial}
            </button>
          </>
        }
      />

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        <div className="mb-7">
          <h1 className="text-[26px] leading-tight font-semibold tracking-tight mb-1.5">
            {t('welcome')}, {displayName}
          </h1>
          <p className="text-text-secondary text-[15px]">{t('welcome_sub')}</p>
        </div>

        {/* Feature cards */}
        <div className="flex flex-col gap-3 mb-9">
          <FeatureCard
            onClick={() => navigate('/names')}
            icon={<User size={26} className="text-white" strokeWidth={2.2} />}
            gradientClass="brand-gradient"
            title={t('names_title')}
            desc={t('names_desc')}
            count={`${names.length} ${t('nav_names').toLowerCase()}`}
          />
          <FeatureCard
            onClick={() => navigate('/peg')}
            icon={<Hash size={26} className="text-white" strokeWidth={2.2} />}
            gradientClass="brand-gradient-warm"
            title={t('peg_title')}
            desc={t('peg_desc')}
            count={`${filledCount}/${totalCount} ${t('filled')}`}
          />
          <FeatureCard
            onClick={() => navigate('/notes')}
            icon={<FileText size={26} className="text-white" strokeWidth={2.2} />}
            gradientClass="brand-gradient-cyan"
            title={t('notes_title')}
            desc={t('notes_desc')}
            count={`${notes.length} ${t('nav_notes').toLowerCase()}`}
          />
        </div>

        {/* Stats */}
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted mb-3">
          {t('progress')}
        </h2>
        <div className="grid grid-cols-3 gap-2.5">
          <StatCard value={names.length} label={t('names_memorized')} accent="#4F7CFF" />
          <StatCard value={`${pegPercentage}%`} label={t('peg_progress')} accent="#7B5CFF" />
          <StatCard value={notes.length} label={t('techniques_saved')} accent="#33D6FF" />
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

function FeatureCard({ onClick, icon, gradientClass, title, desc, count }: {
  onClick: () => void
  icon: React.ReactNode
  gradientClass: string
  title: string
  desc: string
  count: string
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 p-4 glass-card cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(0,0,0,0.4)] text-left w-full min-h-[88px] border-none"
    >
      <div
        className={`w-14 h-14 rounded-2xl ${gradientClass} flex items-center justify-center shrink-0 shadow-[0_10px_24px_rgba(79,124,255,0.28)]`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[16px] font-semibold mb-0.5 text-text-primary tracking-tight">{title}</h3>
        <p className="text-[13px] text-text-secondary mb-1 truncate">{desc}</p>
        <span className="text-[12px] font-medium text-[#9CB6FF]">{count}</span>
      </div>
      <ChevronRight size={18} className="text-text-muted shrink-0 transition-transform group-hover:translate-x-0.5" />
    </button>
  )
}

function StatCard({ value, label, accent }: { value: number | string; label: string; accent: string }) {
  return (
    <div className="glass-card-soft p-4 text-center">
      <span className="block text-[26px] font-bold tracking-tight mb-1" style={{ color: accent }}>
        {value}
      </span>
      <span className="text-[11px] text-text-secondary leading-snug block">{label}</span>
    </div>
  )
}
