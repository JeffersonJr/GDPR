'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X, Sparkles, Check, Zap } from 'lucide-react'
import { clsx } from 'clsx'

interface UpgradeModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function UpgradeModal({ isOpen, onOpenChange }: UpgradeModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] p-6 glass-card border border-brand-500/20 shadow-2xl animate-fade-in focus:outline-none">
          <div className="absolute right-4 top-4">
            <Dialog.Close className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 hover:bg-slate-800">
              <X size={18} className="text-slate-300" />
            </Dialog.Close>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-brand-500/10 rounded-2xl flex items-center justify-center border border-brand-500/20">
                <Sparkles size={24} className="text-brand-400" />
              </div>
              <Dialog.Title className="text-xl font-bold text-white">
                Limite de Documentos Atingido
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-400 max-w-[80%] mx-auto">
                Você atingiu o limite de processamento de documentos do seu plano atual para este mês.
              </Dialog.Description>
            </div>

            {/* Plan Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-900/40 to-slate-900 border border-brand-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={80} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">E-Compliance Pro</h3>
              <p className="text-sm text-brand-200 mb-4">Expanda seus limites e blinde sua empresa.</p>
              
              <ul className="space-y-2 mb-6">
                {[
                  'Até 20 documentos por mês',
                  'Auditoria jurídica completa via IA',
                  'Geração de políticas dinâmicas',
                  'Suporte prioritário'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check size={16} className="text-brand-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-black text-white">€49</span>
                <span className="text-sm text-slate-400">/mês</span>
              </div>

              <button className="w-full btn-primary py-3 rounded-xl shadow-glow-brand flex justify-center items-center gap-2 font-semibold">
                Fazer Upgrade Agora
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-slate-500">
              Precisa de limites ilimitados? <a href="#" className="text-brand-400 hover:underline">Fale com vendas</a>
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
