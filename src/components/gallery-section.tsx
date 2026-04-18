import Image from "next/image"

const placeholders = [
  { label: "Coworking Space", src: "/office/room2.jpg", span: "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2" },
  { label: "Meeting Room", src: "/office/room4.jpg", span: "" },
  { label: "Deep Work Area", src: "/office/room3.jpg", span: "" },
  { label: "Incubation Space", src: "/office/room5.jpg", span: "" },
  { label: "Common Space", src: "/office/room1.jpg", span: "" },
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
              className={`group relative overflow-hidden rounded-xl border border-border bg-card/50 ${item.span}`}
            >
              <Image
                src={item.src}
                alt={item.label}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <span className="text-xs font-medium text-white">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
