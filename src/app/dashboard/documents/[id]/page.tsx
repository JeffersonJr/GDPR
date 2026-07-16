import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { DocumentSkeleton } from '@/components/ui/Skeletons'
import DocumentViewerClient from './DocumentViewerClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Auditoria de Documento — E-Compliance' }

export const dynamic = 'force-dynamic'

async function DocumentData({ id }: { id: string }) {
  const supabase = await createClient()

  // Fetch document by id
  const { data: doc, error } = await (supabase as any)
    .from('documents')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !doc) {
    notFound()
  }

  // Fetch file contents if URLs are available
  let originalText = ''
  let compliantText = ''

  if (doc.original_url && !doc.original_url.toLowerCase().endsWith('.pdf')) {
    // Basic fetch if it's text/md. For PDFs we'd need parsing, but we can't do pdf-parse
    // cleanly in a standard page component without risking some edge cases, so we leave it 
    // to the client to render the pdf or we just show a placeholder if it's pdf.
    try {
      const res = await fetch(doc.original_url)
      originalText = await res.text()
    } catch {
      originalText = 'Falha ao carregar texto original.'
    }
  }

  if (doc.compliant_url) {
    try {
      const res = await fetch(doc.compliant_url)
      compliantText = await res.text()
    } catch {
      compliantText = 'Falha ao carregar versão compliance.'
    }
  }

  return (
    <DocumentViewerClient
      doc={doc}
      initialOriginalText={originalText}
      initialCompliantText={compliantText}
    />
  )
}

export default function DocumentPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Suspense fallback={<DocumentSkeleton />}>
        <DocumentData id={params.id} />
      </Suspense>
    </div>
  )
}
