import { ROOMS } from "@/lib/constants"
import { formatEUR, cn } from "@/lib/utils"
import { ImageIcon, Lock, CheckCircle2 } from "lucide-react"

export function RoomProgressSection() {
  const sortedRooms = [...ROOMS].sort((a, b) => a.order - b.order)

  return (
    <section id="rooms" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Office Loading<span className="text-accent">...</span>
          </h2>
          <p className="mt-2 text-muted-foreground">
            Unlock rooms as we hit our funding goals
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 md:grid-cols-3 xl:grid-cols-5">
          {sortedRooms.map((room, index) => {
            const raised = room.sponsors.reduce((s, sp) => s + sp.amount, 0)
            const isFunded = raised >= room.sponsorGoal
            const isPartial = raised > 0 && !isFunded
            const percentage = Math.min((raised / room.sponsorGoal) * 100, 100)

            return (
              <div
                key={room.id}
                className={cn(
                  "flex shrink-0 w-64 flex-col rounded-xl border bg-card overflow-hidden sm:w-auto",
                  isFunded
                    ? "border-green-500/40"
                    : isPartial
                      ? "border-accent/30"
                      : "border-border opacity-60"
                )}
              >
                <div className="relative flex aspect-video items-center justify-center bg-secondary/50">
                  <div className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-[10px] font-bold text-muted-foreground ring-1 ring-border">
                    {index + 1}
                  </div>

                  {isFunded && (
                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Funded ✓
                    </span>
                  )}

                  {!isFunded && !isPartial && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="h-6 w-6 text-muted-foreground/20" />
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-1 text-muted-foreground/25">
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-[10px]">Coming soon</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Room {room.id}
                    </p>
                    <h3 className="text-sm font-bold leading-tight">
                      {room.name}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                        {room.type}
                      </span>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                        {room.sqm} m²
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    <span className="text-sm font-semibold text-foreground">
                      {formatEUR(room.monthlyRent)}
                    </span>
                    {" "}/month
                  </p>

                  <div className="mt-auto pt-1">
                    {isFunded ? (
                      <div className="space-y-1.5">
                        <p className="flex items-center gap-1 text-[11px] font-semibold text-green-600">
                          <CheckCircle2 className="h-3 w-3" />
                          {formatEUR(raised)} raised
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {room.sponsors.map((sp, i) => (
                            <span
                              key={`${sp.name}-${i}`}
                              className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-700"
                            >
                              {sp.anonymous ? "Anonymous" : sp.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : isPartial ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-accent">
                            {formatEUR(raised)}
                          </span>
                          <span className="text-muted-foreground">
                            of {formatEUR(room.sponsorGoal)}
                          </span>
                        </div>
                        <div
                          className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
                          role="progressbar"
                          aria-valuenow={Math.round(percentage)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {room.sponsors.map((sp, i) => (
                            <span
                              key={`${sp.name}-${i}`}
                              className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent"
                            >
                              {sp.anonymous ? "Anonymous" : sp.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          Available
                        </span>
                        <p className="mt-1.5 text-sm font-bold">
                          {formatEUR(room.sponsorGoal)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
