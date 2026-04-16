import { Award, MapPin, Calendar, Trophy, Key, Utensils, Star } from "lucide-react"

const benefits = [
  {
    icon: Award,
    title: "Wall of Fame",
    description:
      "Your name on the office wall of fame. Fingerprint concept with colors based on amount.",
  },
  {
    icon: MapPin,
    title: "Room Naming",
    description:
      "Name a room after you. Sponsor a room for a year and it carries your name.",
  },
  {
    icon: Calendar,
    title: "Event Hosting",
    description:
      "Host events in the office. Book the space for your team events.",
  },
  {
    icon: Trophy,
    title: "First Hackathon",
    description:
      "Free Hackathon challenge. First hackathon in the new office — your challenge is on us.",
  },
  {
    icon: Key,
    title: "Early Access",
    description:
      "First keycards. Top 10 supporters get the first office keycards.",
  },
  {
    icon: Utensils,
    title: "Founding Dinner",
    description:
      "Exclusive founder dinner. Join the celebration dinner for all founding members.",
  },
]

export function BenefitsSection() {
  return (
    <section id="benefits" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-2">
          <Star className="h-6 w-6 text-accent" aria-hidden="true" />
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Founding Members
          </h2>
        </div>
        <p className="mb-8 text-base text-muted-foreground">
          Your support gets you these perks
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent/40"
              >
                <Icon
                  className="h-5 w-5 text-accent/70 group-hover:text-accent"
                  aria-hidden="true"
                />
                <h3 className="text-sm font-semibold leading-snug">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
