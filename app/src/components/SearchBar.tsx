import { Search } from 'lucide-react'

interface SearchBarProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
  return (
    <div className="px-4 py-3 shrink-0">
      <div className="flex items-center gap-2.5 bg-bg-input border border-border rounded-xl px-3.5 py-2.5 transition-colors focus-within:border-accent focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.3)]">
        <Search size={18} className="text-text-muted shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent border-none text-text-primary text-[15px] outline-none placeholder:text-text-muted"
        />
      </div>
    </div>
  )
}
