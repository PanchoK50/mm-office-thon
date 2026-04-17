"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DonationModal } from "@/components/donation-modal"

export function HeroCTA() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Button
        size="lg"
        className="rounded-full bg-accent px-8 text-accent-foreground hover:bg-accent/90"
        onClick={() => setModalOpen(true)}
      >
        Become a Founding Member
      </Button>
      <DonationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
