import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DocumentsList from '@/components/dashboard/DocumentsList'
import { FileText, Plus } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Documentos | E-Compliance',
}

export default async function DocumentsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()

  if (!profile?.org_id) {
    redirect('/onboarding')
  }

  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('org_id', profile.org_id)
    .order('created_at', { ascending: true })

  return (
    <div className="page-section space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-ink dark:text-surface-snow flex items-center gap-2">
            <FileText className="text-primary" size={24} />
            Documentos
          </h1>
          <p className="text-sm text-surface-slate dark:text-surface-fog mt-1">
            Gerencie e visualize todos os documentos de conformidade da organização.
          </p>
        </div>
        
        <Link href="/dashboard/documents/generate" className="btn-primary">
          <Plus size={18} />
          Novo Documento
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DocumentsList orgId={profile.org_id} documents={documents ?? []} />
      </div>
    </div>
  )
}
