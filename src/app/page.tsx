import { supabase } from "@/lib/supabase"
import type { Donation } from "@/lib/supabase"
import { getDonationStats } from "@/app/actions"
import { ROOMS, KAUTION, FUNDRAISING_GOAL } from "@/lib/constants"
import { HeroSection } from "@/components/hero-section"
import { StorySection } from "@/components/story-section"
import { BenefitsSection } from "@/components/benefits-section"
import { GallerySection } from "@/components/gallery-section"
import { FloorPlanSection } from "@/components/floor-plan-section"
import { RoomProgressSection } from "@/components/room-progress-section"
import { ScoreboardSection } from "@/components/scoreboard-section"
import { GenerationRaceSection } from "@/components/generation-race-section"
import { FooterSection } from "@/components/footer-section"
import {
  HeroProgressCard,
  type HeroMilestone,
  type HeroDonation,
  type HeroGenerationTotal,
} from "@/components/hero-progress-card"
import { MobileStickyFooter } from "@/components/mobile-sticky-footer"
import Confetti from "@/components/ui/confetti"

export const revalidate = 60

const SHORT_LABELS: Record<string, string> = {
  "Deep Work / Focus": "Deep Work",
  "Incubation Space": "Incubation",
  "Meeting Rooms": "Meeting Rooms",
  "Furniture and Set Up": "Furniture",
}

async function getDonations(): Promise<Donation[]> {
  const { data } = await supabase
    .from("donations")
    .select("*")
    .order("amount", { ascending: false })
  return data ?? []
}

type CardData = {
  totalRaised: number
  totalGoal: number
  baseGoal: number
  milestones: HeroMilestone[]
  recentDonations: HeroDonation[]
  generationTotals: HeroGenerationTotal[]
  nextMilestonePercent: number
  nextMilestoneLabel: string
}

function buildCardData(
  stats: Awaited<ReturnType<typeof getDonationStats>>
): CardData {
  const baseGoal =
    KAUTION +
    ROOMS.filter((room) => room.name !== "Furniture and Set Up").reduce(
      (s, r) => s + r.sponsorGoal,
      0
    )
  const kautionRaised = Math.max(0, Math.min(KAUTION, stats.total))
  const kautionMilestone: HeroMilestone = {
    label: "Kaution",
    raised: kautionRaised,
    goal: KAUTION,
  }

  const milestones: HeroMilestone[] = [
    kautionMilestone,
    ...ROOMS.map((room, i) => {
      const cumulativeBefore =
        KAUTION + ROOMS.slice(0, i).reduce((s, r) => s + r.sponsorGoal, 0)
      const raised = Math.max(
        0,
        Math.min(room.sponsorGoal, stats.total - cumulativeBefore)
      )
      return {
        label: SHORT_LABELS[room.name] ?? room.name,
        raised,
        goal: room.sponsorGoal,
      }
    }),
  ]

  const recentDonations: HeroDonation[] = stats.recentDonations.map((d) => ({
    id: d.id,
    donor_name: d.donor_name,
    generation: d.generation,
    amount: d.amount,
    created_at: d.created_at,
  }))

  const generationTotals: HeroGenerationTotal[] = stats.generationTotals.map(
    (g) => ({ generation: g.generation, total: g.total })
  )

  const nextIdx = milestones.findIndex((m) => m.raised < m.goal)
  const nextMilestone =
    nextIdx === -1 ? milestones[milestones.length - 1] : milestones[nextIdx]
  const nextMilestonePercent =
    nextIdx === -1
      ? 100
      : Math.min(
          100,
          Math.round((nextMilestone.raised / nextMilestone.goal) * 100)
        )
  const nextMilestoneLabel = nextMilestone?.label ?? "Complete"

  return {
    totalRaised: stats.total,
    totalGoal: FUNDRAISING_GOAL,
    baseGoal,
    milestones,
    recentDonations,
    generationTotals,
    nextMilestonePercent,
    nextMilestoneLabel,
  }
}

export default async function Home() {
  const [stats, donations] = await Promise.all([
    getDonationStats(),
    getDonations(),
  ])
  const cardData = buildCardData(stats)

  return (
    <main className="relative flex-1">
      {/* Hero — breaks out of the sidebar's safe zone so the video can
          overlap the floating progress panel on large screens. */}
      <HeroSection cardData={cardData} />

      {/* Pre-rooms sections respect the sidebar column on lg+.
          pr = card (360px) + gap (96px = 6rem) = 456px so the gap between
          the text and the donation card matches the 96px page-left padding
          (sections use lg:px-24). Wrapped in a max-w-[1440px] container so
          left-aligned section content lines up with the carousel heading
          and cards. */}
      <div className="mx-auto max-w-[1440px] lg:pr-[456px]">
        <hr className="divider-fade mx-6 lg:mx-24" />
        <StorySection />

        <hr className="divider-fade mx-6 lg:mx-24" />
        <GallerySection />

        <hr className="divider-fade mx-6 lg:mx-24" />
        <FloorPlanSection />

        <hr className="divider-fade mx-6 lg:mx-24" />
        <BenefitsSection />

        <hr className="divider-fade mx-6 lg:mx-24" />
      </div>

      <RoomProgressSection totalRaised={cardData.totalRaised} />

      {/* Post-rooms sections go back inside the safe zone. */}
      <div className="mx-auto max-w-[1440px] lg:pr-[456px]">
        <hr className="divider-fade mx-6 lg:mx-24" />
        <ScoreboardSection donations={donations} />

        <hr className="divider-fade mx-6 lg:mx-24" />
        <GenerationRaceSection />

        <FooterSection />
      </div>

      {/* Above page backgrounds, below the fixed donation aside (z-30). */}
      <Confetti autoPlay loop zIndex={25} />

      {/* Progress panel — fixed to the viewport on lg+ so it is always
          visible regardless of scroll position. Pinned to the right edge of
          a notional 1440px content container so the page feels centered on
          wide viewports. A max-height + overflow keeps tall cards usable on
          short viewports. */}
      <aside
        className="pointer-events-auto fixed top-24 z-30 hidden w-[360px] overflow-y-auto lg:block"
        style={{
          right: "max(3rem, calc((100vw - 1440px) / 2 + 3rem))",
          maxHeight: "calc(100vh - 7rem)",
        }}
        aria-label="Fundraising progress"
      >
        <HeroProgressCard {...cardData} />
      </aside>

      <MobileStickyFooter
        percent={cardData.nextMilestonePercent}
        label={cardData.nextMilestoneLabel}
        totalRaised={cardData.totalRaised}
        totalGoal={cardData.totalGoal}
      />
    </main>
  )
}
