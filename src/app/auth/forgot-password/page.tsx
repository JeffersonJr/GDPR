'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      toast.error('Erro ao enviar e-mail', { description: error.message })
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="space-y-6 text-center animate-fade-in">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-success-500/10 border border-success-500/20 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-success-500" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">E-mail enviado!</h2>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed">
            Enviamos um link de redefinição para <strong className="text-white">{email}</strong>.
            Verifique sua caixa de entrada (e spam) e siga as instruções.
          </p>
        </div>
        <Link href="/auth/login" className="btn-secondary w-full">
          <ArrowLeft size={16} />
          Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">Recuperar senha</h2>
        <p className="text-slate-400 text-sm">
          Informe seu e-mail e enviaremos um link de redefinição.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label htmlFor="email" className="input-label">E-mail</label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="input-field pl-11"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3"
          id="btn-reset-password"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Enviando...</>
          ) : (
            'Enviar link de recuperação'
          )}
        </button>
      </form>

      <Link
        href="/auth/login"
        className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar para o login
      </Link>
    </div>
  )
}
