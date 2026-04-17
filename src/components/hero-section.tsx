import Image from "next/image"
import { MilestoneProgressBar } from "@/components/ui/milestone-progress-bar"
import { HeroCTA } from "@/components/hero-cta"
import { getDonationStats } from "@/app/actions"
import { formatEUR } from "@/lib/utils"
import { ROOMS } from "@/lib/constants"
import type { Campaign } from "@/lib/supabase"

interface HeroSectionProps {
  campaign: Campaign | null
}

export async function HeroSection({ campaign }: HeroSectionProps) {
  const stats = await getDonationStats()
  const top3Generations = stats.generationTotals.slice(0, 3)
  const last3Donations = stats.recentDonations.slice(0, 3)

  const totalGoal = 93_000
  const percentage = Math.min((stats.total / totalGoal) * 100, 100)

  const SHORT_LABELS: Record<string, string> = {
    "Deep Work / Focus": "Deep Work",
    "Incubation Space": "Incubation",
    "Meeting Rooms": "Meeting",
  }

  let cumulative = 0
  const milestones = ROOMS.map((room) => {
    cumulative += room.sponsorGoal
    const roomTotal = room.sponsors.reduce((s, sp) => s + sp.amount, 0)
    return {
      position: (cumulative / totalGoal) * 100,
      label: SHORT_LABELS[room.name] ?? room.name,
      funded: roomTotal >= room.sponsorGoal,
    }
  })

  milestones.push({
    position: 100,
    label: "Kaution",
    funded: false,
  })

  return (
    <section className="px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Image
                src="/logos/mm-logo.webp"
                alt="manage&more"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
              <span className="text-muted-foreground">×</span>
              <Image
                src="/logos/kunstlabor-logo.webp"
                alt="Kunstlabor"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>

            <nav className="flex gap-3">
              <a
                href="#floor-plan"
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent"
              >
                Discover the Office
              </a>
              <a
                href="#support"
                className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Support Us
              </a>
            </nav>

            <div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                The first{" "}
                <span className="text-accent">manage&amp;more Office</span>
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                For the first time in manage&amp;more history, we&apos;re building
                our own space &mdash; a home for founders, ideas, and community at
                Kunstlabor München.
              </p>
            </div>

            <div id="support" className="flex flex-col gap-3">
              <HeroCTA />
              <p className="text-sm text-muted-foreground">
                Questions? Reach out to{" "}
                <a href="tel:+491638737358" className="font-medium text-foreground hover:text-accent">
                  David Köthnig
                </a>{" "}
                <span className="text-xs">(G43)</span>{" "}
                <a href="tel:+491638737358" className="hover:text-accent">
                  +49 163 8737358
                </a>
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-5 h-fit">
            <h3 className="text-lg font-semibold">Fundraising Progress</h3>

            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{stats.count}</span>{" "}
              {stats.count === 1 ? "supporter" : "supporters"}
            </p>

            {percentage >= 100 ? (
              <div className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent font-medium">
                🎉 Goal reached! Every extra euro pushes us further.
              </div>
            ) : percentage >= 80 ? (
              <div className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent font-medium">
                🎉 Almost there — stretch goal in sight!
              </div>
            ) : null}

            {top3Generations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Top Generations
                </h4>
                {top3Generations.map((gen, i) => (
                  <div
                    key={gen.generation}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{i + 1}.</span>
                      <span className="font-medium">{gen.generation}</span>
                    </div>
                    <span className="font-semibold text-accent">
                      {formatEUR(gen.total)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {last3Donations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent Donations
                </h4>
                {last3Donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground truncate max-w-[160px]">
                      {donation.donor_name}
                    </span>
                    <span className="font-semibold">
                      {formatEUR(donation.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Room Milestones
          </h3>
          <MilestoneProgressBar
            current={stats.total}
            total={totalGoal}
            milestones={milestones}
          />
        </div>
      </div>
    </section>
  )
}
