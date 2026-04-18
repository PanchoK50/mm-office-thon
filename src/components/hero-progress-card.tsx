"use client"

import { useEffect, useState } from "react"
import { Check, Heart, Share2 } from "lucide-react"
import { formatEUR, formatTimeAgo } from "@/lib/utils"
import { DonationModal } from "@/components/donation-modal"

/* Single calm green tone. Used at 100% for solids, in a soft fill variant
   for partials, paired with a neutral grey track so the card doesn't drown
   in green. */
const GREEN = "#34d399"        // emerald-400
const GREEN_FILL = "rgba(52, 211, 153, 0.28)"
const TRACK = "#f3f4f6"        // gray-100 — neutral

export type HeroMilestone = {
  label: string
  raised: number
  goal: number
}

export type HeroDonation = {
  id: number
  donor_name: string
  generation: string | null
  amount: number
  created_at: string
}

export type HeroGenerationTotal = {
  generation: string
  total: number
}

interface HeroProgressCardProps {
  totalRaised: number
  totalGoal: number
  milestones: HeroMilestone[]
  recentDonations: HeroDonation[]
  generationTotals: HeroGenerationTotal[]
}

export function HeroProgressCard({
  totalGoal,
  milestones,
  recentDonations,
  generationTotals,
}: HeroProgressCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const nextIdx = milestones.findIndex((m) => m.raised < m.goal)
  const nextMilestone =
    nextIdx === -1 ? milestones[milestones.length - 1] : milestones[nextIdx]
  const nextPct =
    nextIdx === -1
      ? 100
      : Math.min(
          100,
          Math.round((nextMilestone.raised / nextMilestone.goal) * 100)
        )
  const raisedTowardNext = nextMilestone?.raised ?? 0
  const goalOfNext = nextMilestone?.goal ?? totalGoal

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-[0_20px_50px_-18px_rgba(0,0,0,0.25),0_4px_12px_-4px_rgba(0,0,0,0.06)]">
      <MilestoneStrip milestones={milestones} />

      <NextMilestoneHeadline
        percent={nextPct}
        label={nextMilestone?.label ?? "Kaution"}
        raisedTowardNext={raisedTowardNext}
        goalOfNext={goalOfNext}
        allDone={nextIdx === -1}
      />

      <ActionButtons onSupport={() => setModalOpen(true)} />

      <hr className="divider-fade" />

      <RecentDonationsList donations={recentDonations.slice(0, 4)} />

      <hr className="divider-fade" />

      <GenerationBarRace totals={generationTotals} />

      <DonationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}

/* ---------------- Milestone strip ---------------- */

function MilestoneStrip({ milestones }: { milestones: HeroMilestone[] }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex gap-1.5" aria-label="Room milestones">
      {milestones.map((m) => {
        const pct = Math.min(100, (m.raised / m.goal) * 100)
        const done = m.raised >= m.goal
        const title = `${m.label}: ${formatEUR(m.raised)} / ${formatEUR(m.goal)}`

        if (done) {
          return (
            <div
              key={m.label}
              title={title}
              className="flex h-6 flex-1 items-center justify-center rounded-md"
              style={{ backgroundColor: GREEN }}
            >
              <Check
                className="h-3 w-3 text-neutral-900"
                strokeWidth={3}
                aria-hidden="true"
              />
            </div>
          )
        }

        return (
          <div
            key={m.label}
            title={title}
            className="relative h-6 flex-1 overflow-hidden rounded-md"
            style={{ backgroundColor: TRACK }}
          >
            <div
              className="h-full transition-[width] duration-1000 ease-out"
              style={{
                width: mounted ? `${pct}%` : "0%",
                backgroundColor: GREEN_FILL,
              }}
              aria-hidden="true"
            />
          </div>
        )
      })}
    </div>
  )
}

/* ---------------- Circular progress + headline ---------------- */

function NextMilestoneHeadline({
  percent,
  label,
  raisedTowardNext,
  goalOfNext,
  allDone,
}: {
  percent: number
  label: string
  raisedTowardNext: number
  goalOfNext: number
  allDone: boolean
}) {
  return (
    <div className="flex items-center gap-4">
      <CircularProgress percent={percent} size={84} stroke={8} />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {allDone ? "All milestones reached" : "Next milestone"}
        </p>
        <p className="mt-0.5 truncate text-base font-bold leading-tight text-foreground">
          {label}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">
            {formatEUR(raisedTowardNext)}
          </span>{" "}
          of {formatEUR(goalOfNext)}
        </p>
      </div>
    </div>
  )
}

function CircularProgress({
  percent,
  size,
  stroke,
}: {
  percent: number
  size: number
  stroke: number
}) {
  const [animated, setAnimated] = useState(0)
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - animated / 100)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(percent), 80)
    return () => clearTimeout(t)
  }, [percent])

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={TRACK}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={GREEN}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1.1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold tabular-nums">
          {Math.round(animated)}%
        </span>
      </div>
    </div>
  )
}

/* ---------------- Support + Share ---------------- */

function ActionButtons({ onSupport }: { onSupport: () => void }) {
  const [shareState, setShareState] = useState<"idle" | "copied">("idle")

  const handleShare = async () => {
    const shareData = {
      title: "Manage and More goes Kunstlabor",
      text: "Help us fund the first Manage and More office at Kunstlabor München.",
      url: typeof window !== "undefined" ? window.location.href : "",
    }

    try {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        await navigator.share(shareData)
        return
      }
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard?.writeText
      ) {
        await navigator.clipboard.writeText(shareData.url)
        setShareState("copied")
        setTimeout(() => setShareState("idle"), 2000)
      }
    } catch {
      /* user cancelled — no-op */
    }
  }

  return (
    <div id="support" className="grid grid-cols-2 gap-2.5">
      <button
        type="button"
        onClick={onSupport}
        className="flex h-11 items-center justify-center gap-2 rounded-lg bg-accent text-sm font-bold text-accent-foreground shadow-sm shadow-accent/20 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 active:translate-y-0"
      >
        <Heart className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        Support
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="flex h-11 items-center justify-center gap-2 rounded-lg border-[1.5px] border-accent bg-background text-sm font-bold text-accent transition-all hover:-translate-y-0.5 hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 active:translate-y-0"
      >
        <Share2 className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        {shareState === "copied" ? "Copied!" : "Share"}
      </button>
    </div>
  )
}

/* ---------------- Live donations (top 4) ---------------- */

function RecentDonationsList({ donations }: { donations: HeroDonation[] }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ backgroundColor: GREEN }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: GREEN }}
          />
        </span>
        <h4 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Live donations
        </h4>
      </div>

      {donations.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No donations yet. Be the first.
        </p>
      ) : (
        <ul className="space-y-2">
          {donations.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium leading-tight text-foreground">
                  {d.donor_name}
                  {d.generation && (
                    <span className="ml-1.5 text-[11px] font-normal text-muted-foreground">
                      · {d.generation}
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {formatTimeAgo(d.created_at)}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                {formatEUR(d.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ---------------- Generation bar race (top 3) ---------------- */

function GenerationBarRace({ totals }: { totals: HeroGenerationTotal[] }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120)
    return () => clearTimeout(t)
  }, [])

  const top = totals.slice(0, 3)
  const max = top[0]?.total ?? 1

  return (
    <div className="space-y-2.5">
      <h4 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Top generations
      </h4>

      {top.length === 0 ? (
        <p className="text-xs text-muted-foreground">No data yet.</p>
      ) : (
        <ul className="space-y-1.5">
          {top.map((g) => {
            const width = Math.max((g.total / max) * 100, 6)
            return (
              <li key={g.generation} className="flex items-center gap-3">
                <span className="w-8 shrink-0 text-[11px] font-semibold text-muted-foreground">
                  {g.generation}
                </span>
                <div
                  className="relative h-3.5 flex-1 overflow-hidden rounded"
                  style={{ backgroundColor: TRACK }}
                >
                  <div
                    className="h-full transition-[width] duration-1000 ease-out"
                    style={{
                      width: mounted ? `${width}%` : "0%",
                      backgroundColor: GREEN,
                    }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-[11px] font-semibold tabular-nums text-foreground">
                  {formatEUR(g.total)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
