import { Building2, DoorOpen, Award, Fingerprint } from "lucide-react"
import { SPONSORING_TIERS } from "@/lib/constants"
import { formatEUR } from "@/lib/utils"

const tierIcons = [Building2, DoorOpen, Award, Fingerprint]

export function BenefitsSection() {
  return (
    <section id="benefits" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Become a Sponsor
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Choose your level of support &mdash; every tier makes the office
            happen.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SPONSORING_TIERS.map((tier, i) => {
            const Icon = tierIcons[i]
            const remaining =
              tier.available !== null ? tier.available - tier.taken : null

            return (
              <div
                key={tier.id}
                className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Icon
                        className="h-5 w-5 text-accent"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold leading-snug">
                        {tier.name}
                      </h3>
                      {remaining !== null && (
                        <span className="text-xs text-muted-foreground">
                          {remaining} of {tier.available} remaining
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-lg font-bold text-accent">
                    {tier.price > 0 ? formatEUR(tier.price) : "< " + formatEUR(5000)}
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {tier.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
