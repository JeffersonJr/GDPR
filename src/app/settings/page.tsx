import { Settings, Save, Building, Mail, Shield } from 'lucide-react'

export const metadata = {
  title: 'Configurações | E-Compliance',
}

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-ink dark:text-surface-snow flex items-center gap-2">
          <Settings className="text-primary" size={24} />
          Configurações da Organização
        </h1>
        <p className="text-sm text-surface-slate dark:text-surface-fog mt-1">
          Gerencie os detalhes e preferências da sua empresa.
        </p>
      </div>

      <div className="glass-card p-6 md:p-8 space-y-8">
        {/* Formulário Mockado */}
        <div className="space-y-6">
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
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-surface-ink dark:text-surface-snow border-b border-surface-fog dark:border-surface-slate/30 pb-2">
            Preferências de Privacidade
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 border border-surface-fog dark:border-surface-slate/30 rounded-xl cursor-pointer hover:bg-surface-snow dark:hover:bg-surface-ink transition-colors">
              <input type="checkbox" className="mt-1 accent-primary" defaultChecked />
              <div>
                <div className="font-semibold text-surface-ink dark:text-surface-snow text-sm flex items-center gap-2">
                  <Shield size={16} className="text-primary" /> Exigir 2FA para todos os membros
                </div>
                <p className="text-xs text-surface-slate dark:text-surface-fog mt-1">Adiciona uma camada extra de segurança no login da sua equipe.</p>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-surface-fog dark:border-surface-slate/30 flex justify-end">
          <button className="btn-primary">
            <Save size={16} />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  )
}
