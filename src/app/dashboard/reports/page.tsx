import { BarChart3, Download, TrendingUp, ShieldAlert, Users } from 'lucide-react'
import Link from 'next/link'

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

        <Link href="/dashboard/documents?status=pending" className="glass-card-hover p-6 flex flex-col gap-2 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-surface-slate dark:text-surface-fog mb-2 group-hover:text-warning-600 dark:group-hover:text-warning-500 transition-colors">
              <ShieldAlert size={18} />
              <span className="text-sm font-medium">Riscos Pendentes</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-warning-600 dark:text-warning-500">3</div>
          <div className="text-xs text-surface-slate dark:text-surface-fog font-medium">Requer atenção imediata</div>
        </Link>

        <div className="glass-card p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-surface-slate dark:text-surface-fog mb-2">
            <Users size={18} />
            <span className="text-sm font-medium">Acessos da Equipe</span>
          </div>
          <div className="text-3xl font-bold text-surface-ink dark:text-surface-snow">128</div>
          <div className="text-xs text-surface-slate dark:text-surface-fog font-medium">Visualizações nesta semana</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 min-h-[300px] flex items-center justify-center flex-col text-center">
          <BarChart3 size={48} className="text-surface-slate/30 dark:text-surface-fog/30 mb-4" />
          <h3 className="text-lg font-semibold text-surface-ink dark:text-surface-snow">Gráficos Detalhados em Breve</h3>
          <p className="text-sm text-surface-slate dark:text-surface-fog max-w-md mt-2">
            Estamos integrando gráficos dinâmicos para mapeamento temporal de conformidade, relatórios DPO personalizados e logs de acesso detalhados.
          </p>
        </div>

        <div className="glass-card p-6 flex flex-col">
          <h3 className="font-semibold text-surface-ink dark:text-surface-snow mb-4 flex items-center gap-2">
            <ShieldAlert className="text-warning-500" size={18} />
            Detalhamento de Riscos
          </h3>
          
          <div className="space-y-4 flex-1">
            {[
              { title: 'Política de Cookies', desc: 'Aviso de consentimento ausente na home', severity: 'Alto' },
              { title: 'DPA - Fornecedores', desc: 'Cláusula de auditoria não assinada', severity: 'Médio' },
              { title: 'Registro de Atividades', desc: 'Faltam bases legais (Art. 6)', severity: 'Alto' },
            ].map((risk, i) => (
              <div key={i} className="p-3 bg-surface-snow dark:bg-surface-ink border border-surface-fog dark:border-surface-slate/20 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-semibold text-surface-ink dark:text-surface-snow">{risk.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    risk.severity === 'Alto' 
                      ? 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-500' 
                      : 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500'
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-xs text-surface-slate dark:text-surface-fog">{risk.desc}</p>
              </div>
            ))}
          </div>
          
          <Link href="/dashboard/documents?status=pending" className="mt-4 text-xs font-medium text-primary hover:text-primary-hover dark:text-primary-light dark:hover:text-white w-full text-center py-2 bg-primary-light/30 dark:bg-primary/10 rounded-lg transition-colors block">
            Ver Todos os Riscos
          </Link>
        </div>
      </div>
    </div>
  )
}
