import { supabase } from "@/lib/supabase"
import type { GenerationTotal } from "@/lib/supabase"
import { formatEUR } from "@/lib/utils"
import { Trophy, Medal, Award, Users } from "lucide-react"

const rankIcons = [Trophy, Medal, Award]
const rankColors = ["text-yellow-500", "text-gray-400", "text-amber-600"]

async function getGenerationTotals(): Promise<GenerationTotal[]> {
  const { data } = await supabase
    .from("donations")
    .select("generation, amount")
    .not("generation", "is", null)

  if (!data || data.length === 0) return []

  const map = new Map<string, { total: number; donor_count: number }>()

  for (const row of data) {
    const gen = row.generation as string
    const entry = map.get(gen) ?? { total: 0, donor_count: 0 }
    entry.total += row.amount
    entry.donor_count += 1
    map.set(gen, entry)
  }

  return Array.from(map.entries())
    .map(([generation, { total, donor_count }]) => ({
      generation,
      total,
      donor_count,
    }))
    .sort((a, b) => b.total - a.total)
}

export async function GenerationRaceSection() {
  const totals = await getGenerationTotals()
  const maxTotal = totals[0]?.total ?? 1

  return (
    <section id="generation-race" className="px-6 py-16 sm:py-20 lg:px-24">
      <div className="max-w-3xl lg:max-w-none">
        <div className="mb-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
            <Trophy className="h-6 w-6 text-accent" aria-hidden="true" />
            Generation Race
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Which generation contributes the most?
          </p>
        </div>

        {totals.length === 0 ? (
          <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" aria-hidden="true" />
            <p className="text-muted-foreground">
              No generation data yet donate and represent yours!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {totals.map((g, i) => {
              const Icon = rankIcons[i] ?? null
              const barWidth = Math.max((g.total / maxTotal) * 100, 4)

              return (
                <div
                  key={g.generation}
                  className={`rounded-xl border px-4 py-3 ${
                    i < 3
                      ? "border-accent/20 bg-accent/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                      {Icon ? (
                        <Icon className={`h-4 w-4 ${rankColors[i]}`} />
                      ) : (
                        <span>#{i + 1}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-semibold">
                          {g.generation}
                        </p>
                        <div className="shrink-0 text-right">
                          <span className="text-sm font-bold text-accent">
                            {formatEUR(g.total)}
                          </span>
                          <span className="ml-1.5 text-xs text-muted-foreground">
                            {g.donor_count}{" "}
                            {g.donor_count === 1 ? "donor" : "donors"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full ${
                            i === 0
                              ? "bg-yellow-500"
                              : i === 1
                                ? "bg-gray-400"
                                : i === 2
                                  ? "bg-amber-600"
                                  : "bg-accent/60"
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
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
