import type { Donation } from "@/lib/supabase"
import { Heart } from "lucide-react"
import { DonorRow, type GroupedDonor } from "@/components/donor-row"

function groupKey(d: Donation): string {
  return `${d.donor_name.trim().toLowerCase()}::${(d.generation ?? "").trim().toLowerCase()}`
}

function groupDonations(donations: Donation[]): GroupedDonor[] {
  const map = new Map<string, Donation[]>()
  for (const d of donations) {
    const key = groupKey(d)
    const list = map.get(key)
    if (list) list.push(d)
    else map.set(key, [d])
  }

  return Array.from(map.entries()).map(([key, donations]) => {
    const sorted = [...donations].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    const latest = sorted[0]
    return {
      groupKey: key,
      donorName: latest.donor_name,
      generation: latest.generation,
      totalAmount: donations.reduce((sum, d) => sum + d.amount, 0),
      hasConfirmed: donations.some((d) => d.status === "confirmed"),
      latestCreatedAt: latest.created_at,
      donations: sorted,
    }
  })
}

export function ScoreboardSection({ donations }: { donations: Donation[] }) {
  const groups = groupDonations(donations)
  const pending = groups.filter((g) => g.totalAmount === 0)
  const ranked = groups
    .filter((g) => g.totalAmount !== 0)
    .sort((a, b) => b.totalAmount - a.totalAmount)
  const sorted = [...ranked, ...pending]

  return (
    <section id="scoreboard" className="px-6 py-16 sm:py-20 lg:px-24">
      <div className="max-w-3xl lg:max-w-none">
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
            {sorted.map((group, i) => {
              const rank = group.totalAmount === 0 ? -1 : i
              return (
                <DonorRow
                  key={group.groupKey}
                  group={group}
                  rank={rank}
                />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
