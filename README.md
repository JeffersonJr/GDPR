# E-Compliance — GDPR Compliance Platform

> **by Evolves** · Plataforma inteligente de adequação à GDPR para empresas europeias

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## 🎯 O que é o E-Compliance?

O E-Compliance é um SaaS que ajuda empresas de diferentes tamanhos e nichos a ficarem 100% adequadas à GDPR através de uma esteira inteligente de análise de risco e conformidade documental.

### Funcionalidades Core
- **Geração por IA**: Cria documentos GDPR do zero (Política de Privacidade, Cookies, Termos de Uso, DPA, ROPA, DPIA)
- **Auditoria por IA**: Analisa documentos existentes (PDF/DOCX/TXT) e gera versões corrigidas
- **Score de Conformidade**: Diagnóstico visual em tempo real com pontuação 0–100
- **Onboarding Adaptativo**: Questionário inteligente que mapeia o perfil de risco da empresa

---

## 🗂️ Estrutura do Projeto

```
/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (fonts, toasts)
│   │   ├── globals.css               # Design system global styles
│   │   ├── page.tsx                  # Root → redirect
│   │   ├── auth/
│   │   │   ├── layout.tsx            # Two-column auth layout
│   │   │   ├── login/page.tsx        # Login com email/senha + OAuth
│   │   │   ├── register/page.tsx     # Cadastro (a criar)
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx (a criar)
│   │   │   └── callback/route.ts     # OAuth PKCE callback
│   │   ├── onboarding/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx              # Wizard 5 etapas
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Sidebar + TopBar shell
│   │   │   ├── page.tsx              # Dashboard principal
│   │   │   ├── documents/
│   │   │   │   ├── page.tsx          # Lista completa de docs
│   │   │   │   ├── [id]/page.tsx     # Visualizador/editor (a criar)
│   │   │   │   ├── generate/page.tsx # Fluxo geração IA (a criar)
│   │   │   │   └── upload/page.tsx   # Upload para auditoria (a criar)
│   │   │   └── reports/
│   │   │       └── page.tsx          # Relatórios (a criar)
│   │   ├── settings/
│   │   │   ├── page.tsx              # Config empresa (a criar)
│   │   │   └── team/page.tsx         # Gestão de usuários (a criar)
│   │   └── api/
│   │       ├── ai/
│   │       │   ├── generate/route.ts  # Gerar documento com IA
│   │       │   └── analyze/route.ts   # Analisar documento existente
│   │       └── documents/
│   │           └── export/route.ts    # Exportar PDF final
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── ComplianceScoreCard.tsx
│   │   │   ├── DocumentsList.tsx
│   │   │   └── QuickActions.tsx
│   │   └── ui/                       # Componentes reutilizáveis (a criar)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server + Service Role client
│   │   │   └── middleware.ts         # Auth session middleware
│   │   └── utils.ts                  # Utilitários gerais
│   ├── types/
│   │   └── index.ts                  # Todos os tipos TypeScript
│   └── middleware.ts                 # Next.js middleware (proteção de rotas)
├── supabase/
│   └── schema.sql                    # ⭐ Schema completo + RLS
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🗄️ Banco de Dados (Supabase)

### Tabelas

| Tabela | Descrição |
|--------|-----------|
| `organizations` | Tenant principal — uma empresa = uma linha |
| `profiles` | Extensão de `auth.users`, vinculada à organização |
| `documents` | Documentos GDPR por organização |
| `document_versions` | Histórico de versões (planos Pro+) |
| `onboarding_responses` | Respostas do questionário inicial |
| `invitations` | Convites de equipe com token único |
| `audit_log` | Trilha de auditoria imutável |

### Triggers Automáticos
- **`handle_new_user`**: Cria profile automaticamente ao registrar
- **`recalculate_org_score`**: Recalcula score ao mudar status de documento
- **`enforce_document_limit`**: Bloqueia criação de docs além do limite do plano

---

## 🚀 Setup Local

### 1. Clonar e instalar
```bash
git clone https://github.com/your-org/GDPR.git
cd GDPR
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.local.example .env.local
# Preencha com suas credenciais do Supabase
```

### 3. Rodar o schema no Supabase
```
Supabase Dashboard → SQL Editor → colar conteúdo de supabase/schema.sql → Run
```

### 4. Iniciar o servidor
```bash
npm run dev
# Acesse http://localhost:3000
```

---

## 📋 Planos

| Feature | Free | Pro | Enterprise |
|---------|------|-----|-----------|
| Documentos/mês | 2 | 20 | Ilimitado |
| Usuários | 1 | 5 | Ilimitado |
| Histórico de versões | ❌ | ✅ | ✅ |
| Exportar relatórios | ❌ | ❌ | ✅ |
| Múltiplas organizações | ❌ | ❌ | ✅ |
| Suporte prioritário | ❌ | ❌ | ✅ |

---

## 🤖 Integração IA (próximas fases)

- **Geração**: `POST /api/ai/generate` — recebe tipo de doc + perfil da org → retorna documento GDPR completo
- **Análise**: `POST /api/ai/analyze` — recebe arquivo + tipo → retorna `AiAnalysis` JSON com score, cláusulas problemáticas e sugestões
- Modelos suportados: OpenAI GPT-4o, Google Gemini 1.5 Pro

---

## 📝 Licença

Proprietário — Evolves © 2026
