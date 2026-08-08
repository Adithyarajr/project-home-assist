import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qsyvrcirlzvgocqlgvpr.supabase.co'
const supabaseKey = 'sb_publishable_Hn_eUtkWvSjPBhxTtHTHnw_V6gBL90E'

export const supabase = createClient(supabaseUrl, supabaseKey)