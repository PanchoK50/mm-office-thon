import Image from "next/image"
import { PlayCircle } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"
import { HeroCTA } from "@/components/hero-cta"
import { getDonationStats } from "@/app/actions"
import { formatEUR } from "@/lib/utils"
import type { Campaign } from "@/lib/supabase"

interface HeroSectionProps {
  campaign: Campaign | null
}

export async function HeroSection({ campaign }: HeroSectionProps) {
  const stats = await getDonationStats()
  const goalAmount = campaign?.goal_amount ?? 5000
  const percentage = Math.min((stats.total / goalAmount) * 100, 100)
  const top3Generations = stats.generationTotals.slice(0, 3)
  const last3Donations = stats.recentDonations.slice(0, 3)

  return (
    <section className="px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-5xl grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
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
              href="#story"
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

          <div className="aspect-video overflow-hidden rounded-xl border border-border bg-card flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <PlayCircle className="h-16 w-16 opacity-40" aria-hidden="true" />
              <span className="text-sm font-medium">Video coming soon</span>
            </div>
          </div>

          <div id="support">
            <HeroCTA />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-5 h-fit">
          <h3 className="text-lg font-semibold">Fundraising Progress</h3>

          <ProgressBar current={stats.total} goal={goalAmount} />

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
    </section>
  )
}
