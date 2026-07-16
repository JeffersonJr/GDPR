import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single()

  if (profile?.organizations && !profile.organizations.onboarding_completed) {
    redirect('/onboarding')
  }

  return (
    <div className="min-h-screen bg-surface-cream dark:bg-surface-ink flex">
      <Sidebar profile={profile} />
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        <TopBar profile={profile} />
        <main className="flex-1 page-section animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
