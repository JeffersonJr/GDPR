'use client'

import { Users, UserPlus, Shield, MoreVertical, Trash2, Settings, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@empresa.com', role: 'DPO', status: 'Ativo' },
    { id: 2, name: 'Bob Johnson', email: 'bob@empresa.com', role: 'Administrador', status: 'Ativo' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@empresa.com', role: 'Membro', status: 'Pendente' },
  ])

  const [showInviteModal, setShowInviteModal] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)
  const [memberToDelete, setMemberToDelete] = useState<any>(null)

  const handleRoleChange = (id: number, newRole: string) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m))
    toast.success('Permissão alterada com sucesso!')
  }

  const handleInviteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newMember = {
      id: Date.now(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      status: 'Pendente'
    }
    
    setTeamMembers(prev => [...prev, newMember])
    setShowInviteModal(false)
    toast.success('Convite enviado com sucesso para o novo membro!')
  }

  return (
    <div className="max-w-5xl space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-ink dark:text-surface-snow flex items-center gap-2">
            <Users className="text-primary" size={24} />
            Gestão de Equipe
          </h1>
          <p className="text-sm text-surface-slate dark:text-surface-fog mt-1">
            Convide colegas e gerencie permissões de acesso à plataforma.
          </p>
        </div>
        
        <button onClick={() => setShowInviteModal(true)} className="btn-primary">
          <UserPlus size={16} />
          Convidar Membro
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-surface-slate dark:text-surface-fog">
            <thead className="text-xs uppercase bg-surface-snow dark:bg-surface-ink border-b border-surface-fog dark:border-surface-slate/30 text-surface-ink dark:text-surface-snow">
              <tr>
                <th scope="col" className="px-6 py-4">Usuário</th>
                <th scope="col" className="px-6 py-4">Permissão</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b border-surface-fog dark:border-surface-slate/10 hover:bg-surface-snow dark:hover:bg-surface-ink/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-light text-primary dark:bg-primary/20 flex items-center justify-center font-bold text-xs shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-surface-ink dark:text-surface-snow">{member.name}</div>
                        <div className="text-xs text-surface-slate dark:text-surface-fog">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {member.role === 'DPO' && <Shield size={14} className="text-secondary shrink-0" />}
                      <select 
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="bg-transparent border border-surface-fog dark:border-surface-slate/30 rounded-lg text-sm px-2 py-1 outline-none focus:border-primary text-surface-ink dark:text-surface-snow"
                      >
                        <option value="DPO">DPO</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Membro">Membro</option>
                        <option value="Visualizador">Visualizador</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${
                      member.status === 'Ativo' 
                        ? 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500' 
                        : 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <details className="relative group">
                        <summary className="p-2 text-surface-slate hover:text-surface-ink dark:text-surface-fog dark:hover:text-surface-snow hover:bg-surface-snow dark:hover:bg-surface-slate/20 rounded-lg transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden focus:outline-none">
                          <MoreVertical size={16} />
                        </summary>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-ink border border-surface-fog dark:border-surface-slate/30 rounded-xl shadow-xl z-10 py-1 text-left hidden group-open:block animate-in fade-in zoom-in-95">
                          <button 
                            onClick={(e) => {
                              const details = e.currentTarget.closest('details')
                              if (details) details.removeAttribute('open')
                              setEditingMember(member)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-surface-ink dark:text-surface-snow hover:bg-surface-snow dark:hover:bg-surface-slate/10 transition-colors flex items-center gap-2"
                          >
                            <Settings size={14} />
                            Configurações
                          </button>
                          <button 
                            onClick={(e) => {
                              const details = e.currentTarget.closest('details')
                              if (details) details.removeAttribute('open')
                              setMemberToDelete(member)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-danger-600 dark:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors flex items-center gap-2"
                          >
                            <Trash2 size={14} />
                            Remover
                          </button>
                        </div>
                      </details>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-ink/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-surface-ink w-full max-w-md rounded-2xl shadow-2xl border border-surface-fog dark:border-surface-slate/20 overflow-hidden">
            <div className="p-6 border-b border-surface-fog dark:border-surface-slate/20 flex items-center justify-between">
              <h2 className="text-xl font-bold text-surface-ink dark:text-surface-snow flex items-center gap-2">
                <UserPlus size={20} className="text-primary" />
                Convidar Membro
              </h2>
            </div>
            
            <form onSubmit={handleInviteSubmit} className="p-6 space-y-4">
              <div>
                <label className="input-label">Nome Completo</label>
                <input name="name" type="text" className="input-field" placeholder="Ex: João Silva" required />
              </div>
              
              <div>
                <label className="input-label">E-mail Profissional</label>
                <input name="email" type="email" className="input-field" placeholder="joao@empresa.com" required />
              </div>

              <div>
                <label className="input-label">Telefone (Opcional)</label>
                <input name="phone" type="tel" className="input-field" placeholder="(00) 00000-0000" />
              </div>

              <div>
                <label className="input-label">Permissão</label>
                <select name="role" className="input-field" required defaultValue="Membro">
                  <option value="Administrador">Administrador (Acesso total)</option>
                  <option value="DPO">DPO (Focado em conformidade)</option>
                  <option value="Membro">Membro (Edição de documentos)</option>
                  <option value="Visualizador">Visualizador (Apenas leitura)</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowInviteModal(false)} className="btn-ghost">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Enviar Convite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-ink/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-surface-ink w-full max-w-md rounded-2xl shadow-2xl border border-surface-fog dark:border-surface-slate/20 overflow-hidden">
            <div className="p-6 border-b border-surface-fog dark:border-surface-slate/20 flex items-center justify-between">
              <h2 className="text-xl font-bold text-surface-ink dark:text-surface-snow flex items-center gap-2">
                <Settings size={20} className="text-primary" />
                Configurações do Usuário
              </h2>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              setTeamMembers(prev => prev.map(m => m.id === editingMember.id ? {
                ...m,
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                role: formData.get('role') as string,
              } : m))
              setEditingMember(null)
              toast.success('Configurações salvas com sucesso!')
            }} className="p-6 space-y-4">
              <div>
                <label className="input-label">Nome Completo</label>
                <input name="name" type="text" className="input-field" defaultValue={editingMember.name} required />
              </div>
              
              <div>
                <label className="input-label">E-mail Profissional</label>
                <input name="email" type="email" className="input-field" defaultValue={editingMember.email} required />
              </div>

              <div>
                <label className="input-label">Telefone (Opcional)</label>
                <input name="phone" type="tel" className="input-field" placeholder="(00) 00000-0000" />
              </div>
              
              <div>
                <label className="input-label">Nova Senha</label>
                <input name="password" type="password" className="input-field" placeholder="Deixe em branco para não alterar" />
              </div>

              <div>
                <label className="input-label">Permissão</label>
                <select name="role" className="input-field" required defaultValue={editingMember.role}>
                  <option value="Administrador">Administrador (Acesso total)</option>
                  <option value="DPO">DPO (Focado em conformidade)</option>
                  <option value="Membro">Membro (Edição de documentos)</option>
                  <option value="Visualizador">Visualizador (Apenas leitura)</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingMember(null)} className="btn-ghost">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-ink/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-surface-ink w-full max-w-sm rounded-2xl shadow-2xl border border-surface-fog dark:border-surface-slate/20 overflow-hidden text-center p-6">
            <div className="w-12 h-12 rounded-full bg-danger-50 dark:bg-danger-500/10 text-danger-600 dark:text-danger-500 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-surface-ink dark:text-surface-snow mb-2">Remover Usuário</h3>
            <p className="text-sm text-surface-slate dark:text-surface-fog mb-6">
              Tem certeza que deseja remover <strong>{memberToDelete.name}</strong> da organização? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setMemberToDelete(null)} className="btn-secondary flex-1 justify-center">
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setTeamMembers(prev => prev.filter(m => m.id !== memberToDelete.id))
                  setMemberToDelete(null)
                  toast.success('Usuário removido com sucesso.')
                }} 
                className="btn-primary bg-danger-600 hover:bg-danger-700 dark:bg-danger-600 dark:hover:bg-danger-700 text-white flex-1 border-none shadow-glow-danger justify-center"
              >
                Sim, remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
