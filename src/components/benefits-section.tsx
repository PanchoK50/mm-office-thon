import { Building2, DoorOpen, Award, Fingerprint } from "lucide-react"
import { SPONSORING_TIERS } from "@/lib/constants"
import { formatEUR } from "@/lib/utils"
import { cn } from "@/lib/utils"

/* Metallic-medal theme for each tier. Keyed by tier.id in constants.ts. */
const TIER_THEMES: Record<
  string,
  {
    badge: string
    topBar: string
    iconWrap: string
    iconText: string
    price: string
    bullet: string
    ring: string
  }
> = {
  "title-room": {
    badge: "Gold",
    topBar: "bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600",
    iconWrap: "bg-amber-100",
    iconText: "text-amber-700",
    price: "text-amber-700",
    bullet: "bg-amber-500",
    ring: "hover:ring-amber-400/60",
  },
  "meeting-room": {
    badge: "Silver",
    topBar: "bg-gradient-to-r from-slate-200 via-slate-400 to-slate-500",
    iconWrap: "bg-slate-100",
    iconText: "text-slate-700",
    price: "text-slate-700",
    bullet: "bg-slate-400",
    ring: "hover:ring-slate-400/60",
  },
  gruendungsmitglied: {
    badge: "Bronze",
    topBar: "bg-gradient-to-r from-orange-300 via-orange-600 to-amber-800",
    iconWrap: "bg-orange-100",
    iconText: "text-orange-700",
    price: "text-orange-700",
    bullet: "bg-orange-500",
    ring: "hover:ring-orange-500/60",
  },
  "wall-of-fame": {
    badge: "Wall of Fame",
    topBar: "bg-gradient-to-r from-neutral-300 via-neutral-500 to-neutral-700",
    iconWrap: "bg-neutral-100",
    iconText: "text-neutral-700",
    price: "text-neutral-700",
    bullet: "bg-neutral-400",
    ring: "hover:ring-neutral-400/60",
  },
}

const TIER_ICONS: Record<string, typeof Building2> = {
  "title-room": Building2,
  "meeting-room": DoorOpen,
  gruendungsmitglied: Award,
  "wall-of-fame": Fingerprint,
}

export function BenefitsSection() {
  return (
    <section id="benefits" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Become a Sponsor
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Choose your level of support — every tier makes the office happen.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SPONSORING_TIERS.map((tier) => {
            const Icon = TIER_ICONS[tier.id] ?? Award
            const theme = TIER_THEMES[tier.id] ?? TIER_THEMES["wall-of-fame"]
            const remaining =
              tier.available !== null ? tier.available - tier.taken : null

            return (
              <div
                key={tier.id}
                className={cn(
                  "group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card p-6 ring-1 ring-transparent transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
                  theme.ring
                )}
              >
                {/* Metallic top bar */}
                <div
                  className={cn("absolute inset-x-0 top-0 h-1", theme.topBar)}
                  aria-hidden="true"
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        theme.iconWrap
                      )}
                    >
                      <Icon
                        className={cn("h-5 w-5", theme.iconText)}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold leading-snug">
                          {tier.name}
                        </h3>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                            theme.iconWrap,
                            theme.iconText
                          )}
                        >
                          {theme.badge}
                        </span>
                      </div>
                      {remaining !== null && (
                        <span className="text-xs text-muted-foreground">
                          {remaining} of {tier.available} remaining
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={cn("text-lg font-bold", theme.price)}>
                    {tier.price > 0
                      ? formatEUR(tier.price)
                      : "< " + formatEUR(5000)}
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {tier.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span
                        className={cn(
                          "mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full",
                          theme.bullet
                        )}
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
