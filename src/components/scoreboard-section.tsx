import type { Donation } from "@/lib/supabase"
import { formatEUR } from "@/lib/utils"
import { Trophy, Medal, Award, Heart } from "lucide-react"

const rankIcons = [Trophy, Medal, Award]

function timeAgo(dateStr: string) {
  const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (s < 60) return "just now"
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export function ScoreboardSection({ donations }: { donations: Donation[] }) {
  const sorted = [...donations].sort((a, b) => b.amount - a.amount)

  return (
    <section id="scoreboard" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
          Supporters
        </h2>

        {sorted.length === 0 ? (
          <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
            <Heart className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" aria-hidden="true" />
            <p className="text-muted-foreground">
              No donations yet be the first!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((d, i) => {
              const Icon = rankIcons[i] ?? null
              return (
                <div
                  key={d.id}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                    i < 3
                      ? "border-accent/20 bg-accent/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                    {Icon ? (
                      <Icon
                        className={`h-4 w-4 ${
                          i === 0
                            ? "text-yellow-500"
                            : i === 1
                              ? "text-gray-400"
                              : "text-amber-600"
                        }`}
                      />
                    ) : (
                      <span>#{i + 1}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold">
                        {d.donor_name}
                      </p>
                      {d.generation && (
                        <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                          {d.generation}
                        </span>
                      )}
                      {d.status === "confirmed" ? (
                        <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          received
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                          committed
                        </span>
                      )}
                    </div>
                    {d.message && (
                      <p className="truncate text-xs text-muted-foreground">
                        &ldquo;{d.message}&rdquo;
                      </p>
                    )}
                  </div>

                   <div className="text-right">
                     <p className="text-sm font-bold text-accent">
                       {formatEUR(d.amount)}
                     </p>
                     <p className="text-[11px] text-muted-foreground/60">
                       {timeAgo(d.created_at)}
                     </p>
                   </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
