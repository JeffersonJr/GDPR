'use client'

import { Users, UserPlus, Shield, MoreVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@empresa.com', role: 'DPO', status: 'Ativo' },
    { id: 2, name: 'Bob Johnson', email: 'bob@empresa.com', role: 'Administrador', status: 'Ativo' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@empresa.com', role: 'Membro', status: 'Pendente' },
  ])

  const handleRoleChange = (id: number, newRole: string) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m))
    toast.success('Permissão alterada com sucesso!')
  }

  const handleRemove = (id: number) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id))
    toast.success('Membro removido da organização.')
  }

  const handleInvite = () => {
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
        
        <button onClick={handleInvite} className="btn-primary">
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
                    <button 
                      onClick={() => handleRemove(member.id)}
                      className="p-2 text-surface-slate hover:text-danger-600 dark:text-surface-fog dark:hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 rounded-lg transition-colors"
                      title="Remover usuário"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
