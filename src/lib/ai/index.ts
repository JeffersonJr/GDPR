import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import { GDPR_AUDITOR_SYSTEM_PROMPT, getGenerateDocumentPrompt } from './prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ---- Zod Schema for Audit Result ----
const auditIssueSchema = z.object({
  type: z.enum(['missing_clause', 'abusive_term', 'security_risk', 'unclear_language']),
  description: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  suggestion: z.string(),
})

const auditResponseSchema = z.object({
  complianceScore: z.number().min(0).max(100),
  issues: z.array(auditIssueSchema),
  improvedText: z.string().describe("O texto completo reescrito em Markdown, consertando os problemas."),
})

export type AuditResult = z.infer<typeof auditResponseSchema>
export type AuditIssue = z.infer<typeof auditIssueSchema>

// ---- AI Functions ----

/**
 * Generate a new GDPR document from scratch based on org context.
 */
export async function generateDocumentAi(context: {
  documentType: string;
  niche: string;
  size: string;
  country: string;
  dataVolume: string;
  processesSpecialCategories: boolean;
  hasEuPresence: boolean;
}): Promise<string> {
  const prompt = getGenerateDocumentPrompt(context)

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // fast, cheap, and very capable
    messages: [
      { role: 'system', content: prompt }
    ],
    temperature: 0.7,
  })

  return response.choices[0].message.content || ''
}

/**
 * Audit an existing document and return structured analysis + improved text.
 */
export async function auditDocumentAi(text: string, documentType: string): Promise<AuditResult> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o', // using gpt-4o for better reasoning in audits
    messages: [
      { role: 'system', content: GDPR_AUDITOR_SYSTEM_PROMPT },
      { role: 'user', content: `Por favor, audite o seguinte documento (${documentType}):\n\n${text}` }
    ],
    temperature: 0.2,
    response_format: zodResponseFormat(auditResponseSchema, "audit_result"),
  })

  const content = response.choices[0].message.content
  if (!content) {
    throw new Error('No response from AI')
  }

  return JSON.parse(content) as AuditResult
}
