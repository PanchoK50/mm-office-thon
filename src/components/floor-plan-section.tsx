import Image from "next/image"
import { MapPin } from "lucide-react"
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

        <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
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

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
            <h3 className="text-lg font-semibold">Location</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Kunstlabor 2 &mdash; Dachauer Str. 90, 80335 München
          </p>
          <div className="overflow-hidden rounded-xl border border-border">
            <iframe
              title="Kunstlabor München location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=11.5550%2C48.1490%2C11.5622%2C48.1527&layer=mapnik&marker=48.1508501%2C11.5585879"
              width="100%"
              height="300"
              className="w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          <a
            href="https://www.openstreetmap.org/?mlat=48.1508501&mlon=11.5585879#map=17/48.1508501/11.5585879"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Open in Maps
          </a>
        </div>
      </div>
    </section>
  )
}
