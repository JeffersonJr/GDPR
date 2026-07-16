'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  FileText, Sparkles, Upload, CheckCircle2, Clock, XCircle,
  Loader2, Eye, ShieldAlert, TrendingUp, AlertTriangle, Shield,
  BarChart3, ArrowUpRight, Zap,
} from 'lucide-react'
import { clsx } from 'clsx'
import { getDocumentTypeLabel } from '@/lib/utils'
import type { ComplianceDocument } from '@/types'

// ---- Types ----
type DocumentStatus = 'missing' | 'pending' | 'analyzing' | 'analyzed' | 'compliant' | 'generating'

interface Props {
  profile: any
  org: any
  documents: ComplianceDocument[]
  requiredDocs: string[]
}

// ---- Score Ring (SVG) ----
function ScoreRing({ score }: { score: number }) {
  const size = 120
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#f43f5e'
  const label = score >= 70 ? { text: 'Conforme', Icon: Shield }
    : score >= 40 ? { text: 'Em Progresso', Icon: TrendingUp }
    : { text: 'Atenção', Icon: AlertTriangle }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth={10} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth={10}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-900 dark:text-white">{score}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color }}>
        <label.Icon size={14} />
        {label.text}
      </div>
    </div>
  )
}

// ---- Stat Card ----
function StatCard({
  label, value, sub, icon: Icon, iconColor, trend,
}: {
  label: string; value: string | number; sub?: string
  icon: React.ElementType; iconColor: string; trend?: string
}) {
  return (
    <div className="glass-card p-5 flex items-start gap-4 hover:border-slate-300 dark:hover:border-slate-700/60 transition-all group">
      <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconColor)}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</div>}
      </div>
      {trend && (
        <div className="flex items-center gap-0.5 text-xs text-success-500 font-medium">
          <ArrowUpRight size={12} /> {trend}
        </div>
      )}
    </div>
  )
}

// ---- Status Badge ----
function StatusBadge({ status }: { status: DocumentStatus }) {
  const cfg: Record<DocumentStatus, { label: string; icon: React.ElementType; cls: string }> = {
    missing: { label: 'Faltando', icon: XCircle, cls: 'badge-missing' },
    pending: { label: 'Aguardando', icon: Clock, cls: 'badge-pending' },
    analyzing: { label: 'Analisando', icon: Loader2, cls: 'badge-analyzing' },
    analyzed: { label: 'Analisado', icon: ShieldAlert, cls: 'badge-pending' },
    compliant: { label: 'Regularizado', icon: CheckCircle2, cls: 'badge-compliant' },
    generating: { label: 'Gerando', icon: Sparkles, cls: 'badge-analyzing' },
  }
  const { label, icon: Icon, cls } = cfg[status] ?? cfg.missing
  return (
    <span className={cls}>
      <Icon size={11} className={['analyzing', 'generating'].includes(status) ? 'animate-spin' : ''} />
      {label}
    </span>
  )
}

// ---- Local row type (looser than ComplianceDocument to avoid enum mismatch) ----
interface DocRow {
  type: string
  status: DocumentStatus
  id?: string
  generated_by_ai?: boolean
  [key: string]: unknown
}

// ---- Document Row ----
function DocumentRow({ doc, type }: { doc: DocRow; type: string }) {
  const isCompliant = doc.status === 'compliant'
  const isMissing = doc.status === 'missing'
  const isProcessing = ['analyzing', 'generating', 'pending'].includes(doc.status)

  return (
    <div className={clsx(
      'flex items-center gap-4 px-5 py-4 transition-all group',
      'hover:bg-slate-50 dark:hover:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800/50 last:border-0',
      isCompliant && 'hover:bg-success-500/5',
    )}>
      {/* Icon */}
      <div className={clsx(
        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
        isCompliant ? 'bg-success-500/10' : isMissing ? 'bg-slate-100 dark:bg-slate-800/80' : 'bg-brand-500/10',
      )}>
        <FileText size={15} className={clsx(
          isCompliant ? 'text-success-500' : isMissing ? 'text-slate-400 dark:text-slate-600' : 'text-brand-400',
        )} />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-slate-900 dark:text-white truncate">{getDocumentTypeLabel(type)}</div>
        {doc.generated_by_ai && (
          <div className="flex items-center gap-1 text-xs text-brand-500 mt-0.5">
            <Sparkles size={10} /> Gerado por IA
          </div>
        )}
        {isProcessing && (
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <Loader2 size={10} className="animate-spin" /> Processando...
          </div>
        )}
      </div>

      {/* Status + Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <StatusBadge status={doc.status} />
        <div className={clsx(
          'flex items-center gap-1.5 transition-all duration-200',
          isMissing ? 'opacity-100 md:opacity-0 md:group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100',
        )}>
          {isMissing && (
            <>
              <Link
                href={`/dashboard/documents/generate?type=${type}`}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg transition-all"
                id={`btn-generate-${type}`}
              >
                <Sparkles size={11} /> Gerar com IA
              </Link>
              <Link
                href={`/dashboard/documents/upload?type=${type}`}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 transition-all"
                id={`btn-upload-${type}`}
              >
                <Upload size={11} /> Upload
              </Link>
            </>
          )}
          {doc.id && (doc.status === 'analyzed' || isCompliant) && (
            <Link
              href={`/dashboard/documents/${doc.id}`}
              className="flex items-center gap-1 px-2.5 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 transition-all"
              id={`btn-view-${doc.id}`}
            >
              <Eye size={11} /> Ver
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// ---- Main Dashboard Client ----
export default function DashboardClient({ profile, org, documents, requiredDocs }: Props) {
  const docMap = useMemo(() => new Map(documents.map(d => [d.type, d])), [documents])

  const displayTypes = useMemo(() => {
    const base = [
      'privacy_policy', 'cookie_policy', 'terms_of_use',
      'dpa', 'ropa', 'data_retention_policy',
    ]
    const extras = requiredDocs.filter(d => !base.includes(d))
    const docTypes = [...base, ...extras]
    const customDocs = documents.filter(d => !docTypes.includes(d.type))
    return [...docTypes, ...customDocs.map(d => d.type)]
  }, [requiredDocs, documents])

  const totalRequired = displayTypes.length
  const compliantCount = documents.filter(d => d.status === 'compliant').length
  const pendingCount = documents.filter(d => ['analyzing', 'pending', 'generating'].includes(d.status)).length
  const missingCount = totalRequired - documents.length
  const progressPct = totalRequired > 0 ? Math.round((compliantCount / totalRequired) * 100) : 0

  const firstName = profile?.full_name?.split(' ')[0] ?? 'usuário'

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-slide-up">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Olá, {firstName} 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Status de conformidade da{' '}
            <span className="text-slate-900 dark:text-white font-semibold">{org?.name}</span>
          </p>
        </div>
        <Link
          href="/dashboard/documents/generate"
          className="btn-primary hidden sm:inline-flex shrink-0"
          id="btn-header-generate"
        >
          <Zap size={16} /> Novo Documento
        </Link>
      </div>

      {/* Top grid: Score + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Score card */}
        <div className="glass-card p-6 flex flex-col items-center gap-4 lg:col-span-1">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Score GDPR</span>
            <Link href="/dashboard/reports" className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1">
              Detalhes <ArrowUpRight size={12} />
            </Link>
          </div>
          <ScoreRing score={org?.maturity_score ?? 0} />
          {/* Mini progress */}
          <div className="w-full space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Documentos</span>
              <span className="text-slate-900 dark:text-white">{compliantCount}/{totalRequired}</span>
            </div>
            <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Documentos regularizados"
            value={compliantCount}
            sub={`de ${totalRequired} obrigatórios`}
            icon={CheckCircle2}
            iconColor="bg-success-500"
          />
          <StatCard
            label="Ações pendentes"
            value={missingCount + pendingCount}
            sub={`${missingCount} faltando · ${pendingCount} em análise`}
            icon={AlertTriangle}
            iconColor="bg-warning-500"
          />
          <StatCard
            label="Documentos analisados"
            value={documents.length}
            sub="total de documentos"
            icon={BarChart3}
            iconColor="bg-brand-600"
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          {
            id: 'qa-generate',
            href: '/dashboard/documents/generate',
            gradient: 'from-brand-600 to-brand-800',
            glow: 'hover:shadow-glow-brand',
            icon: Sparkles,
            title: 'Gerar Documento com IA',
            desc: 'Crie documentos GDPR personalizados do zero em minutos',
          },
          {
            id: 'qa-upload',
            href: '/dashboard/documents/upload',
            gradient: 'from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800',
            glow: '',
            icon: Upload,
            title: 'Melhorar Documento Existente',
            desc: 'Faça upload e a IA auditará e corrigirá seu documento',
          },
        ].map(a => (
          <Link
            key={a.id} id={a.id} href={a.href}
            className={clsx(
              'flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r border border-white/5 transition-all duration-200 group',
              a.gradient, a.glow,
            )}
          >
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <a.icon size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm">{a.title}</div>
              <div className="text-xs text-white/60 mt-0.5 leading-relaxed">{a.desc}</div>
            </div>
            <ArrowUpRight size={16} className="text-white/40 group-hover:text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </Link>
        ))}
      </div>

      {/* Documents list */}
      <div className="glass-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800/60">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Documentos de Conformidade</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {compliantCount} de {totalRequired} regularizados · {progressPct}% completo
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Progress pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{progressPct}%</span>
            </div>
            <Link
              href="/dashboard/documents"
              className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 font-medium transition-colors"
            >
              Ver todos <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Rows */}
        <div>
          {displayTypes.map(type => {
            const doc = docMap.get(type as any)
            const row: DocRow = doc
              ? { ...doc, type, status: doc.status as DocumentStatus }
              : { type, status: 'missing' as const, generated_by_ai: false, id: undefined }
            return <DocumentRow key={type} doc={row} type={type} />
          })}
        </div>

        {/* Footer CTA if many missing */}
        {missingCount > 0 && (
          <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800/60 bg-brand-50 dark:bg-brand-600/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles size={14} className="text-brand-500 dark:text-brand-400" />
              <span className="text-slate-700 dark:text-slate-300">
                <span className="text-slate-900 dark:text-white font-semibold">{missingCount} documentos</span> podem ser gerados automaticamente pela IA
              </span>
            </div>
            <Link
              href="/dashboard/documents/generate"
              className="btn-primary text-xs px-4 py-2 shrink-0"
              id="btn-generate-all"
            >
              Gerar todos
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

