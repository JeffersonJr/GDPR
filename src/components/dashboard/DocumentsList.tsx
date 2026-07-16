'use client'

import Link from 'next/link'
import {
  FileText, Upload, Sparkles, ShieldAlert,
  CheckCircle2, Clock, XCircle, Loader2, Eye,
} from 'lucide-react'
import { clsx } from 'clsx'
import type { ComplianceDocument, DocumentType } from '@/types'

interface Props {
  documents: ComplianceDocument[]
  orgId: string
}

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  privacy_policy: 'Política de Privacidade',
  cookie_policy: 'Política de Cookies',
  terms_of_use: 'Termos de Uso',
  dpa: 'Acordo de Processamento (DPA)',
  ropa: 'Registro de Atividades (ROPA)',
  dpia: 'Avaliação de Impacto (DPIA)',
  breach_notification: 'Notificação de Violação',
  consent_form: 'Formulário de Consentimento',
  data_retention_policy: 'Política de Retenção',
  third_party_processor: 'Processadores Terceiros',
  other: 'Outro Documento',
}

function StatusBadge({ status }: { status: ComplianceDocument['status'] }) {
  const configs = {
    missing: { label: 'Faltando', icon: XCircle, className: 'badge-missing' },
    pending: { label: 'Aguardando', icon: Clock, className: 'badge-pending' },
    analyzing: { label: 'Analisando', icon: Loader2, className: 'badge-analyzing' },
    analyzed: { label: 'Analisado', icon: ShieldAlert, className: 'badge-pending' },
    compliant: { label: 'Regularizado', icon: CheckCircle2, className: 'badge-compliant' },
    generating: { label: 'Gerando IA', icon: Sparkles, className: 'badge-analyzing' },
  }

  const { label, icon: Icon, className } = configs[status]

  return (
    <span className={className}>
      <Icon size={12} className={status === 'analyzing' || status === 'generating' ? 'animate-spin' : ''} />
      {label}
    </span>
  )
}

export default function DocumentsList({ documents, orgId }: Props) {
  const docMap = new Map(documents.map(d => [d.type, d]))

  // Required document types always shown
  const requiredTypes: DocumentType[] = [
    'privacy_policy', 'cookie_policy', 'terms_of_use', 'dpa', 'ropa', 'data_retention_policy',
  ]

  const rows = requiredTypes.map(type => docMap.get(type) ?? {
    id: null,
    type,
    status: 'missing' as const,
    name: DOC_TYPE_LABELS[type],
    generated_by_ai: false,
    original_url: null,
    compliant_url: null,
  })

  // Add extra documents not in required list
  documents
    .filter(d => !requiredTypes.includes(d.type))
    .forEach(d => rows.push(d as any))

  const compliantCount = rows.filter(r => r.status === 'compliant').length
  const total = rows.length

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-white">Documentos de Conformidade</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {compliantCount} de {total} documentos regularizados
          </p>
        </div>
        {/* Progress bar */}
        <div className="hidden md:block w-40">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Progresso</span>
            <span>{Math.round((compliantCount / total) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
              style={{ width: `${(compliantCount / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-800/60">
        {rows.map((doc) => (
          <div
            key={doc.type}
            className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/30 transition-colors group"
          >
            {/* Left */}
            <div className="flex items-center gap-4 min-w-0">
              <div className={clsx(
                'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                doc.status === 'compliant' ? 'bg-success-500/10' :
                doc.status === 'missing' ? 'bg-slate-800' : 'bg-brand-500/10',
              )}>
                <FileText size={16} className={clsx(
                  doc.status === 'compliant' ? 'text-success-500' :
                  doc.status === 'missing' ? 'text-slate-600' : 'text-brand-400',
                )} />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-sm text-white truncate">
                  {DOC_TYPE_LABELS[doc.type as DocumentType]}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  {doc.generated_by_ai && (
                    <span className="flex items-center gap-1 text-brand-500">
                      <Sparkles size={10} /> Gerado por IA
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right — status + actions */}
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <StatusBadge status={doc.status} />

              {doc.status === 'missing' && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/dashboard/documents/generate?type=${doc.type}`}
                    className="btn-primary text-xs px-3 py-1.5"
                    id={`btn-generate-${doc.type}`}
                  >
                    <Sparkles size={12} /> Gerar com IA
                  </Link>
                  <Link
                    href={`/dashboard/documents/upload?type=${doc.type}`}
                    className="btn-secondary text-xs px-3 py-1.5"
                    id={`btn-upload-${doc.type}`}
                  >
                    <Upload size={12} /> Upload
                  </Link>
                </div>
              )}

              {(doc.status === 'analyzed' || doc.status === 'compliant') && doc.id && (
                <Link
                  href={`/dashboard/documents/${doc.id}`}
                  className="btn-ghost text-xs px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  id={`btn-view-${doc.id}`}
                >
                  <Eye size={12} /> Ver
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
