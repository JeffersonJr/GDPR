import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acesse sua conta',
  description: 'Faça login na plataforma E-Compliance para gerenciar a conformidade GDPR da sua empresa.',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-950 to-slate-950">
        {/* Decorative glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-400/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 brand-gradient rounded-xl flex items-center justify-center shadow-glow-brand">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">E-Compliance</span>
              <span className="text-xs text-slate-400 block -mt-0.5">by Evolves</span>
            </div>
          </div>

          {/* Center copy */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
              <span className="text-xs text-brand-400 font-medium">Conformidade GDPR Simplificada</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Proteja os dados.<br />
              <span className="brand-gradient-text">Fortaleça a confiança.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              Nossa IA analisa, gera e melhora seus documentos de conformidade — do zero ou a partir dos seus arquivos existentes.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: '99%', label: 'Taxa de conformidade' },
              { value: '< 24h', label: 'Diagnóstico completo' },
              { value: 'ISO 27001', label: 'Padrão adotado' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <div className="text-2xl font-bold brand-gradient-text">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-8 h-8 brand-gradient rounded-xl flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className="font-bold text-white">E-Compliance</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
