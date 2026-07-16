import { Bell, CheckCircle2, ShieldAlert, FileText, Check } from 'lucide-react'
import { clsx } from 'clsx'

export const metadata = {
  title: 'Notificações | E-Compliance',
}

const notifications = [
  {
    id: 1,
    type: 'success',
    title: 'Documento Auditado com Sucesso',
    message: 'A Política de Privacidade v2.0 teve sua auditoria concluída (Score: 84%).',
    time: 'Há 10 minutos',
    read: false,
    icon: CheckCircle2,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Atenção Necessária',
    message: 'Foram encontrados 3 riscos pendentes no último documento processado.',
    time: 'Há 2 horas',
    read: false,
    icon: ShieldAlert,
  },
  {
    id: 3,
    type: 'info',
    title: 'Novo Documento Gerado',
    message: 'O DPA foi gerado e salvo na sua lista de documentos.',
    time: 'Ontem',
    read: true,
    icon: FileText,
  },
]

export default function NotificationsPage() {
  return (
    <div className="page-section max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-ink dark:text-surface-snow flex items-center gap-2">
            <Bell className="text-primary" size={24} />
            Notificações
          </h1>
          <p className="text-sm text-surface-slate dark:text-surface-fog mt-1">
            Fique por dentro das atualizações e alertas de compliance.
          </p>
        </div>
        
        <button className="btn-ghost text-sm">
          <Check size={16} />
          Marcar todas como lidas
        </button>
      </div>

      <div className="space-y-4 mt-6">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className={clsx(
              "glass-card p-5 flex items-start gap-4 transition-colors",
              !notif.read && "bg-primary-light/30 dark:bg-primary/5 border-primary/20"
            )}
          >
            <div className={clsx(
              "p-2 rounded-full shrink-0",
              notif.type === 'success' ? "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500" :
              notif.type === 'warning' ? "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500" :
              "bg-primary-light text-primary dark:bg-primary/10"
            )}>
              <notif.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className={clsx("font-semibold text-sm", !notif.read ? "text-surface-ink dark:text-surface-snow" : "text-surface-slate dark:text-surface-fog")}>
                  {notif.title}
                </h3>
                <span className="text-xs text-surface-slate dark:text-surface-fog whitespace-nowrap">{notif.time}</span>
              </div>
              <p className="text-sm text-surface-slate dark:text-surface-fog">{notif.message}</p>
            </div>
            {!notif.read && (
              <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0 shadow-glow-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
