import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ykqipkylnsvfxvxxnctn.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcWlwa3lsbnN2Znh2eHhuY3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MTcwMjAsImV4cCI6MjA3MzE5MzAyMH0.hAJxDlo-SZ1Ebi-bn_tCVdUYWn-CvntMemW_SR70X5Q'

// Debug: Log if key is loaded
if (typeof window !== 'undefined') {
  console.log('Supabase initialized with URL:', supabaseUrl)
}

export const supabase = createClient(supabaseUrl, supabaseKey)
