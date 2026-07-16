'use client'

import { useState } from 'react'
import { CreditCard, Check, ShieldCheck, Zap } from 'lucide-react'
import { clsx } from 'clsx'

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'enterprise'>('pro')
  const [isYearly, setIsYearly] = useState(true)

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-surface-ink dark:text-surface-snow">
          Faça o Upgrade do seu Plano
        </h1>
        <p className="text-surface-slate dark:text-surface-fog">
          Desbloqueie auditorias ilimitadas, relatórios personalizados pelo DPO e mapeamento completo da sua infraestrutura.
        </p>
        
        {/* Toggle Mensal/Anual */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={clsx("text-sm font-medium", !isYearly ? "text-surface-ink dark:text-surface-snow" : "text-surface-slate dark:text-surface-fog")}>Mensal</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-12 h-6 rounded-full bg-primary relative transition-colors"
          >
            <div className={clsx("w-4 h-4 rounded-full bg-white absolute top-1 transition-all", isYearly ? "right-1" : "left-1")} />
          </button>
          <span className={clsx("text-sm font-medium flex items-center gap-1", isYearly ? "text-surface-ink dark:text-surface-snow" : "text-surface-slate dark:text-surface-fog")}>
            Anual <span className="px-1.5 py-0.5 rounded-md bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500 text-[10px] font-bold uppercase tracking-wider ml-1">Salva 20%</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
        {/* PRO */}
        <div 
          onClick={() => setSelectedPlan('pro')}
          className={clsx(
            "p-6 md:p-8 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden",
            selectedPlan === 'pro' 
              ? "border-primary bg-primary-light/10 dark:bg-primary/5 shadow-glow-primary" 
              : "border-surface-fog dark:border-surface-slate/20 hover:border-surface-slate/50 dark:hover:border-surface-fog/50 glass-card"
          )}
        >
          {selectedPlan === 'pro' && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10" />
          )}
          <div className="flex items-center gap-2 text-primary font-bold mb-2">
            <Zap size={20} /> E-Compliance Pro
          </div>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-black text-surface-ink dark:text-surface-snow">
              {isYearly ? '€ 49' : '€ 59'}
            </span>
            <span className="text-surface-slate dark:text-surface-fog text-sm">/mês</span>
          </div>
          <ul className="space-y-3 mb-8">
            {['Geração ilimitada de documentos IA', 'Mapeamento de Data Mapping (RoPA)', 'Até 5 usuários (Membros da Equipe)', 'Auditoria contínua de sites'].map((feat, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-surface-slate dark:text-surface-fog">
                <Check size={16} className="text-primary shrink-0 mt-0.5" /> {feat}
              </li>
            ))}
          </ul>
        </div>

        {/* ENTERPRISE */}
        <div 
          onClick={() => setSelectedPlan('enterprise')}
          className={clsx(
            "p-6 md:p-8 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden",
            selectedPlan === 'enterprise' 
              ? "border-primary bg-primary-light/10 dark:bg-primary/5 shadow-glow-primary" 
              : "border-surface-fog dark:border-surface-slate/20 hover:border-surface-slate/50 dark:hover:border-surface-fog/50 glass-card"
          )}
        >
          <div className="flex items-center gap-2 text-surface-ink dark:text-surface-snow font-bold mb-2">
            <ShieldCheck size={20} className="text-warning-500" /> Enterprise
          </div>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-black text-surface-ink dark:text-surface-snow">
              {isYearly ? '€ 149' : '€ 189'}
            </span>
            <span className="text-surface-slate dark:text-surface-fog text-sm">/mês</span>
          </div>
          <ul className="space-y-3 mb-8">
            {['Tudo no plano Pro', 'Usuários ilimitados', 'Suporte jurídico prioritário (SLA 4h)', 'Onboarding dedicado com DPO', 'Exportação avançada de relatórios DPA'].map((feat, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-surface-slate dark:text-surface-fog">
                <Check size={16} className="text-warning-500 shrink-0 mt-0.5" /> {feat}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Checkout Form */}
      <div className="max-w-2xl mx-auto glass-card p-6 md:p-8 mt-12 animate-slide-up">
        <h3 className="text-lg font-semibold text-surface-ink dark:text-surface-snow mb-6 flex items-center gap-2 border-b border-surface-fog dark:border-surface-slate/20 pb-4">
          <CreditCard className="text-primary" size={20} />
          Detalhes do Pagamento
        </h3>
        
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="input-label">Nome no Cartão</label>
            <input type="text" className="input-field" placeholder="Ex: Maria Silva" />
          </div>
          
          <div>
            <label className="input-label">Número do Cartão</label>
            <div className="relative">
              <input type="text" className="input-field pl-10" placeholder="0000 0000 0000 0000" />
              <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-slate/50 dark:text-surface-fog/50" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Validade (MM/AA)</label>
              <input type="text" className="input-field" placeholder="12/28" />
            </div>
            <div>
              <label className="input-label">CVC</label>
              <input type="text" className="input-field" placeholder="123" />
            </div>
          </div>
          
          <div className="pt-6 border-t border-surface-fog dark:border-surface-slate/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-sm font-medium text-surface-slate dark:text-surface-fog">
              Total a pagar hoje: <strong className="text-surface-ink dark:text-surface-snow text-lg ml-1">€ {selectedPlan === 'pro' ? (isYearly ? '588' : '59') : (isYearly ? '1788' : '189')}</strong>
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto">
              Confirmar Assinatura
            </button>
          </div>
          <p className="text-center text-[10px] text-surface-slate/70 dark:text-surface-fog/70 mt-4">Pagamento seguro processado via Stripe. Você pode cancelar a qualquer momento.</p>
        </form>
      </div>
    </div>
  )
}
