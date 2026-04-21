import Image from "next/image"
import {
  HeroProgressCard,
  type HeroMilestone,
  type HeroDonation,
  type HeroGenerationTotal,
} from "@/components/hero-progress-card"

const MM_URL = "https://www.manageandmore.de"
const KUNSTLABOR_URL = "https://kunstlabor.org/kunst/atelier-mieten-muenchen/"

interface HeroSectionProps {
  cardData: {
    totalRaised: number
    totalGoal: number
    baseGoal: number
    milestones: HeroMilestone[]
    recentDonations: HeroDonation[]
    generationTotals: HeroGenerationTotal[]
  }
}

export function HeroSection({ cardData }: HeroSectionProps) {
  return (
    <section className="bg-background">
      {/* Top bar: deep near-black with a brand-cyan accent hairline and a
          soft radial highlight behind the centered title. */}
      <div className="relative isolate overflow-hidden bg-[#0a0a0a]">
        {/* Subtle radial glow centered behind the title */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] bg-[radial-gradient(60%_120%_at_50%_50%,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_60%)]"
        />
        {/* Top accent hairline in brand cyan */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

        <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-6 py-5 lg:pl-24 lg:pr-[456px]">
          {/* Left: logos with a thin gradient divider */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <a
              href={MM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-opacity hover:opacity-80"
              aria-label="Manage and More, opens in new tab"
            >
              <Image
                src="/logos/mm-logo.webp"
                alt="Manage and More"
                width={160}
                height={56}
                className="h-6 w-auto brightness-0 invert sm:h-8"
                priority
              />
            </a>
            <span
              aria-hidden="true"
              className="h-6 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent sm:h-7"
            />
            <a
              href={KUNSTLABOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-opacity hover:opacity-80"
              aria-label="Kunstlabor München, opens in new tab"
            >
              <Image
                src="/logos/kunstlabor-logo.webp"
                alt="Kunstlabor München"
                width={160}
                height={56}
                className="h-6 w-auto brightness-0 invert sm:h-8"
                priority
              />
            </a>
          </div>

          <div className="flex-1" />
        </div>

        {/* Bottom hairline for a subtle separation from the hero body */}
        <div className="h-px w-full bg-white/5" />
      </div>

      {/* Hero body: video + headline on the darker grey. The floating progress
          card sits on top of this on lg+, glowing against the grey. */}
      <div className="bg-hero-dark text-white">
        <div className="mx-auto max-w-[1440px] px-6 py-12 sm:py-16 lg:pl-24 lg:pr-[456px]">
          <iframe
            className="block aspect-video w-full border-0 bg-black"
            src="https://player.vimeo.com/video/1184616655?badge=0&autopause=0&player_id=0&app_id=58479"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            allowFullScreen
            title="Tour of the new Manage and More office at Kunstlabor"
          />

          <div className="mt-10 max-w-3xl">
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Making the{" "}
              <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                MM Office
              </span>{" "}
              reality
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
              For the first time in Manage and More history, we&apos;re building
              our own office, a permanent home for founders, ideas, and
              community at{" "}
              <a
                href={KUNSTLABOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white underline underline-offset-4 decoration-white/40 transition-colors hover:decoration-white"
              >
                Kunstlabor München
              </a>
              .
            </p>
            <p className="mt-3 text-sm text-white/50">
              For more questions contact David Köthnig (G43):{" "}
              <a
                href="tel:+491638737358"
                className="text-white/70 underline underline-offset-2 decoration-white/30 transition-colors hover:text-white hover:decoration-white/60"
              >
                +49 163 8737358
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile-only: progress card inline under the hero (light bg).
          On lg+ the fixed sidebar in page.tsx takes over. */}
      <div className="bg-background px-6 py-10 lg:hidden">
        <HeroProgressCard {...cardData} />
      </div>
    </section>
  )
}
