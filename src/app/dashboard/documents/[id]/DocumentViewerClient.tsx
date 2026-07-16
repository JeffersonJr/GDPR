'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateDocumentAiAction, auditDocumentAiAction, updateDocumentAction } from '@/lib/actions'
import { getDocumentTypeLabel } from '@/lib/utils'
import { toast } from 'sonner'
import {
  FileText, Wand2, ShieldCheck, AlertTriangle, ArrowLeft,
  CheckCircle2, Download, RefreshCw, Eye, Edit3, Save, Info
} from 'lucide-react'
import { clsx } from 'clsx'
import Link from 'next/link'
import { UpgradeModal } from '@/components/ui/UpgradeModal'
import type { AuditResult } from '@/lib/ai'

interface Props {
  doc: any
  initialOriginalText: string
  initialCompliantText: string
}

export default function DocumentViewerClient({ doc, initialOriginalText, initialCompliantText }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'original' | 'improved'>(doc.compliant_url ? 'improved' : 'original')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  // Editable text state for the improved version
  const [editedText, setEditedText] = useState(initialCompliantText)
  const [isEditing, setIsEditing] = useState(false)

  const isGenerating = doc.status === 'generating'
  const isAnalyzing = doc.status === 'analyzing'
  const isProcessing = isGenerating || isAnalyzing
  
  const analysis = doc.ai_analysis_json as AuditResult | null
  const score = analysis?.complianceScore ?? 0

  async function handleGenerate() {
    setLoading(true)
    const res = await generateDocumentAiAction(doc.id)
    setLoading(false)
    
    if (res.error) {
      if (res.error === 'limit_reached') {
        setShowUpgradeModal(true)
      } else {
        toast.error('Erro ao gerar', { description: res.error })
      }
    } else {
      toast.success('Documento gerado com sucesso!')
      setActiveTab('improved')
      router.refresh()
    }
  }

  async function handleAudit() {
    setLoading(true)
    const res = await auditDocumentAiAction(doc.id)
    setLoading(false)
    
    if (res.error) {
      if (res.error === 'limit_reached') {
        setShowUpgradeModal(true)
      } else {
        toast.error('Erro na auditoria', { description: res.error })
      }
    } else {
      toast.success('Auditoria concluída!')
      setActiveTab('improved')
      router.refresh()
    }
  }

  async function handleSaveEdits() {
    // In a real scenario, this would re-upload the editedText to Storage
    // For this prototype, we'll just show a success message
    setIsEditing(false)
    toast.success('Edições salvas localmente.')
    
    // updateDocumentAction(doc.id, { status: 'compliant' })
  }

  function getScoreColor(s: number) {
    if (s >= 80) return 'text-green-500 bg-green-500/10 border-green-500/20'
    if (s >= 50) return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20'
  }

  return (
    <>
      <UpgradeModal isOpen={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
      <div className="space-y-6">
        {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="text-brand-400" size={24} />
              {getDocumentTypeLabel(doc.type as any)}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {doc.name} • Status: <span className="text-slate-700 dark:text-slate-300 capitalize">{doc.status}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {doc.status === 'missing' && (
            <button
              onClick={handleGenerate}
              disabled={loading || isProcessing}
              className="btn-primary flex items-center gap-2"
            >
              {(loading || isGenerating) ? <RefreshCw className="animate-spin" size={16} /> : <Wand2 size={16} />}
              Gerar com IA
            </button>
          )}

          {doc.status === 'pending' && doc.original_url && (
            <button
              onClick={handleAudit}
              disabled={loading || isProcessing}
              className="btn-primary flex items-center gap-2"
            >
              {(loading || isAnalyzing) ? <RefreshCw className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
              Auditar com IA
            </button>
          )}

          {doc.compliant_url && (
            <a
              href={doc.compliant_url}
              download
              target="_blank"
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors border border-slate-300 dark:border-slate-700"
            >
              <Download size={16} />
              Exportar
            </a>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left/Top Panel: Analysis Results */}
        {analysis && (
          <div className="lg:col-span-3 space-y-4">
            <div className={clsx("glass-card p-5 border", getScoreColor(score))}>
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck size={24} />
                <h3 className="font-semibold">Compliance Score</h3>
              </div>
              <div className="text-4xl font-black mb-1">{score}%</div>
              <p className="text-xs opacity-80">Adequação à GDPR baseada no texto original.</p>
            </div>

            <div className="glass-card p-5 space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="text-amber-400" size={16} />
                Problemas Encontrados
              </h3>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {analysis.issues.map((issue, idx) => (
                  <div key={idx} className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-300 dark:border-slate-700/50 text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={clsx(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                        issue.severity === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                        issue.severity === 'high' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      )}>
                        {issue.severity}
                      </span>
                      <span className="text-slate-400 text-[10px] uppercase">{issue.type.replace('_', ' ')}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{issue.description}</p>
                    <div className="pt-2 border-t border-slate-300 dark:border-slate-700/50">
                      <p className="text-green-600 dark:text-green-400 text-xs">
                        <span className="font-semibold">Sugestão:</span> {issue.suggestion}
                      </p>
                    </div>
                  </div>
                ))}
                {analysis.issues.length === 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum problema encontrado. Excelente!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Right/Bottom Panel: Viewer/Editor */}
        <div className={clsx("glass-card flex flex-col", analysis ? "lg:col-span-9" : "lg:col-span-12")}>
          <div className="flex items-center justify-between px-2 py-2 border-b border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex p-1 bg-slate-200 dark:bg-slate-800/50 rounded-lg">
              <button
                onClick={() => setActiveTab('original')}
                className={clsx(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                  activeTab === 'original' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                <Eye size={14} /> Original
              </button>
              <button
                onClick={() => setActiveTab('improved')}
                disabled={!doc.compliant_url && !initialCompliantText}
                className={clsx(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50",
                  activeTab === 'improved' ? "bg-brand-600 text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                <CheckCircle2 size={14} /> Versão GDPR
              </button>
            </div>
            
            {activeTab === 'improved' && (
              <button
                onClick={() => isEditing ? handleSaveEdits() : setIsEditing(true)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {isEditing ? <><Save size={14} className="text-brand-400" /> Salvar</> : <><Edit3 size={14} /> Editar</>}
              </button>
            )}
          </div>

          <div className="flex-1 p-6 min-h-[60vh] bg-white dark:bg-slate-950 rounded-b-2xl relative">
            {activeTab === 'original' ? (
              <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {doc.original_url?.toLowerCase().endsWith('.pdf') ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 py-20">
                    <Info size={32} />
                    <p>Visualização direta de PDF não suportada aqui.</p>
                    <a href={doc.original_url} target="_blank" className="text-brand-400 hover:underline">Abrir arquivo original</a>
                  </div>
                ) : (
                  initialOriginalText || 'Nenhum texto original disponível.'
                )}
              </div>
            ) : (
              isEditing ? (
                <textarea
                  value={editedText}
                  onChange={e => setEditedText(e.target.value)}
                  className="w-full h-full min-h-[60vh] bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-300 font-mono text-sm leading-relaxed resize-none"
                  spellCheck="false"
                />
              ) : (
                <div className="prose dark:prose-invert prose-brand max-w-none text-slate-700 dark:text-slate-300 text-sm">
                  {/* Basic markdown rendering via pre-wrap for simplicity without adding marked package */}
                  <div className="whitespace-pre-wrap font-mono leading-relaxed">
                    {editedText || initialCompliantText || 'Documento ainda não gerado.'}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
