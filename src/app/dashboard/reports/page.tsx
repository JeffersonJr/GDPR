'use client'

import { useState } from 'react'
import { BarChart3, Download, TrendingUp, ShieldAlert, Users, X } from 'lucide-react'
import Link from 'next/link'

export default function ReportsPage() {
  const [showRisksModal, setShowRisksModal] = useState(false)

  const handleExportPDF = () => {
    window.print()
  }

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
        
        <button onClick={handleExportPDF} className="btn-secondary">
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

        <div onClick={() => setShowRisksModal(true)} className="glass-card-hover p-6 flex flex-col gap-2 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-surface-slate dark:text-surface-fog mb-2 group-hover:text-warning-600 dark:group-hover:text-warning-500 transition-colors">
              <ShieldAlert size={18} />
              <span className="text-sm font-medium">Riscos Pendentes</span>
            </div>
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
          
          <button onClick={() => setShowRisksModal(true)} className="mt-4 text-xs font-medium text-primary hover:text-primary-hover dark:text-primary-light dark:hover:text-white w-full text-center py-2 bg-primary-light/30 dark:bg-primary/10 rounded-lg transition-colors block">
            Ver Todos os Riscos
          </button>
        </div>
      </div>

      {showRisksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-ink/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-surface-ink w-full max-w-2xl rounded-2xl shadow-2xl border border-surface-fog dark:border-surface-slate/20 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-surface-fog dark:border-surface-slate/20 flex items-center justify-between">
              <h2 className="text-xl font-bold text-surface-ink dark:text-surface-snow flex items-center gap-2">
                <ShieldAlert className="text-warning-500" />
                Todos os Riscos Pendentes
              </h2>
              <button onClick={() => setShowRisksModal(false)} className="text-surface-slate hover:text-surface-ink dark:text-surface-fog dark:hover:text-surface-snow transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {[
                { title: 'Política de Cookies', desc: 'Aviso de consentimento ausente na home. Risco de multa por não cumprimento do ePrivacy Directive.', severity: 'Alto', action: 'Gerar Política de Cookies', href: '/dashboard/documents/generate' },
                { title: 'DPA - Fornecedores', desc: 'Cláusula de auditoria não assinada com provedor de nuvem principal (AWS).', severity: 'Médio', action: 'Revisar DPA', href: '/dashboard/documents/upload' },
                { title: 'Registro de Atividades', desc: 'Faltam bases legais (Art. 6) documentadas para a coleta de dados de marketing.', severity: 'Alto', action: 'Preencher RoPA', href: '/dashboard/documents/generate' },
                { title: 'Termos de Uso', desc: 'Seção de foro aplicável desatualizada em relação à nova diretiva de defesa do consumidor.', severity: 'Baixo', action: 'Atualizar Termos', href: '/dashboard/documents/upload' },
                { title: 'Notificação de Violação', desc: 'Não há procedimento documentado para notificação de incidentes em até 72h.', severity: 'Médio', action: 'Criar Procedimento', href: '/dashboard/documents/generate' },
              ].map((risk, i) => (
                <div key={i} className="p-4 bg-surface-snow dark:bg-surface-slate/10 border border-surface-fog dark:border-surface-slate/20 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-surface-ink dark:text-surface-snow">{risk.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        risk.severity === 'Alto' ? 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-500' :
                        risk.severity === 'Médio' ? 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500' :
                        'bg-surface-fog text-surface-slate dark:bg-surface-slate/30 dark:text-surface-fog'
                      }`}>
                        {risk.severity}
                      </span>
                    </div>
                    <p className="text-sm text-surface-slate dark:text-surface-fog max-w-lg">{risk.desc}</p>
                  </div>
                  <Link href={risk.href} className="btn-secondary whitespace-nowrap text-xs shrink-0 py-1.5 px-3">
                    {risk.action}
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-surface-fog dark:border-surface-slate/20 flex justify-end bg-surface-snow dark:bg-surface-slate/5">
              <button onClick={() => setShowRisksModal(false)} className="btn-primary">
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
