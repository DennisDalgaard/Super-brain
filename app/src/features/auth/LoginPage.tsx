import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { Logo } from '@/components/Logo'

export function LoginPage() {
  const { t, i18n } = useTranslation()
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }
      const { error } = await signUp(email, password, name)
      if (error) setError(error.message)
    } else {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
    }

    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle()
    if (error) setError(error.message)
  }

  const setLang = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('superbrain-lang', lang)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <Logo size={84} />
        </div>
        <h1 className="text-[34px] leading-none font-semibold tracking-tight">
          <span className="text-text-primary">Super</span>
          <span className="brand-text-gradient">Brain</span>
        </h1>
        <p className="text-text-secondary text-sm mt-2.5">{t('login_tagline')}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-[360px] glass-card p-6">
        {isSignUp && (
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">
              {t('name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dit navn"
              required
              className="w-full px-4 py-3 glass-input rounded-2xl text-[15px] min-h-[48px]"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">
            {t('email')}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@email.dk"
            required
            className="w-full px-4 py-3 glass-input rounded-2xl text-[15px] min-h-[48px]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">
            {t('password')}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 glass-input rounded-2xl text-[15px] min-h-[48px]"
          />
        </div>

        {isSignUp && (
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-text-secondary mb-1.5 uppercase tracking-[0.08em]">
              {t('confirm_password')}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 glass-input rounded-2xl text-[15px] min-h-[48px]"
            />
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-[rgba(255,77,77,0.1)] border border-[rgba(255,77,77,0.3)] rounded-2xl text-danger text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 btn-brand rounded-full font-medium cursor-pointer text-[15px] min-h-[48px]"
        >
          {loading ? t('loading') : isSignUp ? t('signup') : t('login')}
        </button>

        <div className="flex items-center my-5 text-text-muted text-[13px]">
          <div className="flex-1 h-px bg-[rgba(123,92,255,0.18)]" />
          <span className="px-4">{t('or')}</span>
          <div className="flex-1 h-px bg-[rgba(123,92,255,0.18)]" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 px-6 btn-ghost rounded-full font-medium flex items-center justify-center gap-2.5 cursor-pointer text-[15px] min-h-[48px]"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          {t('continue_google')}
        </button>

        <p className="text-center mt-5 text-sm text-text-secondary">
          {isSignUp ? t('has_account') : t('no_account')}{' '}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError('') }}
            className="brand-text-gradient bg-transparent border-none cursor-pointer font-semibold text-sm"
          >
            {isSignUp ? t('login') : t('signup')}
          </button>
        </p>
      </form>

      {/* Language switcher */}
      <div className="flex gap-2 mt-8">
        {['da', 'en'].map(lang => (
          <button
            key={lang}
            onClick={() => setLang(lang)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium border cursor-pointer transition-colors min-h-[36px] ${
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
  )
}
