
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.myportfolio_SUPABASE_URL!
const supabaseAnonKey = process.env.myportfolio_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
