'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  LogOut,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  BarChart3,
} from 'lucide-react'
import { clsx } from 'clsx'
import type { Profile } from '@/types'

interface SidebarProps {
  profile: Profile & { organizations: any } | null
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/documents', label: 'Documentos', icon: FileText },
  { href: '/dashboard/reports', label: 'Relatórios', icon: BarChart3 },
  { href: '/dashboard/knowledge', label: 'Base de Conhecimento', icon: BookOpen },
]

const bottomNavItems = [
  { href: '/settings/team', label: 'Equipe', icon: Users },
  { href: '/settings', label: 'Configurações', icon: Settings },
]

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const org = profile?.organizations
  const planTier = org?.plan_tier ?? 'free'
  const planLabels: Record<string, string> = {
    free: 'Free Trial',
    pro: 'Pro',
    enterprise: 'Enterprise',
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900/80 backdrop-blur-md border-r border-slate-800/60 flex flex-col z-40 hidden lg:flex">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 brand-gradient rounded-xl flex items-center justify-center shadow-glow-brand shrink-0">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-white text-sm tracking-tight truncate">E-Compliance</div>
            <div className="text-xs text-slate-500 truncate">{org?.name ?? 'Carregando...'}</div>
          </div>
        </div>
      </div>

      {/* Plan badge */}
      <div className="px-4 py-3 border-b border-slate-800/60">
        <div className={clsx(
          'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium',
          planTier === 'free' && 'bg-slate-800 text-slate-400',
          planTier === 'pro' && 'bg-brand-600/15 text-brand-400 border border-brand-600/20',
          planTier === 'enterprise' && 'bg-warning-500/10 text-warning-500 border border-warning-500/20',
        )}>
          <span>Plano {planLabels[planTier]}</span>
          {planTier === 'free' && (
            <Link href="/settings/billing" className="text-brand-400 hover:text-brand-300 flex items-center gap-0.5">
              Upgrade <ChevronRight size={12} />
            </Link>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={clsx(isActive ? 'nav-item-active' : 'nav-item')}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom nav + user */}
      <div className="p-4 border-t border-slate-800/60 space-y-1">
        {bottomNavItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(pathname.startsWith(href) ? 'nav-item-active' : 'nav-item')}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}

        {/* User card */}
        <div className="mt-3 pt-3 border-t border-slate-800/60">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center shrink-0 text-white text-xs font-bold">
              {profile?.full_name?.charAt(0) ?? '?'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-white truncate">{profile?.full_name}</div>
              <div className="text-xs text-slate-500 truncate">{profile?.email}</div>
            </div>
            <button
              onClick={handleSignOut}
              className="text-slate-500 hover:text-danger-500 transition-colors"
              title="Sair"
              id="btn-signout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
