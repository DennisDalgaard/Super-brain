import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  large?: boolean
}

export function Modal({ open, onClose, title, children, footer, large }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      style={{
        backgroundColor: 'rgba(8, 8, 18, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={`glass-card w-full max-w-[480px] flex flex-col animate-slide-up rounded-t-[24px] sm:rounded-[24px] ${
          large ? 'max-h-[92vh]' : 'max-h-[85vh]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[rgba(123,92,255,0.16)] shrink-0">
          <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Luk"
            className="p-2 rounded-full text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex gap-2.5 px-5 py-4 border-t border-[rgba(123,92,255,0.16)] shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
