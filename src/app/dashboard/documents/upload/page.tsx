'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, FileUp, ChevronRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { clsx } from 'clsx'

export default function UploadDocumentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    
    // Simulate upload and analysis
    setTimeout(() => {
      setLoading(false)
      toast.success('Documento enviado e enviado para análise!')
      router.push('/dashboard/documents')
    }, 2000)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  return (
    <div className="page-section max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
      <div>
        <div className="flex items-center gap-2 text-sm text-surface-slate dark:text-surface-fog mb-4">
          <Link href="/dashboard/documents" className="hover:text-primary transition-colors">Documentos</Link>
          <ChevronRight size={14} />
          <span className="text-surface-ink dark:text-surface-snow font-medium">Analisar e Melhorar</span>
        </div>
        <h1 className="text-3xl font-bold text-surface-ink dark:text-surface-snow flex items-center gap-3">
          <FileUp className="text-primary" size={28} />
          Melhorar Documento Existente
        </h1>
        <p className="text-surface-slate dark:text-surface-fog mt-2">
          Faça o upload de um documento atual (Política de Privacidade, Termos de Uso, etc) para que a IA analise a conformidade com a GDPR e sugira as cláusulas faltantes.
        </p>
      </div>

      <form onSubmit={handleUpload} className="glass-card p-6 md:p-8 space-y-8">
        
        <div 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={clsx(
            "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all",
            isDragOver 
              ? "border-primary bg-primary-light/20 dark:bg-primary/10" 
              : "border-surface-fog dark:border-surface-slate/50 hover:border-primary/50 dark:hover:border-primary/50 hover:bg-surface-cream dark:hover:bg-surface-slate/10"
          )}
        >
          {file ? (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="w-16 h-16 bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-semibold text-surface-ink dark:text-surface-snow">{file.name}</h3>
              <p className="text-sm text-surface-slate dark:text-surface-fog mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB • Pronto para envio
              </p>
              <button 
                type="button"
                onClick={() => setFile(null)}
                className="text-xs font-medium text-danger-600 dark:text-danger-500 mt-4 hover:underline"
              >
                Remover e escolher outro arquivo
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-surface-cream dark:bg-surface-slate/30 text-surface-slate dark:text-surface-fog rounded-full flex items-center justify-center mb-4">
                <Upload size={32} />
              </div>
              <h3 className="text-lg font-semibold text-surface-ink dark:text-surface-snow">Arraste seu arquivo aqui</h3>
              <p className="text-sm text-surface-slate dark:text-surface-fog mt-1 mb-6 max-w-sm">
                Suportamos PDFs e documentos do Word (.docx). Tamanho máximo: 10MB.
              </p>
              <label className="btn-secondary cursor-pointer">
                Selecionar Arquivo
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFile(e.target.files[0])
                    }
                  }}
                />
              </label>
            </>
          )}
        </div>

        <div className="pt-6 border-t border-surface-fog dark:border-surface-slate/30 flex items-center justify-between">
          <Link href="/dashboard/documents" className="btn-ghost">
            Cancelar
          </Link>
          <button 
            type="submit" 
            disabled={!file || loading} 
            className="btn-primary"
          >
            {loading ? 'Analisando...' : 'Iniciar Análise de IA'}
            {!loading && <FileText size={16} />}
          </button>
        </div>
      </form>
    </div>
  )
}
