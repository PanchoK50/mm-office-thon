export function StorySection() {
  return (
    <section id="story" className="px-6 py-16 sm:py-20 lg:px-24">
      <div className="max-w-3xl lg:max-w-none">
        <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Why this matters
        </h2>
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
        
          {/* <p>
            This changes with this office at{" "}
            <span className="font-semibold text-foreground">Kunstlabor München</span>.
           
          </p> */}
          <ul className="space-y-2 pt-1">
            <li className="flex items-start gap-3">
              <span
                className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                aria-hidden="true"
              />
              <span>
                <span className="font-semibold text-foreground">
                  BDDD comes to the city.
                </span>{" "}
                No more Garching commute our weekly home moves into Munich.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span
                className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                aria-hidden="true"
              />
              <span>
                <span className="font-semibold text-foreground">
                  A homebase for the community.
                </span>{" "}
                Coworking, incubation rooms, and meeting spaces the MM
                crew finally under one roof.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span
                className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                aria-hidden="true"
              />
              <span>
                <span className="font-semibold text-foreground">
                  A stage for our events.
                </span>{" "}
                Workshops, Pitch Nights and even the Demo Day
                hosted in a space that&apos;s actually ours.
              </span>
            </li>
          </ul>
          <p>
           With your support we secure the rooms, build the space, and open
            the doors to the next generation of founders.
          </p>
        </div>
      </div>
    </section>
  )
}
