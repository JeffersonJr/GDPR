'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Wand2, UploadCloud, ChevronRight, Check } from 'lucide-react'
import { clsx } from 'clsx'
import Link from 'next/link'
import { toast } from 'sonner'

export default function GenerateDocumentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [docType, setDocType] = useState('privacy_policy')

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    // Simulate generation since actual action is tied to existing documents right now
    setTimeout(() => {
      setLoading(false)
      toast.success('Documento iniciado com sucesso!')
      router.push('/dashboard/documents')
    }, 1500)
  }

  return (
    <div className="page-section max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-sm text-surface-slate dark:text-surface-fog mb-4">
          <Link href="/dashboard/documents" className="hover:text-primary transition-colors">Documentos</Link>
          <ChevronRight size={14} />
          <span className="text-surface-ink dark:text-surface-snow font-medium">Novo Documento</span>
        </div>
        <h1 className="text-3xl font-bold text-surface-ink dark:text-surface-snow flex items-center gap-3">
          <Wand2 className="text-primary" size={28} />
          Gerar Novo Documento
        </h1>
        <p className="text-surface-slate dark:text-surface-fog mt-2">
          Escolha o tipo de documento. A inteligência artificial usará o contexto da sua organização para criar uma versão personalizada e 100% aderente à GDPR.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="glass-card p-6 md:p-8 space-y-8">
        
        <div className="space-y-4">
          <label className="text-sm font-semibold text-surface-ink dark:text-surface-snow">Tipo de Documento</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'privacy_policy', name: 'Política de Privacidade', icon: FileText, desc: 'Termos gerais de privacidade para usuários.' },
              { id: 'dpa', name: 'Data Processing Agreement (DPA)', icon: FileText, desc: 'Contrato de processamento para parceiros.' },
              { id: 'terms_of_service', name: 'Termos de Serviço', icon: FileText, desc: 'Termos de uso da sua plataforma.' },
              { id: 'cookie_policy', name: 'Política de Cookies', icon: FileText, desc: 'Aviso sobre rastreamento de dados.' }
            ].map((type) => (
              <div 
                key={type.id}
                onClick={() => setDocType(type.id)}
                className={clsx(
                  "p-4 rounded-xl border-2 cursor-pointer transition-all",
                  docType === type.id 
                    ? "border-primary bg-primary-light/50 dark:bg-primary/10 shadow-glow-primary" 
                    : "border-surface-fog dark:border-surface-slate/30 hover:border-surface-slate/50 dark:hover:border-surface-fog/50"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <type.icon size={20} className={docType === type.id ? "text-primary" : "text-surface-slate"} />
                    <span className="font-semibold text-surface-ink dark:text-surface-snow text-sm">{type.name}</span>
                  </div>
                  {docType === type.id && <Check size={18} className="text-primary" />}
                </div>
                <p className="text-xs text-surface-slate dark:text-surface-fog mt-2 ml-7">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-surface-fog dark:border-surface-slate/30 flex items-center justify-between">
          <Link href="/dashboard/documents" className="btn-ghost">
            Cancelar
          </Link>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Gerando...' : 'Gerar com Inteligência Artificial'}
            <Wand2 size={16} />
          </button>
        </div>
      </form>
    </div>
  )
}
