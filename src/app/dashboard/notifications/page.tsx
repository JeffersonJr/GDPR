'use client'

import { Bell, ShieldAlert, CheckCircle2, Clock, AlertTriangle, MessageSquare, MoreVertical, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { clsx } from 'clsx'

const initialNotifications = [
  {
    id: 1,
    title: '3 Riscos Pendentes Detectados',
    description: 'Nossa varredura semanal identificou 3 riscos de conformidade que precisam da sua atenção, incluindo a Política de Cookies e o DPA com fornecedores.',
    date: 'Há 2 horas',
    type: 'risk',
    read: false,
  },
  {
    id: 2,
    title: 'Auditoria Concluída',
    description: 'A auditoria automática na sua Política de Privacidade foi concluída. Aderência atual: 84%. Faltam detalhes sobre período de retenção de dados.',
    date: 'Ontem',
    type: 'success',
    read: false,
  },
  {
    id: 3,
    title: 'Novo Processador Adicionado',
    description: 'Um novo processador de dados (AWS) foi detectado nas configurações. Recomendamos a geração de um DPA para cobrir a transferência de dados.',
    date: 'Há 2 dias',
    type: 'warning',
    read: true,
  },
  {
    id: 4,
    title: 'Relatório Mensal Disponível',
    description: 'Seu relatório de conformidade do mês de Junho já está disponível para download na aba Relatórios.',
    date: 'Há 4 dias',
    type: 'info',
    read: true,
  },
  {
    id: 5,
    title: 'Aviso de Atualização (Art. 13)',
    description: 'As orientações da EDPB sobre transparência de dados foram atualizadas. Recomendamos revisar seus termos de uso.',
    date: 'Semana passada',
    type: 'warning',
    read: true,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('Todas as notificações marcadas como lidas.')
  }

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const getIcon = (type: string) => {
    switch(type) {
      case 'risk': return <ShieldAlert size={18} />
      case 'success': return <CheckCircle2 size={18} />
      case 'warning': return <AlertTriangle size={18} />
      case 'info': return <Clock size={18} />
      default: return <MessageSquare size={18} />
    }
  }

  const getColorClass = (type: string) => {
    switch(type) {
      case 'risk': return 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-500'
      case 'success': return 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500'
      case 'warning': return 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500'
      case 'info': return 'bg-primary-light text-primary dark:bg-primary/20'
      default: return 'bg-surface-fog text-surface-slate dark:bg-surface-slate/20 dark:text-surface-fog'
    }
  }

  return (
    <div className="page-section max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-ink dark:text-surface-snow flex items-center gap-2">
            <Bell className="text-primary" size={24} />
            Notificações
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-500 text-xs font-bold">
                {unreadCount} novas
              </span>
            )}
          </h1>
          <p className="text-sm text-surface-slate dark:text-surface-fog mt-1">
            Fique por dentro de alertas de conformidade, riscos e atualizações do sistema.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn-secondary whitespace-nowrap">
            <Check size={16} />
            Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="divide-y divide-surface-fog dark:divide-surface-slate/20">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={clsx(
                "p-4 sm:p-6 transition-colors flex gap-4 sm:gap-6 relative group",
                notif.read ? "bg-surface-snow/50 dark:bg-surface-ink" : "bg-white dark:bg-surface-slate/5"
              )}
            >
              {!notif.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
              )}
              
              <div className={clsx("w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0", getColorClass(notif.type))}>
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1">
                  <h3 className={clsx(
                    "font-semibold truncate pr-4", 
                    notif.read ? "text-surface-slate dark:text-surface-snow" : "text-surface-ink dark:text-white"
                  )}>
                    {notif.title}
                  </h3>
                  <span className="text-xs font-medium text-surface-slate dark:text-surface-fog shrink-0">
                    {notif.date}
                  </span>
                </div>
                
                <p className={clsx(
                  "text-sm leading-relaxed",
                  notif.read ? "text-surface-slate/80 dark:text-surface-fog/80" : "text-surface-slate dark:text-surface-fog"
                )}>
                  {notif.description}
                </p>
                
                {!notif.read && (
                  <button 
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="mt-3 text-xs font-semibold text-primary hover:text-primary-hover dark:text-primary-light transition-colors"
                  >
                    Marcar como lida
                  </button>
                )}
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4 sm:relative sm:right-auto sm:top-auto">
                <button className="p-2 text-surface-slate hover:text-surface-ink dark:text-surface-fog dark:hover:text-surface-snow bg-surface-snow dark:bg-surface-slate/20 rounded-lg transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
