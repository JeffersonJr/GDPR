'use client'

import Link from 'next/link'
import { Sparkles, Upload, FileSearch, ArrowRight } from 'lucide-react'
import type { PlanTier } from '@/types'

interface Props {
  orgId?: string
  planTier: PlanTier
}

export default function QuickActions({ orgId, planTier }: Props) {
  const actions = [
    {
      id: 'action-generate',
      icon: Sparkles,
      title: 'Gerar Documento com IA',
      description: 'Crie um documento GDPR completo e personalizado do zero, em minutos.',
      href: '/dashboard/documents/generate',
      gradient: 'from-brand-600 to-brand-800',
      glow: 'shadow-glow-brand',
      badge: null,
    },
    {
      id: 'action-upload',
      icon: Upload,
      title: 'Melhorar Documento Existente',
      description: 'Faça upload do seu documento atual. A IA vai auditá-lo e gerar uma versão corrigida.',
      href: '/dashboard/documents/upload',
      gradient: 'from-slate-700 to-slate-800',
      glow: '',
      badge: null,
    },
    {
      id: 'action-audit',
      icon: FileSearch,
      title: 'Relatório de Conformidade',
      description: 'Gere um relatório jurídico detalhado para apresentar a órgãos reguladores.',
      href: '/dashboard/reports/new',
      gradient: 'from-slate-700 to-slate-800',
      glow: '',
      badge: planTier === 'enterprise' ? null : 'Enterprise',
    },
  ]

  return (
    <div className="glass-card p-6 h-full">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Ações Rápidas
      </h2>
      <div className="space-y-3">
        {actions.map(({ id, icon: Icon, title, description, href, gradient, glow, badge }) => (
          <Link
            key={id}
            id={id}
            href={href}
            className={`
              relative flex items-center gap-4 p-4 rounded-xl
              bg-gradient-to-r ${gradient} 
              border border-slate-700/50 hover:border-brand-600/40
              transition-all duration-200 hover:scale-[1.01] ${glow}
              group
            `}
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Icon size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">{title}</span>
                {badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-warning-500/20 text-warning-500 border border-warning-500/30 font-medium">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{description}</p>
            </div>
            <ArrowRight
              size={16}
              className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
