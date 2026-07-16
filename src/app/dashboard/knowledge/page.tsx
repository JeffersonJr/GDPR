import { BookOpen, Search, FileText, ChevronRight, Scale } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Base de Conhecimento | E-Compliance',
}

const articles = [
  { id: 1, title: 'O que é a GDPR e a quem se aplica?', category: 'Introdução' },
  { id: 2, title: 'Princípios fundamentais do processamento de dados', category: 'Conceitos' },
  { id: 3, title: 'Direitos dos titulares dos dados (Art. 12-23)', category: 'Direitos' },
  { id: 4, title: 'Como elaborar uma Política de Privacidade aderente', category: 'Guias Práticos' },
  { id: 5, title: 'Obrigações dos Processadores (Data Processing Agreement)', category: 'Guias Práticos' },
  { id: 6, title: 'Notificação de violação de dados (Data Breach)', category: 'Segurança' },
]

export default function KnowledgeBasePage() {
  return (
    <div className="page-section max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4 max-w-2xl mx-auto py-8">
        <div className="w-16 h-16 bg-primary-light dark:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="text-primary" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-surface-ink dark:text-surface-snow">
          Base de Conhecimento
        </h1>
        <p className="text-surface-slate dark:text-surface-fog">
          Entenda os meandros jurídicos da GDPR. Guias, artigos e conceitos chave para manter sua organização em total conformidade.
        </p>
        
        <div className="relative max-w-md mx-auto mt-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-slate dark:text-surface-fog" />
          <input
            type="search"
            placeholder="Buscar na base de conhecimento..."
            className="input-field pl-11 py-3"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Link href={`/dashboard/knowledge/${article.id}`} key={article.id} className="glass-card-hover p-5 flex items-start gap-4 cursor-pointer group">
            <div className="p-3 bg-surface-cream dark:bg-surface-ink rounded-lg border border-surface-fog dark:border-surface-slate/20">
              <Scale size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-secondary mb-1 uppercase tracking-wider">{article.category}</div>
              <h3 className="font-semibold text-surface-ink dark:text-surface-snow mb-1 truncate">{article.title}</h3>
              <p className="text-sm text-surface-slate dark:text-surface-fog line-clamp-2">
                Descubra os requisitos essenciais e as melhores práticas recomendadas por especialistas em privacidade.
              </p>
            </div>
            <ChevronRight size={18} className="text-surface-slate/40 group-hover:text-primary transition-colors mt-4 shrink-0" />
          </Link>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-primary-light/50 dark:bg-primary/10 border border-primary/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-semibold text-surface-ink dark:text-surface-snow mb-1">Não encontrou o que procurava?</h4>
          <p className="text-sm text-surface-slate dark:text-surface-fog">Nossa IA também atua como consultora. Gere um novo documento e faça perguntas específicas.</p>
        </div>
        <Link href="/dashboard/documents/generate" className="btn-primary shrink-0">
          <FileText size={16} />
          Gerar Novo Documento
        </Link>
      </div>
    </div>
  )
}
