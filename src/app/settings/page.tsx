'use client'

import { Settings, Save, Building, Mail, Shield, KeyRound, User } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Configurações salvas com sucesso!')
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Senha alterada com sucesso! Você receberá um email de confirmação.')
  }

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-bold text-surface-ink dark:text-surface-snow flex items-center gap-2">
          <Settings className="text-primary" size={24} />
          Configurações da Organização
        </h1>
        <p className="text-sm text-surface-slate dark:text-surface-fog mt-1">
          Gerencie os detalhes, segurança e preferências da sua empresa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          
          {/* Perfil */}
          <form onSubmit={handleSave} className="glass-card p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-semibold text-surface-ink dark:text-surface-snow border-b border-surface-fog dark:border-surface-slate/30 pb-2">
              Perfil da Empresa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="input-label flex items-center gap-2">
                  <Building size={16} /> Nome da Organização
                </label>
                <input type="text" className="input-field" defaultValue="Minha Empresa S.A" />
              </div>
              <div>
                <label className="input-label flex items-center gap-2">
                  <Mail size={16} /> E-mail de Contato DPO
                </label>
                <input type="email" className="input-field" defaultValue="dpo@empresa.com" />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" className="btn-primary">
                <Save size={16} />
                Salvar Perfil
              </button>
            </div>
          </form>

          {/* Segurança / Senha */}
          <form onSubmit={handleChangePassword} className="glass-card p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-semibold text-surface-ink dark:text-surface-snow border-b border-surface-fog dark:border-surface-slate/30 pb-2">
              Segurança e Autenticação
            </h3>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label className="input-label flex items-center gap-2">
                  <KeyRound size={16} /> Senha Atual
                </label>
                <input type="password" className="input-field" placeholder="••••••••" required />
              </div>
              <div>
                <label className="input-label">Nova Senha</label>
                <input type="password" className="input-field" placeholder="••••••••" required />
              </div>
              <div>
                <label className="input-label">Confirmar Nova Senha</label>
                <input type="password" className="input-field" placeholder="••••••••" required />
              </div>
            </div>

            <div className="pt-4 flex justify-start">
              <button type="submit" className="btn-secondary">
                <KeyRound size={16} />
                Atualizar Senha
              </button>
            </div>
          </form>

        </div>

        <div className="space-y-8">
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-semibold text-surface-ink dark:text-surface-snow border-b border-surface-fog dark:border-surface-slate/30 pb-2 flex items-center gap-2">
              <User size={18} /> Ações do Usuário
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-xl border border-surface-fog dark:border-surface-slate/30 hover:bg-surface-snow dark:hover:bg-surface-slate/10 text-sm font-medium transition-colors text-surface-ink dark:text-surface-snow">
                Exportar meus dados (Art. 20 GDPR)
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl border border-surface-fog dark:border-surface-slate/30 hover:bg-surface-snow dark:hover:bg-surface-slate/10 text-sm font-medium transition-colors text-surface-ink dark:text-surface-snow">
                Solicitar auditoria externa
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl border border-danger-500/30 hover:bg-danger-50 dark:hover:bg-danger-500/10 text-sm font-medium transition-colors text-danger-600 dark:text-danger-500 mt-6">
                Excluir Conta Permanentemente
              </button>
            </div>
          </div>

          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-semibold text-surface-ink dark:text-surface-snow border-b border-surface-fog dark:border-surface-slate/30 pb-2">
              Políticas de Acesso
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-start gap-3 p-4 border border-surface-fog dark:border-surface-slate/30 rounded-xl cursor-pointer hover:bg-surface-snow dark:hover:bg-surface-ink transition-colors">
                <input type="checkbox" className="mt-1 accent-primary" defaultChecked />
                <div>
                  <div className="font-semibold text-surface-ink dark:text-surface-snow text-sm flex items-center gap-2">
                    <Shield size={16} className="text-primary" /> Exigir 2FA
                  </div>
                  <p className="text-[10px] text-surface-slate dark:text-surface-fog mt-1">Adiciona uma camada extra de segurança na sua equipe.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
