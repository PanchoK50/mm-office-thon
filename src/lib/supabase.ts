import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Donation = {
  id: number
  donor_name: string
  telephone: string
  amount: number
  message: string | null
  created_at: string
  generation: string | null
  screenshot_url: string | null
  status: 'pending' | 'confirmed' | 'rejected'
  commitment_type: 'transfer' | 'loi'
  reference_code: string
}

export type DonationInsert = Omit<Donation, 'id' | 'created_at'>

export type GenerationTotal = {
  generation: string
  total: number
  donor_count: number
}
