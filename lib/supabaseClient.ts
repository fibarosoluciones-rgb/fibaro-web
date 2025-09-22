
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon'
)
// Nota: estos valores por defecto NO se usan en producción si configuras las variables en Vercel.
