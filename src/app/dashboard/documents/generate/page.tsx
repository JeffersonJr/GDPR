'use client'

import { useState } from 'react'
import { Sparkles, FileText, ChevronRight, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { clsx } from 'clsx'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { createDocumentAction, generateDocumentAiAction } from '@/lib/actions'

const docTypes = [
  { id: 'privacy_policy', label: 'Política de Privacidade', desc: 'Conforme Art. 13 e 14 da GDPR' },
  { id: 'cookie_policy', label: 'Política de Cookies', desc: 'Aviso e consentimento de rastreadores' },
  { id: 'terms_of_use', label: 'Termos de Uso', desc: 'Regras de utilização do seu serviço' },
  { id: 'dpa', label: 'Data Processing Agreement', desc: 'Contrato com processadores (Art. 28)' },
]

export default function GenerateDocumentPage() {
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState('privacy_policy')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")
      
      const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single()
      if (!profile?.org_id) throw new Error("Organização não encontrada")

      const docName = docTypes.find(d => d.id === selectedType)?.label || 'Documento Gerado'

      const { data: doc, error: createErr } = await createDocumentAction({
        org_id: profile.org_id,
        name: docName,
        type: selectedType,
        status: 'generating',
        generated_by_ai: true
      })

      if (createErr || !doc) throw new Error(createErr || "Falha ao criar o documento")

      const { error: genErr } = await generateDocumentAiAction(doc.id)
      if (genErr) {
        if (genErr === 'limit_reached') throw new Error("Limite de geração por IA atingido para o seu plano.")
        throw new Error(genErr)
      }

      setIsGenerating(false)
      setIsDone(true)
    } catch (err: any) {
      toast.error('Erro ao gerar documento', { description: err.message })
      setIsGenerating(false)
    }
  }

  if (isDone) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center animate-slide-up space-y-6">
        <div className="w-20 h-20 bg-success-50 dark:bg-success-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow-success">
          <CheckCircle2 size={40} className="text-success-500" />
        </div>
        <h2 className="text-3xl font-bold text-surface-ink dark:text-surface-snow">Documento Gerado com Sucesso!</h2>
        <p className="text-surface-slate dark:text-surface-fog max-w-lg mx-auto">
          Nossa IA gerou o documento estruturado e mapeado com as bases legais da GDPR. Você já pode visualizá-lo e exportá-lo no seu painel.
        </p>
        <div className="pt-8">
          <Link href="/dashboard/documents" className="btn-primary inline-flex">
            Ir para Meus Documentos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-medium text-surface-slate hover:text-primary dark:text-surface-fog dark:hover:text-primary-light transition-colors mb-6">
          <ArrowLeft size={16} /> Voltar
        </Link>
        
        <h1 className="text-3xl font-bold text-surface-ink dark:text-surface-snow flex items-center gap-3">
          <Sparkles className="text-primary" size={32} />
          Gerar Documento com IA
        </h1>
        <p className="text-surface-slate dark:text-surface-fog mt-2">
          Crie documentos jurídicos sob medida para a sua organização em poucos minutos.
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <div className={clsx("flex-1 h-2 rounded-full transition-colors", step >= 1 ? "bg-primary" : "bg-surface-fog dark:bg-surface-slate/30")} />
        <div className={clsx("flex-1 h-2 rounded-full transition-colors", step >= 2 ? "bg-primary" : "bg-surface-fog dark:bg-surface-slate/30")} />
      </div>

      <div className="glass-card p-6 md:p-8">
        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <h3 className="text-xl font-semibold text-surface-ink dark:text-surface-snow">1. Qual documento você precisa?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docTypes.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedType(doc.id)}
                  className={clsx(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    selectedType === doc.id
                      ? "border-primary bg-primary-light/10 dark:bg-primary/5 shadow-glow-primary"
                      : "border-surface-fog dark:border-surface-slate/20 hover:border-surface-slate/40 dark:hover:border-surface-fog/40 bg-surface-snow dark:bg-surface-ink"
                  )}
                >
                  <FileText size={24} className={selectedType === doc.id ? "text-primary" : "text-surface-slate dark:text-surface-fog"} />
                  <h4 className="font-semibold text-surface-ink dark:text-surface-snow mt-3">{doc.label}</h4>
                  <p className="text-xs text-surface-slate dark:text-surface-fog mt-1">{doc.desc}</p>
                </div>
              ))}
            </div>
            <div className="pt-6 flex justify-end">
              <button onClick={() => setStep(2)} className="btn-primary">
                Próximo Passo <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <h3 className="text-xl font-semibold text-surface-ink dark:text-surface-snow">2. Contexto da Organização</h3>
            <p className="text-sm text-surface-slate dark:text-surface-fog">
              Forneça detalhes adicionais para que a IA personalize o documento especificamente para o seu modelo de negócio.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="input-label">Público-alvo principal</label>
                <select className="input-field">
                  <option>B2B (Empresas)</option>
                  <option>B2C (Consumidores finais)</option>
                  <option>B2B e B2C</option>
                </select>
              </div>
              
              <div>
                <label className="input-label">Dados coletados (Opcional)</label>
                <textarea 
                  className="input-field min-h-[100px]" 
                  placeholder="Ex: Nome, E-mail, Dados de navegação, Telefone..."
                />
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <button onClick={() => setStep(1)} className="btn-secondary">
                Voltar
              </button>
              <button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="btn-primary min-w-[160px]"
              >
                {isGenerating ? (
                  <><Loader2 size={16} className="animate-spin" /> Gerando...</>
                ) : (
                  <><Sparkles size={16} /> Gerar Agora</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
