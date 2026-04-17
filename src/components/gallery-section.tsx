import { ImageIcon } from "lucide-react"

const placeholders = [
  { label: "Coworking Space", span: "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2" },
  { label: "Meeting Room", span: "" },
  { label: "Deep Work Area", span: "" },
  { label: "Incubation Space", span: "" },
  { label: "Common Space", span: "" },
]

export function GallerySection() {
  return (
    <section id="gallery" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
          Vision
        </h2>

        <div className="grid auto-rows-[140px] grid-cols-2 gap-2 sm:auto-rows-[180px] sm:grid-cols-4 sm:gap-3">
          {placeholders.map((item) => (
            <div
              key={item.label}
              className={`group flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/50 p-3 text-center transition-colors hover:border-accent/40 ${item.span}`}
            >
              <ImageIcon className="h-6 w-6 text-muted-foreground/40 group-hover:text-accent/60" aria-hidden="true" />
              <span className="text-xs font-medium text-muted-foreground/60 group-hover:text-muted-foreground">
                {item.label}
              </span>
              <span className="text-[10px] text-muted-foreground/40">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
