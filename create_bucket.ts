import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log('Creating documents bucket...')
  const { data, error } = await supabase.storage.createBucket('documents', {
    public: true,
    fileSizeLimit: 52428800,
    allowedMimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown']
  })

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('Bucket already exists.')
    } else {
      console.error('Error creating bucket:', error)
    }
  } else {
    console.log('Bucket created successfully:', data)
  }
}

main()
