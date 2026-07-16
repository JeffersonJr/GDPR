import { BarChart3, Download, TrendingUp, ShieldAlert, Users } from 'lucide-react'

export const metadata = {
  title: 'Relatórios | E-Compliance',
}

export default function ReportsPage() {
  return (
    <div className="page-section space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-ink dark:text-surface-snow flex items-center gap-2">
            <BarChart3 className="text-primary" size={24} />
            Relatórios e Analytics
          </h1>
          <p className="text-sm text-surface-slate dark:text-surface-fog mt-1">
            Visão detalhada sobre a conformidade, riscos e atividades recentes.
          </p>
        </div>
        
        <button className="btn-secondary">
          <Download size={16} />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-surface-slate dark:text-surface-fog mb-2">
            <TrendingUp size={18} />
            <span className="text-sm font-medium">Evolução do Score</span>
          </div>
          <div className="text-3xl font-bold text-surface-ink dark:text-surface-snow">84%</div>
          <div className="text-xs text-success-600 dark:text-success-500 font-medium">+12% desde o último mês</div>
        </div>

        <div className="glass-card p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-surface-slate dark:text-surface-fog mb-2">
            <ShieldAlert size={18} />
            <span className="text-sm font-medium">Riscos Pendentes</span>
          </div>
          <div className="text-3xl font-bold text-warning-600 dark:text-warning-500">3</div>
          <div className="text-xs text-surface-slate dark:text-surface-fog font-medium">Requer atenção imediata</div>
        </div>

        <div className="glass-card p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-surface-slate dark:text-surface-fog mb-2">
            <Users size={18} />
            <span className="text-sm font-medium">Acessos da Equipe</span>
          </div>
          <div className="text-3xl font-bold text-surface-ink dark:text-surface-snow">128</div>
          <div className="text-xs text-surface-slate dark:text-surface-fog font-medium">Visualizações nesta semana</div>
        </div>
      </div>

      <div className="glass-card p-8 min-h-[400px] flex items-center justify-center flex-col text-center">
        <BarChart3 size={48} className="text-surface-slate/30 dark:text-surface-fog/30 mb-4" />
        <h3 className="text-lg font-semibold text-surface-ink dark:text-surface-snow">Gráficos Detalhados em Breve</h3>
        <p className="text-sm text-surface-slate dark:text-surface-fog max-w-md mt-2">
          Estamos integrando gráficos dinâmicos para mapeamento temporal de conformidade, relatórios DPO personalizados e logs de acesso detalhados.
        </p>
      </div>
    </div>
  )
}
