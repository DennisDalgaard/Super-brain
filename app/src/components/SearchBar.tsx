import { Search } from 'lucide-react'

interface SearchBarProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
  return (
    <div className="px-4 py-3 shrink-0">
      <div className="flex items-center gap-2.5 glass-input rounded-full px-4 py-2.5 min-h-[44px]">
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
