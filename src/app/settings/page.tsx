'use client'

import { Settings, Save, Building, Mail, Shield, KeyRound, User, Download, Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Configurações salvas com sucesso!')
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Senha alterada com sucesso! Você receberá um email de confirmação.')
  }

  const handleExportData = (method: 'download' | 'email') => {
    setShowExportModal(false)
    if (method === 'download') {
      const data = {
        user: {
          name: "DPO User",
          email: "dpo@empresa.com",
          role: "DPO",
          settings: { notifications: true, twoFactor: true }
        },
        exportDate: new Date().toISOString(),
        compliance: {
          gdprArticle: 20,
          description: "Data portability export"
        }
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'gdpr_export_data.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Download do arquivo (JSON) iniciado com sucesso.')
    } else {
      toast.success('Um link para download seguro dos seus dados foi enviado para dpo@empresa.com.')
    }
  }

  const handleSubmitAudit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const auditorEmail = formData.get('auditorEmail') as string
    const scope = formData.get('scope') as string
    const notes = formData.get('notes') as string
    
    const activationLink = `https://e-compliance.com/invite?token=${Math.random().toString(36).substr(2, 9)}&role=auditor`
    
    const subject = encodeURIComponent(`Convite para Auditoria Externa: ${scope}`)
    const body = encodeURIComponent(`Olá,\n\nGostaria de solicitar uma auditoria externa com o seguinte escopo: ${scope}.\n\nPara acessar nosso ambiente e revisar nossas configurações e documentos, por favor utilize o link de acesso exclusivo abaixo (ele concederá acesso de Auditor à nossa conta):\n${activationLink}\n\nObservações Adicionais:\n${notes}\n\nAguardo retorno para os próximos passos.\n\nAtenciosamente,`)
    
    window.location.href = `mailto:${auditorEmail}?subject=${subject}&body=${body}`
    
    setShowAuditModal(false)
    toast.success('Seu cliente de e-mail foi aberto com a solicitação!')
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
              <button 
                onClick={() => setShowExportModal(true)}
                className="w-full text-left px-4 py-3 rounded-xl border border-surface-fog dark:border-surface-slate/30 hover:bg-surface-snow dark:hover:bg-surface-slate/10 text-sm font-medium transition-colors text-surface-ink dark:text-surface-snow"
              >
                Exportar meus dados (Art. 20 GDPR)
              </button>
              <button 
                onClick={() => setShowAuditModal(true)}
                className="w-full text-left px-4 py-3 rounded-xl border border-surface-fog dark:border-surface-slate/30 hover:bg-surface-snow dark:hover:bg-surface-slate/10 text-sm font-medium transition-colors text-surface-ink dark:text-surface-snow"
              >
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

      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-ink/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-surface-ink w-full max-w-md rounded-2xl shadow-2xl border border-surface-fog dark:border-surface-slate/20 overflow-hidden">
            <div className="p-6 border-b border-surface-fog dark:border-surface-slate/20 flex items-center justify-between">
              <h2 className="text-xl font-bold text-surface-ink dark:text-surface-snow flex items-center gap-2">
                <Shield size={20} className="text-primary" />
                Solicitar Auditoria
              </h2>
            </div>
            
            <form onSubmit={handleSubmitAudit} className="p-6 space-y-4">
              <p className="text-sm text-surface-slate dark:text-surface-fog mb-4">
                Solicite uma revisão especializada. Um convite será enviado com um link para o auditor acessar sua conta temporariamente.
              </p>

              <div>
                <label className="input-label">E-mail do Auditor</label>
                <input name="auditorEmail" type="email" className="input-field" placeholder="auditor@consultoria.com" required />
              </div>

              <div>
                <label className="input-label">Escopo da Auditoria</label>
                <select name="scope" className="input-field" required>
                  <option value="Auditoria Completa (GDPR/LGPD)">Auditoria Completa (GDPR/LGPD)</option>
                  <option value="Apenas Revisão de Documentos">Apenas Revisão de Documentos</option>
                  <option value="Auditoria de Segurança / Infraestrutura">Auditoria de Segurança / Infraestrutura</option>
                </select>
              </div>
              
              <div>
                <label className="input-label">Observações Adicionais (Opcional)</label>
                <textarea name="notes" className="input-field min-h-[100px]" placeholder="Descreva áreas de maior preocupação..."></textarea>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAuditModal(false)} className="btn-ghost">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Enviar E-mail de Solicitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-ink/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-surface-ink w-full max-w-sm rounded-2xl shadow-2xl border border-surface-fog dark:border-surface-slate/20 overflow-hidden text-center p-6">
            <h2 className="text-xl font-bold text-surface-ink dark:text-surface-snow mb-2">
              Exportar Dados
            </h2>
            <p className="text-sm text-surface-slate dark:text-surface-fog mb-6">
              Como você prefere receber o arquivo JSON contendo todos os seus dados estruturados?
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleExportData('download')} 
                className="w-full btn-primary flex items-center justify-center gap-2 py-3"
              >
                <Download size={18} />
                Baixar para o Computador
              </button>
              
              <button 
                onClick={() => handleExportData('email')} 
                className="w-full btn-secondary flex items-center justify-center gap-2 py-3 border border-surface-fog dark:border-surface-slate/30"
              >
                <Send size={18} />
                Receber por E-mail
              </button>
              
              <button 
                onClick={() => setShowExportModal(false)} 
                className="w-full mt-2 text-sm text-surface-slate hover:text-surface-ink dark:text-surface-fog dark:hover:text-surface-snow py-2"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
