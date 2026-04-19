"use client"

import { useState } from "react"
import { CARD_TIERS, TierCard, WallOfFameRow } from "@/components/tier-card"
import { DonationModal } from "@/components/donation-modal"

export function BenefitsSection() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section id="benefits" className="px-6 py-16 sm:py-20 lg:px-24">
      <div className="max-w-3xl lg:max-w-none">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Become a Sponsor
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Choose your level of support. Every tier makes the office happen.
          </p>
        </div>

        <div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          role="group"
          aria-label="Sponsorship tiers"
        >
          {CARD_TIERS.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              onSelect={() => setModalOpen(true)}
            />
          ))}
        </div>

        <div className="mt-4">
          <WallOfFameRow />
        </div>

        <div className="mt-4 space-y-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Good to know:</span>
          </p>
          <ul className="list-disc space-y-1 pl-4">
            <li>
              For donations over <span className="font-medium text-foreground">300&nbsp;&euro;</span>, we
              can issue a donation receipt (Spendenbescheinigung).
            </li>
            <li>
              For donations over <span className="font-medium text-foreground">1.000&nbsp;&euro;</span>, you
              don&apos;t have to transfer right now — feel free to transfer
              until <span className="font-medium text-foreground">Friday the 24th</span>.
            </li>
          </ul>
        </div>
      </div>

      <DonationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  )
}
