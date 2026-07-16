'use client'

import { Bell, Search } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface TopBarProps {
  profile: any
}

export default function TopBar({ profile }: TopBarProps) {
  return (
    <header className="h-16 bg-white/80 dark:bg-surface-ink/80 backdrop-blur-md border-b border-surface-fog dark:border-surface-slate/20 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="relative hidden md:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-slate dark:text-surface-fog" />
        <input
          type="search"
          placeholder="Buscar documentos..."
          className="w-64 bg-surface-cream dark:bg-surface-ink border border-surface-fog dark:border-surface-slate/50 rounded-xl pl-9 pr-4 py-2 text-sm text-surface-ink dark:text-surface-snow placeholder-surface-slate dark:placeholder-surface-fog focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm dark:shadow-none"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        <ThemeToggle />
        
        <button
          className="relative w-9 h-9 rounded-xl bg-white dark:bg-surface-ink border border-surface-fog dark:border-surface-slate/50 flex items-center justify-center text-surface-slate hover:text-surface-ink dark:hover:text-surface-snow hover:border-surface-slate dark:hover:border-surface-fog transition-all shadow-sm dark:shadow-none"
          title="Notificações"
          id="btn-notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
