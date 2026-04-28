import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let supabase: ReturnType<typeof createClient>

if (typeof window !== "undefined") {
  // Browser: reuse client
  if (!(window as any).__supabase) {
    (window as any).__supabase = createClient(url, key)
  }
  supabase = (window as any).__supabase
} else {
  // Server: create fresh
  supabase = createClient(url, key)
}

export { supabase }