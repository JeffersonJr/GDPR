'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2, ShieldCheck, User, Mail, Lock, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { clsx } from 'clsx'

const PASSWORD_RULES = [
  { label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { label: 'Uma letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Um número', test: (p: string) => /\d/.test(p) },
]

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const passwordStrength = PASSWORD_RULES.filter(r => r.test(password)).length

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (passwordStrength < PASSWORD_RULES.length) {
      toast.error('Senha fraca', { description: 'Atenda a todos os requisitos de segurança.' })
      return
    }
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    })

    if (error) {
      toast.error('Erro no cadastro', { description: error.message })
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="space-y-6 text-center animate-slide-up">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-success-500/10 border-2 border-success-500/30 flex items-center justify-center">
            <CheckCircle2 size={36} className="text-success-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Conta criada!</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Enviamos um link de confirmação para{' '}
            <strong className="text-white">{email}</strong>.<br />
            Verifique sua caixa de entrada para ativar sua conta.
          </p>
        </div>
        <div className="glass-card p-4 text-left space-y-2">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Próximos passos</p>
          {['Confirme seu e-mail', 'Complete o onboarding', 'Receba seu diagnóstico GDPR'].map((step, i) => (
            <div key={step} className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-brand-600/20 border border-brand-600/40 flex items-center justify-center shrink-0">
                <span className="text-xs text-brand-400 font-bold">{i + 1}</span>
              </div>
              <span className="text-slate-300">{step}</span>
            </div>
          ))}
        </div>
        <Link href="/auth/login" className="btn-secondary w-full">
          Ir para o login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">Criar conta grátis</h2>
        <p className="text-slate-400 text-sm">
          Já tem uma conta?{' '}
          <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Entrar
          </Link>
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="reg-name" className="input-label">Nome completo</label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="reg-name" type="text" autoComplete="name" required
              value={name} onChange={e => setName(e.target.value)}
              placeholder="João Silva"
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="reg-email" className="input-label">E-mail profissional</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="reg-email" type="email" autoComplete="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="joao@empresa.com"
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="reg-password" className="input-label">Senha</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="reg-password" type={showPassword ? 'text' : 'password'}
              autoComplete="new-password" required
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pl-10 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Strength indicator */}
          {password.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className={clsx(
                      'flex-1 h-1 rounded-full transition-all duration-300',
                      i < passwordStrength
                        ? passwordStrength === 1 ? 'bg-danger-500'
                          : passwordStrength === 2 ? 'bg-warning-500'
                          : 'bg-success-500'
                        : 'bg-slate-700',
                    )}
                  />
                ))}
              </div>
              <div className="space-y-1">
                {PASSWORD_RULES.map(rule => (
                  <div key={rule.label} className="flex items-center gap-2 text-xs">
                    <div className={clsx(
                      'w-3.5 h-3.5 rounded-full flex items-center justify-center',
                      rule.test(password) ? 'bg-success-500' : 'bg-slate-700',
                    )}>
                      {rule.test(password) && <CheckCircle2 size={9} className="text-white" />}
                    </div>
                    <span className={rule.test(password) ? 'text-success-500' : 'text-slate-500'}>
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-base mt-2"
          id="btn-register"
        >
          {loading
            ? <><Loader2 size={18} className="animate-spin" /> Criando conta...</>
            : <><ShieldCheck size={18} /> Criar conta grátis</>
          }
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-slate-950 px-3 text-slate-500">ou cadastre-se com</span>
        </div>
      </div>

      <button
        type="button"
        onClick={async () => {
          await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback?next=/onboarding` },
          })
        }}
        className="btn-secondary w-full"
        id="btn-google-register"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuar com Google
      </button>

      <p className="text-center text-xs text-slate-600">
        Ao criar uma conta, você concorda com nossos{' '}
        <Link href="/terms" className="text-slate-500 hover:text-slate-400">Termos</Link>
        {' '}e{' '}
        <Link href="/privacy" className="text-slate-500 hover:text-slate-400">Política de Privacidade</Link>.
      </p>
    </div>
  )
}
