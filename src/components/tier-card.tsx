import {
  Check,
  Users,
  Briefcase,
  MessagesSquare,
  Frame,
  Fingerprint,
  Sparkles,
} from "lucide-react"
import {
  CONTRIBUTION_TIERS,
  type ContributionTier,
} from "@/lib/constants"
import { formatEUR, cn } from "@/lib/utils"

/** Every tier card renders this many benefit rows — shorter tiers get
 *  invisible placeholder rows so the divider + bullets line up across cards. */
export const MAX_BENEFIT_ROWS = Math.max(
  ...CONTRIBUTION_TIERS.map((t) => t.benefits.length)
)

/** Tiers rendered as cards — Wall of Fame is surfaced as a disclaimer row. */
export const CARD_TIERS = CONTRIBUTION_TIERS
  .filter((t) => t.id !== "wall")
  // Display order: Gold · Silver · Bronze · Founding.
  .sort((a, b) => {
    const order: Record<ContributionTier["id"], number> = {
      gold: 0,
      silver: 1,
      bronze: 2,
      founding: 3,
      wall: 4,
    }
    return order[a.id] - order[b.id]
  })

export const TIER_THEME: Record<
  ContributionTier["id"],
  {
    dot: string
    borderIdle: string
    borderActive: string
    ring: string
    accentText: string
    chipBg: string
    tagBg: string
    headlineBg: string
    headlineBorder: string
    headlineIcon: string
  }
> = {
  gold: {
    dot: "bg-amber-500",
    borderIdle: "border-amber-300/60",
    borderActive: "border-amber-500",
    ring: "ring-amber-500/30",
    accentText: "text-amber-700",
    chipBg: "bg-amber-500/10",
    tagBg: "bg-amber-500/15",
    headlineBg: "bg-amber-500/5",
    headlineBorder: "border-amber-500/30",
    headlineIcon: "text-amber-600",
  },
  silver: {
    dot: "bg-slate-500",
    borderIdle: "border-slate-300/70",
    borderActive: "border-slate-500",
    ring: "ring-slate-500/30",
    accentText: "text-slate-700",
    chipBg: "bg-slate-500/10",
    tagBg: "bg-slate-500/15",
    headlineBg: "bg-slate-500/5",
    headlineBorder: "border-slate-500/30",
    headlineIcon: "text-slate-600",
  },
  bronze: {
    dot: "bg-orange-700",
    borderIdle: "border-orange-300/60",
    borderActive: "border-orange-700",
    ring: "ring-orange-700/30",
    accentText: "text-orange-800",
    chipBg: "bg-orange-700/10",
    tagBg: "bg-orange-700/15",
    headlineBg: "bg-orange-700/5",
    headlineBorder: "border-orange-700/30",
    headlineIcon: "text-orange-700",
  },
  founding: {
    dot: "bg-neutral-900",
    borderIdle: "border-neutral-300",
    borderActive: "border-neutral-900",
    ring: "ring-neutral-900/25",
    accentText: "text-neutral-900",
    chipBg: "bg-neutral-900/5",
    tagBg: "bg-neutral-900/10",
    headlineBg: "bg-neutral-900/5",
    headlineBorder: "border-neutral-900/25",
    headlineIcon: "text-neutral-900",
  },
  wall: {
    dot: "bg-neutral-400",
    borderIdle: "border-neutral-200",
    borderActive: "border-neutral-400",
    ring: "ring-neutral-400/25",
    accentText: "text-neutral-700",
    chipBg: "bg-neutral-500/10",
    tagBg: "bg-neutral-500/15",
    headlineBg: "bg-neutral-500/5",
    headlineBorder: "border-neutral-400/40",
    headlineIcon: "text-neutral-500",
  },
}

export const HEADLINE_ICON: Record<
  ContributionTier["headline"]["icon"],
  typeof Users
> = {
  community: Users,
  office: Briefcase,
  meeting: MessagesSquare,
  photo: Frame,
  wall: Fingerprint,
}

/**
 * Tier card used in both the donation modal (interactive radio) and the
 * Become a Sponsor section (display only). Pass `onSelect` to opt in to
 * radio-style interaction.
 */
export function TierCard({
  tier,
  selected,
  onSelect,
}: {
  tier: ContributionTier
  selected?: boolean
  onSelect?: () => void
}) {
  const theme = TIER_THEME[tier.id]
  const HeadlineIcon = HEADLINE_ICON[tier.headline.icon]
  const priceLabel =
    tier.id === "founding" ? `${formatEUR(tier.price)}+` : formatEUR(tier.price)
  const interactive = Boolean(onSelect)

  return (
    <div
      {...(interactive
        ? {
            role: "radio",
            "aria-checked": selected,
            tabIndex: 0,
            onClick: onSelect,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onSelect?.()
              }
            },
          }
        : {})}
      className={cn(
        "group relative flex h-full flex-col rounded-xl border bg-card p-4 transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        interactive && "cursor-pointer",
        selected
          ? "border-accent shadow-md ring-2 ring-accent/20"
          : "border-border shadow-sm"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={cn(
            "text-[11px] font-bold uppercase tracking-[0.08em]",
            theme.accentText
          )}
        >
          {tier.name}
        </h3>
        {tier.tag && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
              theme.tagBg,
              theme.accentText
            )}
          >
            <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} aria-hidden />
            {tier.tag}
          </span>
        )}
      </div>

      <p
        className={cn(
          "mt-1 text-2xl font-bold tabular-nums leading-none",
          theme.accentText
        )}
      >
        {priceLabel}
      </p>

      <div className="mt-3 space-y-1.5">
        {tier.headline.size && (
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold tabular-nums",
              theme.chipBg,
              theme.accentText
            )}
          >
            {tier.headline.size}
          </span>
        )}
        <div className="flex items-start gap-2">
          <HeadlineIcon
            className={cn("mt-0.5 h-4 w-4 shrink-0", theme.headlineIcon)}
            strokeWidth={2}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-snug text-foreground">
              {tier.headline.title}
            </p>
            {tier.headline.subtitle && (
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                {tier.headline.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <ul className="mt-auto space-y-1 border-t border-border/60 pt-3 text-[11px] leading-snug text-muted-foreground">
        {Array.from({ length: MAX_BENEFIT_ROWS }).map((_, i) => {
          const benefit = tier.benefits[i]
          return benefit ? (
            <li key={benefit} className="flex gap-1.5">
              <Check
                className="mt-0.5 h-3 w-3 shrink-0"
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <span>{benefit}</span>
            </li>
          ) : (
            <li
              key={`empty-${i}`}
              aria-hidden="true"
              className="invisible flex gap-1.5"
            >
              <Check className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={2.5} />
              <span>-</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Wall-of-Fame disclaimer row shown under the tier cards. */
export function WallOfFameRow() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-sm">
      <Fingerprint
        className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500"
        strokeWidth={2}
        aria-hidden="true"
      />
      <p className="text-foreground">
        <span className="font-semibold">Donate €50+</span> and you&apos;ll be
        added to the Wall of Fame: fingerprint, name and generation in grey on
        the wall.
      </p>
    </div>
  )
}
