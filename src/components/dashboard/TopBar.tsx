'use client'

import { Bell, Search } from 'lucide-react'

interface TopBarProps {
  profile: any
}

export default function TopBar({ profile }: TopBarProps) {
  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="relative hidden md:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          placeholder="Buscar documentos..."
          className="w-64 bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        <button
          className="relative w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-slate-700 transition-all"
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
