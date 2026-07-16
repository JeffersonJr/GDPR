import { ChevronLeft, Scale, Clock, User } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Artigo | Base de Conhecimento | E-Compliance',
}

const articlesData: Record<string, { title: string; category: string; content: string; readTime: string; author: string; date: string }> = {
  '1': {
    title: 'O que é a GDPR e a quem se aplica?',
    category: 'Introdução',
    readTime: '5 min',
    author: 'Equipe E-Compliance',
    date: '10 de Julho, 2026',
    content: `
A **General Data Protection Regulation (GDPR)**, ou Regulamento Geral sobre a Proteção de Dados (RGPD), é a lei de privacidade e segurança mais rigorosa do mundo. Embora tenha sido elaborada e aprovada pela União Europeia (UE), ela impõe obrigações a organizações em qualquer lugar, desde que visem ou coletem dados relacionados a pessoas na UE.

### Escopo Territorial
A GDPR aplica-se a:
- Qualquer empresa com estabelecimento na UE.
- Empresas fora da UE que oferecem bens ou serviços (mesmo gratuitos) a indivíduos na UE.
- Empresas que monitoram o comportamento de indivíduos dentro da UE (ex: cookies de rastreamento).

### Dados Pessoais
Um "dado pessoal" é qualquer informação relacionada a uma pessoa singular identificada ou identificável ("Titular dos Dados"). Isso inclui:
- Nomes, e-mails, endereços, números de identificação.
- Dados de localização, endereços IP, cookies.
- Dados sensíveis (origem racial, opiniões políticas, crenças religiosas, dados biométricos e de saúde), que requerem proteção adicional.

### Por que se importar?
As multas podem chegar a até **20 milhões de euros** ou **4% da receita global anual** da empresa no ano financeiro anterior, o que for maior.
    `
  },
  '2': {
    title: 'Princípios fundamentais do processamento de dados',
    category: 'Conceitos',
    readTime: '6 min',
    author: 'Comitê Jurídico',
    date: '12 de Julho, 2026',
    content: `
O Artigo 5 da GDPR estabelece 7 princípios chave que devem governar todo o processamento de dados. 

1. **Licitude, lealdade e transparência**: O processamento deve ter base legal clara, ser justo e o titular deve ser informado de forma clara.
2. **Limitação das finalidades**: Dados só podem ser coletados para propósitos específicos e explícitos.
3. **Minimização de dados**: Colete apenas o que for estritamente necessário para o seu propósito.
4. **Exatidão**: Mantenha os dados precisos e atualizados.
5. **Limitação da conservação**: Não armazene dados por mais tempo do que o necessário.
6. **Integridade e confidencialidade**: Garanta a segurança dos dados contra acessos não autorizados e perda acidental.
7. **Responsabilidade (Accountability)**: O Controlador dos dados é responsável por demonstrar conformidade com todos os princípios acima (através de documentação, DPAs, auditorias).
    `
  },
  '3': {
    title: 'Direitos dos titulares dos dados (Art. 12-23)',
    category: 'Direitos',
    readTime: '8 min',
    author: 'Departamento de Privacidade',
    date: '15 de Julho, 2026',
    content: `
A GDPR concede aos indivíduos um controle sem precedentes sobre seus dados pessoais. Sua organização deve ter processos para responder a solicitações (geralmente em até 30 dias).

### Os 8 Direitos Essenciais:
1. **Direito de ser informado**: Privacidade clara e transparente (via Política de Privacidade).
2. **Direito de acesso**: Solicitar cópia dos dados que a empresa tem sobre ele.
3. **Direito de retificação**: Corrigir dados incorretos ou incompletos.
4. **Direito ao esquecimento (Apagamento)**: Exigir a exclusão dos dados (com algumas ressalvas legais).
5. **Direito à restrição do processamento**: Bloquear o uso dos dados temporariamente.
6. **Direito à portabilidade dos dados**: Obter dados em formato estruturado (ex: CSV) para levar a outro fornecedor.
7. **Direito de oposição**: Opor-se ao processamento (ex: marketing direto).
8. **Direitos relativos a decisões automatizadas**: Não estar sujeito a decisões baseadas unicamente em processamento automatizado, incluindo definição de perfis (profiling).
    `
  },
  '4': {
    title: 'Como elaborar uma Política de Privacidade aderente',
    category: 'Guias Práticos',
    readTime: '10 min',
    author: 'Equipe E-Compliance',
    date: '02 de Agosto, 2026',
    content: `
A sua Política de Privacidade é a vitrine da conformidade da sua empresa. Sob a GDPR (Artigos 13 e 14), ela deve ser concisa, transparente, inteligível e de fácil acesso.

### O que NÃO fazer:
- Usar jargões legais complexos e intermináveis.
- Esconder a política.
- Ter caixas pré-marcadas para consentimento (Consentimento sob a GDPR exige ação afirmativa).

### O que DEVE constar:
1. **Identidade e contatos** do controlador de dados e do DPO (Encarregado de Proteção de Dados).
2. **Finalidades e Base Legal**: Por que você coleta e qual a base legal (ex: Consentimento, Execução de Contrato, Obrigação Legal, Interesse Legítimo).
3. **Categorias de dados**: Quais dados você coleta.
4. **Destinatários**: Com quem você compartilha os dados (incluindo terceiros).
5. **Transferência Internacional**: Se os dados saem da UE, quais salvaguardas (ex: SCCs - Cláusulas Contratuais Padrão) são usadas.
6. **Período de retenção**: Por quanto tempo os dados serão guardados.
7. **Direitos do Titular**: Listar todos os direitos e como exercê-los.
8. **Direito de revogar consentimento** a qualquer momento.

Você pode usar o gerador do **E-Compliance** para criar uma versão perfeitamente mapeada para o seu negócio!
    `
  },
  '5': {
    title: 'Obrigações dos Processadores (Data Processing Agreement)',
    category: 'Guias Práticos',
    readTime: '7 min',
    author: 'Comitê Jurídico',
    date: '05 de Agosto, 2026',
    content: `
Sempre que um Controlador de dados contrata um serviço de terceiros (Processador) que lida com dados pessoais, a GDPR exige um contrato formal: o **Data Processing Agreement (DPA)**.

Exemplos de Processadores: AWS, Vercel, Mailchimp, Stripe.

### O que o DPA exige do Processador:
- Processar dados **apenas** sob instruções documentadas do Controlador.
- Garantir que as pessoas autorizadas a processar dados se comprometeram à confidencialidade.
- Adotar medidas de segurança técnicas e organizacionais (Artigo 32).
- Não subcontratar outro processador sem autorização prévia por escrito.
- Auxiliar o Controlador a responder solicitações de Direitos dos Titulares.
- Apagar ou devolver todos os dados ao término da prestação de serviços.
- Permitir e contribuir para auditorias feitas pelo Controlador.

Se você oferece um SaaS B2B, você é muito provavelmente um Processador, e precisa oferecer um DPA padrão aos seus clientes (Controladores).
    `
  },
  '6': {
    title: 'Notificação de violação de dados (Data Breach)',
    category: 'Segurança',
    readTime: '4 min',
    author: 'Engenharia de Segurança',
    date: '10 de Agosto, 2026',
    content: `
Uma violação de dados pessoais ocorre quando há quebra de segurança levando à destruição, perda, alteração, divulgação ou acesso não autorizado aos dados pessoais transmitidos, conservados ou sujeitos a qualquer outro tipo de processamento.

### A Regra das 72 Horas
Caso ocorra uma violação que resulte em risco para os direitos e liberdades dos indivíduos, o Controlador deve notificar a autoridade supervisora competente **sem demora justificada e, o mais tardar, em 72 horas** após ter tomado conhecimento do fato.

### Quando notificar os titulares?
Se a violação representar um **alto risco** para os indivíduos (ex: vazamento de senhas não criptografadas, dados financeiros, dados de saúde), os titulares dos dados também devem ser notificados sem demora justificada.

### O que o relatório da violação deve conter:
- Natureza da violação (categorias e número aproximado de pessoas e registros afetados).
- Nome e contato do DPO.
- Consequências prováveis da violação.
- Medidas adotadas ou propostas para reparar a violação e mitigar os efeitos adversos.

*Dica: Ter um plano de resposta a incidentes pré-documentado é essencial para cumprir a janela de 72 horas.*
    `
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const article = articlesData[resolvedParams.id]

  if (!article) {
    notFound()
  }

  // Basic markdown to HTML parse (paragraphs and bold text)
  const formatContent = (text: string) => {
    return text.split('\n\n').map((paragraph, i) => {
      let formatted = paragraph
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br />')
      
      if (formatted.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-bold text-surface-ink dark:text-surface-snow mt-8 mb-4">{formatted.replace('### ', '')}</h3>
      }
      if (formatted.startsWith('- ')) {
        const listItems = formatted.split('<br />').map((item, j) => (
          <li key={j} className="ml-4 mb-2 list-disc" dangerouslySetInnerHTML={{ __html: item.replace('- ', '') }} />
        ))
        return <ul key={i} className="mb-4 text-surface-slate dark:text-surface-fog leading-relaxed">{listItems}</ul>
      }
      if (formatted.startsWith('1. ') || formatted.match(/^\d+\. /)) {
        const listItems = formatted.split('<br />').map((item, j) => (
          <li key={j} className="ml-4 mb-2 list-decimal" dangerouslySetInnerHTML={{ __html: item.replace(/^\d+\. /, '') }} />
        ))
        return <ul key={i} className="mb-4 text-surface-slate dark:text-surface-fog leading-relaxed">{listItems}</ul>
      }
      
      return <p key={i} className="mb-4 text-surface-slate dark:text-surface-fog leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
    })
  }

  return (
    <div className="page-section max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
      <div>
        <Link href="/dashboard/knowledge" className="inline-flex items-center gap-1 text-sm font-medium text-surface-slate hover:text-primary dark:text-surface-fog dark:hover:text-primary-light transition-colors mb-6">
          <ChevronLeft size={16} />
          Voltar para Base de Conhecimento
        </Link>
        
        <div className="flex items-center gap-2 text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
          <Scale size={14} />
          {article.category}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-surface-ink dark:text-surface-snow leading-tight mb-6">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 py-4 border-y border-surface-fog dark:border-surface-slate/30 text-sm text-surface-slate dark:text-surface-fog">
          <div className="flex items-center gap-1.5">
            <User size={16} />
            {article.author}
          </div>
          <div className="w-1 h-1 rounded-full bg-surface-slate/30 dark:bg-surface-fog/30" />
          <div className="flex items-center gap-1.5">
            <Clock size={16} />
            {article.readTime}
          </div>
          <div className="w-1 h-1 rounded-full bg-surface-slate/30 dark:bg-surface-fog/30" />
          <div>{article.date}</div>
        </div>
      </div>

      <article className="prose prose-slate dark:prose-invert max-w-none">
        {formatContent(article.content.trim())}
      </article>
      
      <div className="mt-12 p-6 bg-surface-snow dark:bg-surface-ink border border-surface-fog dark:border-surface-slate/20 rounded-2xl">
        <h4 className="font-semibold text-surface-ink dark:text-surface-snow mb-2">Este artigo foi útil?</h4>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium border border-surface-fog dark:border-surface-slate/30 rounded-lg hover:bg-surface-cream dark:hover:bg-surface-slate/10 transition-colors">👍 Sim</button>
          <button className="px-4 py-2 text-sm font-medium border border-surface-fog dark:border-surface-slate/30 rounded-lg hover:bg-surface-cream dark:hover:bg-surface-slate/10 transition-colors">👎 Não</button>
        </div>
      </div>
    </div>
  )
}
