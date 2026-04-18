import Image from "next/image"
import { ROOMS } from "@/lib/constants"
import { formatEUR, cn } from "@/lib/utils"
import { ImageIcon, Lock, CheckCircle2 } from "lucide-react"

export function RoomProgressSection({ totalRaised }: { totalRaised: number }) {
  const sortedRooms = [...ROOMS].sort((a, b) => a.order - b.order)

  return (
    <section id="rooms" className="py-16 sm:py-20">
      {/* Heading — stays in the safe zone so it aligns with sibling sections */}
      <div className="mx-auto mb-8 max-w-[1440px] px-6 lg:pl-24 lg:pr-[456px]">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Office Loading...
        </h2>
        <p className="mt-2 text-muted-foreground">
          Unlock rooms as we hit our funding goals
        </p>
      </div>

      {/* Scroll row — full viewport width. On lg+ its right padding is wider
          than the floating progress card so the last card can scroll under
          the card cleanly. Left padding matches the heading + section text
          (px-6 inside the centered max-w-[1440px] container) so card #1
          lines up with the heading and the body text above. */}
      <div
        className={cn(
          "flex snap-x snap-proximity gap-4 overflow-x-auto scroll-smooth pb-6",
          "pl-6 pr-6 scroll-pl-6",
          "lg:pl-[max(6rem,calc((100vw-1440px)/2+6rem))] lg:pr-[480px]",
          "lg:scroll-pl-[max(6rem,calc((100vw-1440px)/2+6rem))]"
        )}
      >
        {sortedRooms.map((room, index) => {
          const cumulativeBefore = sortedRooms
            .slice(0, index)
            .reduce((s, r) => s + r.sponsorGoal, 0)
          const raised = Math.max(
            0,
            Math.min(room.sponsorGoal, totalRaised - cumulativeBefore)
          )
          const isFunded = raised >= room.sponsorGoal
          const isPartial = raised > 0 && !isFunded
          const percentage = Math.min((raised / room.sponsorGoal) * 100, 100)

          return (
            <div
              key={room.id}
              className={cn(
                "flex w-64 shrink-0 snap-start flex-col overflow-hidden rounded-xl border bg-card",
                isFunded
                  ? "border-green-500/40"
                  : isPartial
                    ? "border-accent/30"
                    : "border-border opacity-60"
              )}
            >
              <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-secondary/50">
                {room.imagePlaceholder ? (
                  <Image
                    src={room.imagePlaceholder}
                    alt={room.name}
                    fill
                    sizes="256px"
                    className={cn("object-cover", !isFunded && !isPartial && "opacity-60")}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground/25">
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-[10px]">Coming soon</span>
                  </div>
                )}

                <div className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-[10px] font-bold text-muted-foreground ring-1 ring-border">
                  {index + 1}
                </div>

                {isFunded && (
                  <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Funded ✓
                  </span>
                )}

                {!isFunded && !isPartial && !room.imagePlaceholder && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-muted-foreground/20" />
                  </div>
                )}
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
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                      {room.sqm} m²
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-sm font-semibold text-foreground">
                      {formatEUR(room.monthlyRent)}
                    </span>
                    {" "}/month
                  </p>
                  <p className="text-[10px] text-muted-foreground/70">
                    + 3 month deposit
                  </p>
                </div>

                <div className="mt-auto pt-1">
                  {isFunded ? (
                    <div className="space-y-1.5">
                      <p className="flex items-center gap-1 text-[11px] font-semibold text-green-600">
                        <CheckCircle2 className="h-3 w-3" />
                        {formatEUR(room.sponsorGoal)} funded
                      </p>
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
                        aria-label={`${room.name} funding progress`}
                        aria-valuenow={Math.round(percentage)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        Needed
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
    </section>
  )
}
