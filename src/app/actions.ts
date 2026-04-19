'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import type { DonationInsert, Donation, GenerationTotal } from '@/lib/supabase'
import { GENERATIONS, MIN_CUSTOM_AMOUNT, MAX_CUSTOM_AMOUNT } from '@/lib/constants'

export async function createDonation(input: {
  donor_name: string
  telephone: string
  amount: number
  generation: string
  reference_code: string
  message?: string
  commitment_type?: 'transfer' | 'loi'
  screenshot_url?: string
}): Promise<
  | { success: true; donationId: number; referenceCode: string }
  | { success: false; error: string }
> {
  try {
    // Validate amount
    if (input.amount < MIN_CUSTOM_AMOUNT) {
      return {
        success: false,
        error: `Amount must be at least ${MIN_CUSTOM_AMOUNT}`,
      }
    }

    if (input.amount > MAX_CUSTOM_AMOUNT) {
      return {
        success: false,
        error: `Amount must be at most ${MAX_CUSTOM_AMOUNT}`,
      }
    }

    // Validate donor name
    if (!input.donor_name.trim()) {
      return {
        success: false,
        error: 'Donor name is required',
      }
    }

    if (input.donor_name.trim().length > 100) {
      return {
        success: false,
        error: 'Name must be 100 characters or less',
      }
    }

    // Validate telephone
    if (!input.telephone.trim()) {
      return {
        success: false,
        error: 'Telephone is required',
      }
    }

    if (input.telephone.trim().length > 32) {
      return {
        success: false,
        error: 'Telephone must be 32 characters or less',
      }
    }

    // Validate generation
    if (!GENERATIONS.includes(input.generation)) {
      return {
        success: false,
        error: 'Invalid generation',
      }
    }

    // Validate reference code
    if (!input.reference_code || !input.reference_code.startsWith('Manage and More Büro spende ')) {
      return {
        success: false,
        error: 'Invalid reference code',
      }
    }

    // Insert donation
    const { data, error } = await supabase
      .from('donations')
      .insert({
        donor_name: input.donor_name.trim(),
        telephone: input.telephone.trim(),
        amount: input.amount,
        generation: input.generation,
        message: input.message || null,
        status: 'pending',
        commitment_type: input.commitment_type ?? 'transfer',
        screenshot_url: input.screenshot_url ?? null,
        reference_code: input.reference_code,
      } as DonationInsert)
      .select('id')
      .single()

    if (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        return {
          success: false,
          error: 'Reference code collision — please try again',
        }
      }
      return {
        success: false,
        error: `Failed to create donation: ${error.message}`,
      }
    }

    // Revalidate cache
    revalidatePath('/')

    return {
      success: true,
      donationId: data.id,
      referenceCode: input.reference_code,
    }
  } catch (err) {
    return {
      success: false,
      error: `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`,
    }
  }
}

export async function uploadScreenshot(
  formData: FormData
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  try {
    const file = formData.get('file') as File

    if (!file) {
      return { success: false, error: 'File is required' }
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return { success: false, error: 'Only JPEG, PNG, or WebP images are allowed' }
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 5MB' }
    }

    const buffer = await file.arrayBuffer()
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('screenshots')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      return { success: false, error: `Failed to upload file: ${uploadError.message}` }
    }

    const { data: publicUrlData } = supabase.storage
      .from('screenshots')
      .getPublicUrl(path)

    return { success: true, url: publicUrlData.publicUrl }
  } catch (err) {
    return {
      success: false,
      error: `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`,
    }
  }
}

export async function updateDonationCommitment(
  donationId: number,
  commitment_type: 'transfer' | 'loi'
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    if (!Number.isFinite(donationId) || donationId <= 0) {
      return { success: false, error: 'Invalid donation id' }
    }
    if (commitment_type !== 'transfer' && commitment_type !== 'loi') {
      return { success: false, error: 'Invalid commitment type' }
    }

    const { error } = await supabase
      .from('donations')
      .update({ commitment_type })
      .eq('id', donationId)

    if (error) {
      return {
        success: false,
        error: `Failed to update commitment: ${error.message}`,
      }
    }

    revalidatePath('/')
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`,
    }
  }
}

export async function getDonationStats(): Promise<{
  total: number
  count: number
  generationTotals: GenerationTotal[]
  recentDonations: Donation[]
}> {
  try {
    // Fetch all donations
    const { data: donations, error } = await supabase
      .from('donations')
      .select('id, donor_name, telephone, amount, message, created_at, generation, screenshot_url, status, commitment_type')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch donations:', error)
      return {
        total: 0,
        count: 0,
        generationTotals: [],
        recentDonations: [],
      }
    }

    const donationList = (donations ?? []) as Donation[]

    // Calculate total and count
    const total = donationList.reduce((sum, d) => sum + d.amount, 0)
    const count = donationList.length

    // Calculate generation totals
    const generationMap = new Map<
      string,
      { total: number; donor_count: number }
    >()

    donationList.forEach((donation) => {
      if (donation.generation) {
        const current = generationMap.get(donation.generation) || {
          total: 0,
          donor_count: 0,
        }
        generationMap.set(donation.generation, {
          total: current.total + donation.amount,
          donor_count: current.donor_count + 1,
        })
      }
    })

    const generationTotals: GenerationTotal[] = Array.from(
      generationMap.entries()
    )
      .map(([generation, { total: genTotal, donor_count }]) => ({
        generation,
        total: genTotal,
        donor_count,
      }))
      .sort((a, b) => b.total - a.total)

    // Get recent donations (up to 10 so consumers can slice as needed)
    const recentDonations = donationList.slice(0, 10)

    return {
      total,
      count,
      generationTotals,
      recentDonations,
    }
  } catch (err) {
    console.error('Error fetching donation stats:', err)
    return {
      total: 0,
      count: 0,
      generationTotals: [],
      recentDonations: [],
    }
  }
}
