import { supabase } from "@/lib/supabase"
import type { Donation } from "@/lib/supabase"
import { HeroSection } from "@/components/hero-section"
import { StorySection } from "@/components/story-section"
import { BenefitsSection } from "@/components/benefits-section"
import { GallerySection } from "@/components/gallery-section"
import { FloorPlanSection } from "@/components/floor-plan-section"
import { RoomProgressSection } from "@/components/room-progress-section"
import { ScoreboardSection } from "@/components/scoreboard-section"
import { GenerationRaceSection } from "@/components/generation-race-section"
import { FooterSection } from "@/components/footer-section"

export const revalidate = 60

async function getDonations(): Promise<Donation[]> {
  const { data } = await supabase
    .from("donations")
    .select("*")
    .order("amount", { ascending: false })
  return data ?? []
}

export default async function Home() {
  const donations = await getDonations()

  return (
    <main className="flex-1">
      <HeroSection />

      <hr className="mx-auto max-w-3xl border-border" />

      <StorySection />

      <hr className="mx-auto max-w-3xl border-border" />

      <GallerySection />

      <hr className="mx-auto max-w-3xl border-border" />

      <FloorPlanSection />

      <hr className="mx-auto max-w-3xl border-border" />

      <BenefitsSection />

      <hr className="mx-auto max-w-3xl border-border" />

      <RoomProgressSection />

      <hr className="mx-auto max-w-3xl border-border" />

      <ScoreboardSection donations={donations} />

      <hr className="mx-auto max-w-3xl border-border" />

      <GenerationRaceSection />

      <FooterSection />
    </main>
  )
}
