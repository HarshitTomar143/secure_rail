import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ykqipkylnsvfxvxxnctn.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_anon_key_here'

export const supabase = createClient(supabaseUrl, supabaseKey)
