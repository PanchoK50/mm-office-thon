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
    milestones: HeroMilestone[]
    recentDonations: HeroDonation[]
    generationTotals: HeroGenerationTotal[]
  }
}

export function HeroSection({ cardData }: HeroSectionProps) {
  return (
    <section className="bg-background">
      {/* Top bar: logos flush left, "Making the MM Office reality" centered
          as a bold Geist title with the brand cyan highlighting "MM Office".
          This is the ONLY grey band on the page — everything else is black
          or white. */}
      <div className="bg-top-bar">
        <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-6 py-5 lg:pr-[392px]">
          {/* Left: logos */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href={MM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              aria-label="Manage and More, opens in new tab"
            >
              <Image
                src="/logos/mm-logo.webp"
                alt="Manage and More"
                width={160}
                height={56}
                className="h-6 w-auto sm:h-8"
                priority
              />
            </a>
            <span
              className="text-xs text-muted-foreground"
              aria-hidden="true"
            >
              ×
            </span>
            <a
              href={KUNSTLABOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              aria-label="Kunstlabor München, opens in new tab"
            >
              <Image
                src="/logos/kunstlabor-logo.webp"
                alt="Kunstlabor München"
                width={160}
                height={56}
                className="h-6 w-auto sm:h-8"
                priority
              />
            </a>
          </div>

          {/* Middle: bold sans-serif title, MM cyan highlight on the brand
              words. Hidden on very narrow screens to avoid colliding with
              the logos on the left. */}
          <h1 className="hidden flex-1 text-center text-xl font-bold tracking-tight text-foreground sm:block md:text-2xl lg:text-3xl">
            Making the <span className="text-accent">MM Office</span> reality
          </h1>

          {/* Right spacer, balances the logos so the tagline sits truly
              centered in the available row. */}
          <div
            aria-hidden="true"
            className="hidden shrink-0 sm:block"
            style={{ width: 180 }}
          />
        </div>
      </div>

      {/* Hero body: video + headline on the darker grey. The floating progress
          card sits on top of this on lg+, glowing against the grey. */}
      <div className="bg-hero-dark text-white">
        <div className="mx-auto max-w-[1440px] px-6 py-12 sm:py-16 lg:pr-[392px]">
          <iframe
            className="block aspect-video w-full border-0 bg-black"
            src="https://drive.google.com/file/d/1R4PnFAcEkt0ZDjw7D0_rq12c5fDHxIIl/preview"
            allow="autoplay"
            allowFullScreen
            title="Tour of the new Manage and More office at Kunstlabor"
          />

          <div className="mt-10 max-w-3xl">
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Giving the community the home{" "}
              <span className="whitespace-nowrap">it deserves.</span>
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
