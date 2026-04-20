import type { Donation } from "@/lib/supabase"
import { formatEUR } from "@/lib/utils"
import { Trophy, Medal, Award } from "lucide-react"

const rankIcons = [Trophy, Medal, Award]

function timeAgo(dateStr: string) {
  const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (s < 60) return "just now"
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export type GroupedDonor = {
  groupKey: string
  donorName: string
  generation: string | null
  totalAmount: number
  hasConfirmed: boolean
  latestCreatedAt: string
  donations: Donation[]
}

export function DonorRow({
  group,
  rank,
}: {
  group: GroupedDonor
  rank: number
}) {
  const isPending = group.totalAmount === 0
  const Icon = isPending ? null : (rankIcons[rank] ?? null)
  const isMulti = group.donations.length > 1

  return (
    <div>
      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
          isPending
            ? "border-sky-500/30 bg-sky-500/5"
            : rank < 3
              ? "border-accent/20 bg-accent/5"
              : "border-border bg-card"
        }`}
      >
        {/* Rank badge */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
          {isPending ? (
            <span className="text-sky-600 dark:text-sky-400">?</span>
          ) : Icon ? (
            <Icon
              className={`h-4 w-4 ${
                rank === 0
                  ? "text-yellow-500"
                  : rank === 1
                    ? "text-gray-400"
                    : "text-amber-600"
              }`}
            />
          ) : (
            <span>#{rank + 1}</span>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-sm font-semibold">{group.donorName}</p>
            {group.generation && (
              <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                {group.generation}
              </span>
            )}
            {group.hasConfirmed ? (
              <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                received
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                committed
              </span>
            )}
            {isMulti && (
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {group.donations.length} donations
              </span>
            )}
          </div>
          {!isMulti && group.donations[0]?.message && (
            <p className="text-xs text-muted-foreground">
              &ldquo;{group.donations[0].message}&rdquo;
            </p>
          )}
        </div>

        {/* Amount + time */}
        <div className="text-right">
          <p
            className={`text-sm font-bold ${
              isPending
                ? "text-sky-600 dark:text-sky-400"
                : "text-accent"
            }`}
          >
            {isPending ? "? €" : formatEUR(group.totalAmount)}
          </p>
          <p className="text-[11px] text-muted-foreground/60">
            {timeAgo(group.latestCreatedAt)}
          </p>
        </div>
      </div>

      {/* Sub-rows for multi-donation donors */}
      {isMulti && (
        <div className="ml-11 mt-1 space-y-1">
          {group.donations.map((d, i) => {
            const isLast = i === group.donations.length - 1
            return (
              <div
                key={d.id}
                className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-xs"
              >
                <span className="mt-0.5 shrink-0 text-muted-foreground/40">
                  {isLast ? "└" : "├"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold tabular-nums">
                      {d.amount === 0 ? "? €" : formatEUR(d.amount)}
                    </span>
                    {d.status === "confirmed" ? (
                      <span className="shrink-0 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        received
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                        committed
                      </span>
                    )}
                    <span className="text-muted-foreground/60">
                      {timeAgo(d.created_at)}
                    </span>
                  </div>
                  {d.message && (
                    <p className="mt-0.5 text-muted-foreground">
                      &ldquo;{d.message}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
