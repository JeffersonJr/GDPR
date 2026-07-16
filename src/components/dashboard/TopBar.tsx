'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Search, CheckCircle2, ShieldAlert } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import Link from 'next/link'

interface TopBarProps {
  profile: any
}

export default function TopBar({ profile }: TopBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-9 h-9 rounded-xl bg-white dark:bg-surface-ink border border-surface-fog dark:border-surface-slate/50 flex items-center justify-center text-surface-slate hover:text-surface-ink dark:hover:text-surface-snow hover:border-surface-slate dark:hover:border-surface-fog transition-all shadow-sm dark:shadow-none"
            title="Notificações"
            id="btn-notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full shadow-glow-danger" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-ink border border-surface-fog dark:border-surface-slate/20 rounded-2xl shadow-xl z-50 animate-fade-in overflow-hidden">
              <div className="p-4 border-b border-surface-fog dark:border-surface-slate/20 flex justify-between items-center bg-surface-cream dark:bg-surface-slate/10">
                <h3 className="font-semibold text-sm text-surface-ink dark:text-surface-snow">Notificações</h3>
                <span className="text-xs text-primary font-medium cursor-pointer">Marcar como lidas</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)} className="p-4 border-b border-surface-fog dark:border-surface-slate/10 flex gap-3 hover:bg-surface-snow dark:hover:bg-surface-slate/20 transition-colors">
                  <div className="mt-1 w-8 h-8 rounded-full bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500 flex items-center justify-center shrink-0">
                    <ShieldAlert size={14} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-surface-ink dark:text-surface-snow">3 Riscos Pendentes</h4>
                    <p className="text-xs text-surface-slate dark:text-surface-fog mt-0.5">Atenção necessária nos seus documentos.</p>
                  </div>
                </Link>
                <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)} className="p-4 flex gap-3 hover:bg-surface-snow dark:hover:bg-surface-slate/20 transition-colors">
                  <div className="mt-1 w-8 h-8 rounded-full bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-surface-ink dark:text-surface-snow">Auditoria Concluída</h4>
                    <p className="text-xs text-surface-slate dark:text-surface-fog mt-0.5">Sua Política de Privacidade atingiu 84%.</p>
                  </div>
                </Link>
              </div>
              <div className="p-3 border-t border-surface-fog dark:border-surface-slate/20 text-center bg-surface-cream dark:bg-surface-slate/10">
                <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)} className="text-xs font-medium text-primary hover:text-primary-hover dark:text-primary-light">
                  Ver todas as notificações
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
