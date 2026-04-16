import { supabase } from "@/lib/supabase"
import type { Campaign, Donation } from "@/lib/supabase"
import { HeroSection } from "@/components/hero-section"
import { StorySection } from "@/components/story-section"
import { BenefitsSection } from "@/components/benefits-section"
import { GallerySection } from "@/components/gallery-section"
import { FloorPlanSection } from "@/components/floor-plan-section"
import { ScoreboardSection } from "@/components/scoreboard-section"
import { GenerationRaceSection } from "@/components/generation-race-section"
import { FooterSection } from "@/components/footer-section"

export const revalidate = 60

async function getCampaign(): Promise<Campaign | null> {
  const { data } = await supabase
    .from("campaign")
    .select("*")
    .eq("id", 1)
    .single()
  return data
}

async function getDonations(): Promise<Donation[]> {
  const { data } = await supabase
    .from("donations")
    .select("*")
    .order("amount", { ascending: false })
  return data ?? []
}

export default async function Home() {
  const [campaign, donations] = await Promise.all([
    getCampaign(),
    getDonations(),
  ])

  return (
    <main className="flex-1">
      <HeroSection campaign={campaign} />

      <hr className="mx-auto max-w-3xl border-border" />

      <StorySection />

      <hr className="mx-auto max-w-3xl border-border" />

      <BenefitsSection />

      <hr className="mx-auto max-w-3xl border-border" />

      <GallerySection />

      <hr className="mx-auto max-w-3xl border-border" />

      <FloorPlanSection />

      <hr className="mx-auto max-w-3xl border-border" />

      <ScoreboardSection donations={donations} />

      <hr className="mx-auto max-w-3xl border-border" />

      <GenerationRaceSection />

      <FooterSection />
    </main>
  )
}
