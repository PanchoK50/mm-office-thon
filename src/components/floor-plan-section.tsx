import Image from "next/image"
import { ROOMS, TOTAL_MONTHLY_RENT } from "@/lib/constants"
import { formatEUR } from "@/lib/utils"

export function FloorPlanSection() {
  const totalSqm = ROOMS.reduce((s, r) => s + r.sqm, 0)

  return (
    <section id="floor-plan" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
          The Space
        </h2>

        <div className="mb-6 overflow-hidden rounded-xl border border-border">
          <Image
            src="/grundriss.jpeg"
            alt="Floor plan — 2nd floor, Kunstlabor München"
            width={1200}
            height={800}
            className="w-full h-auto"
            priority
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-3 py-3 text-center">
            <span className="text-lg font-bold text-foreground">{ROOMS.length}</span>
            <span className="text-xs text-muted-foreground">Rooms</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-3 py-3 text-center">
            <span className="text-lg font-bold text-foreground">{totalSqm.toFixed(0)} m²</span>
            <span className="text-xs text-muted-foreground">Total Area</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-3 py-3 text-center">
            <span className="text-lg font-bold text-foreground">{formatEUR(TOTAL_MONTHLY_RENT)}</span>
            <span className="text-xs text-muted-foreground">Rent / month</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-3 py-3 text-center">
            <span className="text-lg font-bold text-foreground">OG 2</span>
            <span className="text-xs text-muted-foreground">Kunstlabor</span>
          </div>
        </div>
      </div>
    </section>
  )
}
