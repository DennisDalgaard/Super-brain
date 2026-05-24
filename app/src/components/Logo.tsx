import { useState } from 'react'

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 32, className = '' }: LogoProps) {
  const [failed, setFailed] = useState(false)
  const src = `${import.meta.env.BASE_URL}superbrain-logo.png`

  if (failed) {
    return <LogoFallback size={size} className={className} />
  }

  return (
    <img
      src={src}
      alt="SuperBrain"
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={`block rounded-[22%] shadow-[0_8px_24px_rgba(79,124,255,0.35)] ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

function LogoFallback({ size, className }: { size: number; className: string }) {
  return (
    <div
      className={`brand-gradient flex items-center justify-center text-white shadow-[0_8px_24px_rgba(79,124,255,0.35)] ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.22),
      }}
    >
      <svg
        width={Math.round(size * 0.6)}
        height={Math.round(size * 0.6)}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M11 6.5c-2.2 0-4 1.6-4 3.6 0 .5.1 1 .3 1.4-1.4.5-2.3 1.8-2.3 3.2 0 1.2.6 2.2 1.6 2.8-.4.5-.6 1.1-.6 1.8 0 1.7 1.4 3.1 3.2 3.1.4 0 .7-.1 1.1-.2.4 1.5 1.8 2.5 3.5 2.5 1.5 0 2.8-.9 3.3-2.2.5 1.3 1.8 2.2 3.3 2.2 1.7 0 3.1-1 3.5-2.5.3.1.7.2 1.1.2 1.8 0 3.2-1.4 3.2-3.1 0-.7-.2-1.3-.6-1.8 1-.6 1.6-1.6 1.6-2.8 0-1.4-.9-2.7-2.3-3.2.2-.4.3-.9.3-1.4 0-2-1.8-3.6-4-3.6-1.3 0-2.5.6-3.2 1.6-.6-.8-1.6-1.3-2.8-1.3s-2.2.5-2.8 1.3c-.7-1-1.9-1.6-3.2-1.6Z"
          stroke="white"
          strokeWidth="1.4"
          strokeLinejoin="round"
          fill="rgba(255,255,255,0.15)"
        />
        <path d="M16 9.5v13" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      </svg>
    </div>
  )
}
