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
      gradient: 'from-brand-500 to-brand-600 dark:from-brand-600 dark:to-brand-800',
      glow: 'shadow-glow-brand/50 dark:shadow-glow-brand',
      badge: null,
      textClass: 'text-white',
      descClass: 'text-brand-100',
      iconBg: 'bg-white/20',
      arrowClass: 'text-brand-200 group-hover:text-white',
    },
    {
      id: 'action-upload',
      icon: Upload,
      title: 'Melhorar Documento Existente',
      description: 'Faça upload do seu documento atual. A IA vai auditá-lo e gerar uma versão corrigida.',
      href: '/dashboard/documents/upload',
      gradient: 'from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800',
      glow: '',
      badge: null,
      textClass: 'text-slate-900 dark:text-white',
      descClass: 'text-slate-600 dark:text-slate-400',
      iconBg: 'bg-slate-300 dark:bg-white/10',
      arrowClass: 'text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white',
    },
    {
      id: 'action-audit',
      icon: FileSearch,
      title: 'Relatório de Conformidade',
      description: 'Gere um relatório jurídico detalhado para apresentar a órgãos reguladores.',
      href: '/dashboard/reports/new',
      gradient: 'from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800',
      glow: '',
      badge: planTier === 'enterprise' ? null : 'Enterprise',
      textClass: 'text-slate-900 dark:text-white',
      descClass: 'text-slate-600 dark:text-slate-400',
      iconBg: 'bg-slate-300 dark:bg-white/10',
      arrowClass: 'text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white',
    },
  ]

  return (
    <div className="glass-card p-6 h-full">
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
        Ações Rápidas
      </h2>
      <div className="space-y-3">
        {actions.map(({ id, icon: Icon, title, description, href, gradient, glow, badge, textClass, descClass, iconBg, arrowClass }) => (
          <Link
            key={id}
            id={id}
            href={href}
            className={`
              relative flex items-center gap-4 p-4 rounded-xl
              bg-gradient-to-r ${gradient} 
              border border-slate-200 dark:border-slate-700/50 hover:border-brand-500/40 dark:hover:border-brand-600/40
              transition-all duration-200 hover:scale-[1.01] ${glow}
              group
            `}
          >
            <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
              <Icon size={20} className={textClass} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-sm ${textClass}`}>{title}</span>
                {badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-warning-500/10 dark:bg-warning-500/20 text-warning-600 dark:text-warning-500 border border-warning-500/30 font-medium">
                    {badge}
                  </span>
                )}
              </div>
              <p className={`text-xs mt-0.5 leading-relaxed ${descClass}`}>{description}</p>
            </div>
            <ArrowRight
              size={16}
              className={`${arrowClass} group-hover:translate-x-1 transition-all shrink-0`}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
