import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes safely (handles conflicts)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to Brazilian Portuguese
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  }).format(new Date(date))
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Get document type human-readable label
 */
export function getDocumentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    privacy_policy: 'Política de Privacidade',
    cookie_policy: 'Política de Cookies',
    terms_of_use: 'Termos de Uso',
    dpa: 'Acordo de Processamento (DPA)',
    ropa: 'Registro de Atividades (ROPA)',
    dpia: 'Avaliação de Impacto (DPIA)',
    breach_notification: 'Notificação de Violação',
    consent_form: 'Formulário de Consentimento',
    data_retention_policy: 'Política de Retenção de Dados',
    third_party_processor: 'Processadores Terceiros',
    other: 'Outro',
  }
  return labels[type] ?? type
}

/**
 * Get score color class based on value
 */
export function getScoreColorClass(score: number): string {
  if (score >= 80) return 'text-success-500'
  if (score >= 50) return 'text-warning-500'
  return 'text-danger-500'
}

/**
 * Calculate initial maturity score from onboarding
 */
export function calculateMaturityScore(responses: {
  has_eu_presence: boolean
  has_iso_cert: boolean
  existing_documents: string[]
  processes_special_categories: boolean
  data_volume: string
}): number {
  let score = 20 // Base score

  if (responses.has_iso_cert) score += 25
  if (!responses.processes_special_categories) score += 10
  score += Math.min(responses.existing_documents.length * 8, 40)
  if (responses.has_eu_presence) score -= 5 // Higher scrutiny = lower base

  return Math.min(Math.max(score, 0), 95) // Cap at 95 until all docs compliant
}

/**
 * Determine required documents from onboarding profile
 */
export function determineRequiredDocuments(responses: {
  size: string
  processes_special_categories: boolean
  has_eu_presence: boolean
  data_volume: string
}): string[] {
  const required = [
    'privacy_policy',
    'cookie_policy',
    'terms_of_use',
    'dpa',
    'ropa',
    'data_retention_policy',
  ]

  if (responses.processes_special_categories) {
    required.push('dpia', 'consent_form')
  }

  if (['medium', 'large', 'enterprise'].includes(responses.size)) {
    required.push('breach_notification', 'third_party_processor')
  }

  return required
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Sleep utility for async flows
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
