'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { completeOnboardingAction } from '@/lib/actions'
import { toast } from 'sonner'
import {
  Building2, Users, Globe, Database, Shield, ChevronRight, ChevronLeft,
  CheckCircle2, Loader2, Sparkles, TrendingUp, AlertTriangle, ArrowRight,
  FileText, Star, Info,
} from 'lucide-react'
import { clsx } from 'clsx'
import { calculateMaturityScore, determineRequiredDocuments, getDocumentTypeLabel } from '@/lib/utils'

// ---- Constants ----
const STEPS = [
  { id: 1, title: 'Sua Empresa', description: 'Informações básicas da organização', icon: Building2 },
  { id: 2, title: 'Tamanho & Nicho', description: 'Perfil operacional', icon: Users },
  { id: 3, title: 'Presença na UE', description: 'Jurisdição e alcance', icon: Globe },
  { id: 4, title: 'Dados Tratados', description: 'Volume e sensibilidade', icon: Database },
  { id: 5, title: 'Documentos', description: 'O que você já tem', icon: Shield },
]

const NICHES = [
  { value: 'SaaS / Software', icon: '💻' },
  { value: 'E-commerce', icon: '🛒' },
  { value: 'Saúde & Bem-estar', icon: '🏥' },
  { value: 'Finanças & Fintech', icon: '💳' },
  { value: 'Educação', icon: '🎓' },
  { value: 'Marketing & Publicidade', icon: '📢' },
  { value: 'RH & Recrutamento', icon: '👥' },
  { value: 'Jurídico', icon: '⚖️' },
  { value: 'Indústria & Manufatura', icon: '🏭' },
  { value: 'Varejo', icon: '🏪' },
  { value: 'Consultoria', icon: '📊' },
  { value: 'Outro', icon: '🔷' },
]

const ORG_SIZES = [
  { value: 'solo', label: 'Solo', desc: '1 pessoa', icon: '🧑' },
  { value: 'micro', label: 'Micro', desc: '2–10 funcionários', icon: '👥' },
  { value: 'small', label: 'Pequena', desc: '11–50 funcionários', icon: '🏢' },
  { value: 'medium', label: 'Média', desc: '51–250 funcionários', icon: '🏬' },
  { value: 'large', label: 'Grande', desc: '251–1.000 funcionários', icon: '🏙️' },
  { value: 'enterprise', label: 'Enterprise', desc: '1.000+ funcionários', icon: '🌐' },
]

const DATA_VOLUMES = [
  { value: 'under_500', label: 'Menos de 500', risk: 'Baixo' },
  { value: '500_to_5000', label: '500 – 5.000', risk: 'Baixo' },
  { value: '5000_to_50000', label: '5.000 – 50.000', risk: 'Médio' },
  { value: '50000_to_500000', label: '50.000 – 500.000', risk: 'Alto' },
  { value: 'over_500000', label: 'Mais de 500.000', risk: 'Crítico' },
]

const DOCUMENT_OPTIONS = [
  { value: 'privacy_policy', label: 'Política de Privacidade', icon: '📄' },
  { value: 'cookie_policy', label: 'Política de Cookies', icon: '🍪' },
  { value: 'terms_of_use', label: 'Termos de Uso', icon: '📋' },
  { value: 'dpa', label: 'DPA (Data Processing Agreement)', icon: '🤝' },
  { value: 'ropa', label: 'ROPA (Registro de Atividades)', icon: '📊' },
  { value: 'dpia', label: 'DPIA (Avaliação de Impacto)', icon: '🔍' },
]

const RISK_COLORS: Record<string, string> = {
  Baixo: 'text-success-500 bg-success-500/10 border-success-500/20',
  Médio: 'text-warning-500 bg-warning-500/10 border-warning-500/20',
  Alto: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  Crítico: 'text-danger-500 bg-danger-500/10 border-danger-500/20',
}

interface FormData {
  org_name: string
  domain: string
  country: string
  niche: string
  size: string
  has_eu_presence: boolean
  data_volume: string
  processes_special_categories: boolean
  has_iso_cert: boolean
  existing_documents: string[]
}

const initialForm: FormData = {
  org_name: '', domain: '', country: 'PT', niche: '', size: '',
  has_eu_presence: false, data_volume: '', processes_special_categories: false,
  has_iso_cert: false, existing_documents: [],
}

// ---- Animated Score Ring ----
function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const [animated, setAnimated] = useState(0)
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animated / 100) * circumference

  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#f43f5e'
  const label = score >= 70 ? 'Bom' : score >= 40 ? 'Regular' : 'Crítico'

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={12} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth={12}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{score}</span>
          <span className="text-xs text-slate-400">/ 100</span>
        </div>
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ color, borderColor: color + '40', background: color + '15' }}>
        {label}
      </span>
    </div>
  )
}

// ---- Result Step ----
function ResultStep({ form, score, requiredDocs, onFinish, loading }: {
  form: FormData; score: number; requiredDocs: string[]; onFinish: () => void; loading: boolean
}) {
  const alreadyHas = form.existing_documents.length
  const toGenerate = requiredDocs.filter(d => !form.existing_documents.includes(d)).length
  const toImprove = requiredDocs.filter(d => form.existing_documents.includes(d)).length

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Score hero */}
      <div className="text-center space-y-2">
        <p className="text-sm text-slate-400 uppercase tracking-wider font-medium">Diagnóstico GDPR</p>
        <h2 className="text-2xl font-bold text-white">Perfil de Conformidade</h2>
        <p className="text-slate-400 text-sm">de <span className="text-white font-semibold">{form.org_name}</span></p>
      </div>

      <div className="flex justify-center">
        <ScoreRing score={score} size={160} />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Documentos necessários', value: requiredDocs.length, color: 'text-white' },
          { label: 'Para gerar com IA', value: toGenerate, color: 'text-brand-400' },
          { label: 'Para melhorar', value: toImprove, color: 'text-warning-500' },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1 leading-tight">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Profile summary */}
      <div className="glass-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Info size={14} className="text-brand-400" /> Resumo do perfil
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: 'Nicho', value: form.niche },
            { label: 'Tamanho', value: ORG_SIZES.find(s => s.value === form.size)?.label ?? '' },
            { label: 'País', value: form.country },
            { label: 'Presença UE', value: form.has_eu_presence ? 'Sim' : 'Não' },
            { label: 'ISO 27001', value: form.has_iso_cert ? 'Sim' : 'Não' },
            { label: 'Volume de dados', value: DATA_VOLUMES.find(d => d.value === form.data_volume)?.label ?? '' },
          ].map(item => (
            <div key={item.label} className="flex justify-between gap-2 py-1.5 border-b border-slate-800/60 last:border-0">
              <span className="text-slate-500">{item.label}</span>
              <span className="text-slate-200 font-medium text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Required docs preview */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <FileText size={14} className="text-brand-400" /> Documentos obrigatórios para o seu perfil
        </h3>
        <div className="space-y-1.5">
          {requiredDocs.slice(0, 5).map(doc => {
            const hasDoc = form.existing_documents.includes(doc)
            return (
              <div key={doc} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-900/60">
                {hasDoc
                  ? <CheckCircle2 size={14} className="text-success-500 shrink-0" />
                  : <Sparkles size={14} className="text-brand-400 shrink-0" />}
                <span className="text-xs text-slate-300">{getDocumentTypeLabel(doc)}</span>
                <span className={clsx('ml-auto text-xs px-2 py-0.5 rounded-full border',
                  hasDoc ? 'text-warning-500 bg-warning-500/10 border-warning-500/20' : 'text-brand-400 bg-brand-500/10 border-brand-500/20'
                )}>
                  {hasDoc ? 'Melhorar' : 'Gerar'}
                </span>
              </div>
            )
          })}
          {requiredDocs.length > 5 && (
            <p className="text-xs text-slate-500 text-center pt-1">+ {requiredDocs.length - 5} outros documentos</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onFinish}
        disabled={loading}
        className="btn-primary w-full py-3.5 text-base"
        id="btn-onboarding-finish"
      >
        {loading
          ? <><Loader2 size={18} className="animate-spin" /> Criando seu workspace...</>
          : <><Sparkles size={18} /> Acessar o Dashboard<ArrowRight size={16} /></>
        }
      </button>
    </div>
  )
}

// ---- Main Component ----
export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(initialForm)
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [requiredDocs, setRequiredDocs] = useState<string[]>([])

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleDoc(doc: string) {
    setForm(prev => ({
      ...prev,
      existing_documents: prev.existing_documents.includes(doc)
        ? prev.existing_documents.filter(d => d !== doc)
        : [...prev.existing_documents, doc],
    }))
  }

  function canProceed(): boolean {
    if (step === 1) return form.org_name.trim().length >= 2
    if (step === 2) return !!form.niche && !!form.size
    if (step === 3) return !!form.country
    if (step === 4) return !!form.data_volume
    return true
  }

  function handleNext() {
    if (step < STEPS.length) {
      setStep(s => s + 1)
    } else {
      // Calculate results before showing result screen
      const s = calculateMaturityScore({
        has_eu_presence: form.has_eu_presence,
        has_iso_cert: form.has_iso_cert,
        existing_documents: form.existing_documents,
        processes_special_categories: form.processes_special_categories,
        data_volume: form.data_volume,
      })
      const docs = determineRequiredDocuments({
        size: form.size,
        processes_special_categories: form.processes_special_categories,
        has_eu_presence: form.has_eu_presence,
        data_volume: form.data_volume,
      })
      setScore(s)
      setRequiredDocs(docs)
      setShowResult(true)
    }
  }

  async function handleFinish() {
    setLoading(true)
    try {
      const result = await completeOnboardingAction({
        org_name: form.org_name,
        domain: form.domain,
        country: form.country,
        niche: form.niche,
        size: form.size,
        has_eu_presence: form.has_eu_presence,
        data_volume: form.data_volume,
        processes_special_categories: form.processes_special_categories,
        has_iso_cert: form.has_iso_cert,
        existing_documents: form.existing_documents,
      })

      if (result.error) throw new Error(result.error)

      toast.success('Workspace criado!', { description: `Score inicial: ${score}/100` })
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      toast.error('Erro ao salvar', { description: err.message })
    } finally {
      setLoading(false)
    }
  }

  // ---- Result screen ----
  if (showResult) {
    return (
      <ResultStep
        form={form} score={score} requiredDocs={requiredDocs}
        onFinish={handleFinish} loading={loading}
      />
    )
  }

  // ---- Wizard steps ----
  const totalSteps = STEPS.length
  const progress = ((step - 1) / totalSteps) * 100

  return (
    <div className="space-y-8">
      {/* Step header */}
      <div className="space-y-5">
        {/* Step icons */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isActive = s.id === step
            const isDone = s.id < step
            return (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
                  isDone ? 'bg-brand-600 shadow-glow-brand' :
                  isActive ? 'bg-brand-600/20 border-2 border-brand-500' :
                  'bg-slate-800 border border-slate-700',
                )}>
                  {isDone
                    ? <CheckCircle2 size={15} className="text-white" />
                    : <Icon size={14} className={isActive ? 'text-brand-400' : 'text-slate-600'} />
                  }
                </div>
                {i < STEPS.length - 1 && (
                  <div className={clsx(
                    'flex-1 h-0.5 rounded-full transition-all duration-500',
                    isDone ? 'bg-brand-600' : 'bg-slate-800',
                  )} />
                )}
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium text-slate-300">{STEPS[step - 1].title}</span>
            <span>{step} de {totalSteps} etapas</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500"
              style={{ width: `${progress + (100 / totalSteps)}%` }}
            />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">{STEPS[step - 1].title}</h1>
          <p className="text-slate-400 text-sm mt-1">{STEPS[step - 1].description}</p>
        </div>
      </div>

      {/* Step content card */}
      <div className="glass-card p-7 space-y-5 animate-fade-in" key={step}>

        {/* STEP 1 — Company */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label htmlFor="field-org-name" className="input-label">
                Nome da empresa <span className="text-danger-500">*</span>
              </label>
              <input
                id="field-org-name" type="text" autoFocus
                placeholder="Ex: Acme Technologies Lda."
                value={form.org_name}
                onChange={e => update('org_name', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="field-domain" className="input-label">
                Website / Domínio
                <span className="ml-2 text-xs text-slate-500 font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">https://</span>
                <input
                  id="field-domain" type="text"
                  placeholder="acme.com"
                  value={form.domain}
                  onChange={e => update('domain', e.target.value)}
                  className="input-field pl-20"
                />
              </div>
            </div>
            <div>
              <label htmlFor="field-country" className="input-label">País de sede</label>
              <select
                id="field-country" value={form.country}
                onChange={e => update('country', e.target.value)}
                className="input-field"
              >
                <option value="PT">🇵🇹 Portugal</option>
                <option value="ES">🇪🇸 Espanha</option>
                <option value="FR">🇫🇷 França</option>
                <option value="DE">🇩🇪 Alemanha</option>
                <option value="IT">🇮🇹 Itália</option>
                <option value="NL">🇳🇱 Países Baixos</option>
                <option value="BE">🇧🇪 Bélgica</option>
                <option value="PL">🇵🇱 Polónia</option>
                <option value="SE">🇸🇪 Suécia</option>
                <option value="BR">🇧🇷 Brasil</option>
                <option value="OTHER">🌍 Outro</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2 — Size & Niche */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="input-label mb-3">Nicho de atuação <span className="text-danger-500">*</span></label>
              <div className="grid grid-cols-2 gap-2">
                {NICHES.map(n => (
                  <button
                    key={n.value} type="button"
                    onClick={() => update('niche', n.value)}
                    className={clsx(
                      'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium border transition-all text-left',
                      form.niche === n.value
                        ? 'bg-brand-600/20 border-brand-500 text-white shadow-glow-brand/20'
                        : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-300',
                    )}
                  >
                    <span className="text-base">{n.icon}</span>
                    <span className="truncate">{n.value}</span>
                    {form.niche === n.value && <CheckCircle2 size={14} className="ml-auto shrink-0 text-brand-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="input-label mb-3">Tamanho da empresa <span className="text-danger-500">*</span></label>
              <div className="grid grid-cols-2 gap-2">
                {ORG_SIZES.map(s => (
                  <button
                    key={s.value} type="button"
                    onClick={() => update('size', s.value)}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all',
                      form.size === s.value
                        ? 'bg-brand-600/20 border-brand-500 text-white'
                        : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:border-slate-600',
                    )}
                  >
                    <span className="text-lg">{s.icon}</span>
                    <div className="text-left">
                      <div className="text-sm font-semibold">{s.label}</div>
                      <div className="text-xs opacity-60">{s.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — EU Presence */}
        {step === 3 && (
          <div className="space-y-4">
            <ToggleCard
              id="toggle-eu-presence"
              title="Presença física na União Europeia"
              description="Escritório, funcionários ou estabelecimento em país da UE/EEE"
              checked={form.has_eu_presence}
              onChange={v => update('has_eu_presence', v)}
              icon="🇪🇺"
            />
            <ToggleCard
              id="toggle-iso-cert"
              title="Possui certificação ISO 27001 ou similar"
              description="Certificações de segurança da informação já implementadas"
              checked={form.has_iso_cert}
              onChange={v => update('has_iso_cert', v)}
              icon="🛡️"
            />
            <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-600/5 border border-brand-600/20">
              <Info size={16} className="text-brand-400 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-400 leading-relaxed">
                <span className="text-brand-300 font-medium">Art. 3º GDPR:</span> Empresas fora da UE que oferecem serviços a cidadãos europeus também estão sujeitas ao regulamento.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4 — Data Volume */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <label className="input-label mb-3">
                Volume de dados pessoais tratados <span className="text-danger-500">*</span>
                <span className="ml-1 text-slate-500 font-normal">(registros/titulares)</span>
              </label>
              <div className="space-y-2">
                {DATA_VOLUMES.map(v => {
                  const riskCls = RISK_COLORS[v.risk] ?? ''
                  return (
                    <button
                      key={v.value} type="button"
                      onClick={() => update('data_volume', v.value)}
                      className={clsx(
                        'w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all',
                        form.data_volume === v.value
                          ? 'bg-brand-600/20 border-brand-500 text-white'
                          : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:border-slate-600',
                      )}
                    >
                      <div className={clsx(
                        'w-2.5 h-2.5 rounded-full shrink-0',
                        v.risk === 'Baixo' ? 'bg-success-500' :
                        v.risk === 'Médio' ? 'bg-warning-500' :
                        v.risk === 'Alto' ? 'bg-orange-400' : 'bg-danger-500',
                      )} />
                      <span className="font-medium text-sm flex-1 text-left">{v.label}</span>
                      <span className={clsx('text-xs px-2 py-0.5 rounded-full border font-medium', riskCls)}>
                        {v.risk}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
            <ToggleCard
              id="toggle-special-categories"
              title="Trata dados de categorias especiais"
              description="Saúde, biométricos, genéticos, políticos, religiosos ou criminais (Art. 9 GDPR)"
              checked={form.processes_special_categories}
              onChange={v => update('processes_special_categories', v)}
              icon="⚠️"
              warning
            />
          </div>
        )}

        {/* STEP 5 — Existing Docs */}
        {step === 5 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400 leading-relaxed">
              Marque os documentos que a empresa <span className="text-white font-medium">já possui</span>. A IA irá auditá-los e propor melhorias. Os demais serão gerados do zero.
            </p>
            <div className="space-y-2">
              {DOCUMENT_OPTIONS.map(doc => {
                const checked = form.existing_documents.includes(doc.value)
                return (
                  <button
                    key={doc.value} type="button"
                    onClick={() => toggleDoc(doc.value)}
                    className={clsx(
                      'w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all text-left group',
                      checked
                        ? 'bg-success-500/8 border-success-500/30 text-white'
                        : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-300',
                    )}
                  >
                    <span className="text-lg">{doc.icon}</span>
                    <span className="font-medium text-sm flex-1">{doc.label}</span>
                    <div className={clsx(
                      'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
                      checked ? 'bg-success-500 border-success-500' : 'border-slate-600 group-hover:border-slate-500',
                    )}>
                      {checked && <CheckCircle2 size={11} className="text-white" />}
                    </div>
                  </button>
                )
              })}
            </div>
            {form.existing_documents.length === 0 && (
              <div className="flex items-center gap-2 justify-center text-sm text-slate-500 py-2">
                <Sparkles size={14} className="text-brand-400" />
                A IA irá gerar todos os documentos do zero para você
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(s => s - 1)}
            className="btn-secondary"
            id="btn-onboarding-back"
          >
            <ChevronLeft size={18} />
            Voltar
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed()}
          className="btn-primary flex-1"
          id="btn-onboarding-next"
        >
          {step < STEPS.length ? (
            <>Continuar <ChevronRight size={18} /></>
          ) : (
            <><Star size={16} /> Ver meu diagnóstico</>
          )}
        </button>
      </div>
    </div>
  )
}

// ---- Toggle Card ----
function ToggleCard({ id, title, description, checked, onChange, icon, warning }: {
  id: string; title: string; description: string
  checked: boolean; onChange: (v: boolean) => void
  icon?: string; warning?: boolean
}) {
  return (
    <button
      id={id} type="button"
      onClick={() => onChange(!checked)}
      className={clsx(
        'w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left',
        checked
          ? warning
            ? 'bg-warning-500/10 border-warning-500/40'
            : 'bg-brand-600/15 border-brand-500/50'
          : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600',
      )}
    >
      {icon && <span className="text-xl mt-0.5 shrink-0">{icon}</span>}
      <div className="flex-1">
        <div className={clsx('font-semibold text-sm', checked ? 'text-white' : 'text-slate-300')}>
          {title}
        </div>
        <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</div>
      </div>
      <div className={clsx(
        'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
        checked
          ? warning ? 'bg-warning-500 border-warning-500' : 'bg-brand-500 border-brand-500'
          : 'border-slate-600',
      )}>
        {checked && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
    </button>
  )
}
