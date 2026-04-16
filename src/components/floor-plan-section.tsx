import { MapPin } from "lucide-react"

const stats = [
  { label: "5 Meeting Rooms" },
  { label: "100+ sqm Open Space" },
  { label: "Focus Work Areas" },
  { label: "Startup Offices" },
]

export function FloorPlanSection() {
  return (
    <section id="floor-plan" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
          The Space
        </h2>

        {/* Floor plan placeholder */}
        <div className="mb-6 flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50">
          <div className="flex flex-col items-center gap-2 text-center">
            <MapPin className="h-8 w-8 text-muted-foreground/40" aria-hidden="true" />
            <p className="text-sm font-medium text-muted-foreground/60">
              Floor plan coming soon
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-center rounded-lg border border-border bg-card px-3 py-2 text-center"
            >
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
