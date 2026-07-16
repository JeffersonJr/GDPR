import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Configuração Inicial | E-Compliance',
  description: 'Configure o perfil da sua empresa para receber um diagnóstico personalizado de conformidade GDPR.',
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-800/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 px-8 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 brand-gradient rounded-xl flex items-center justify-center shadow-glow-brand">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">E-Compliance</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Configuração inicial • Leva apenas 3 minutos
          </div>
        </div>
      </header>

      <main className="relative z-10 py-12 px-8">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
