"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DonationModal } from "@/components/donation-modal"

export function StickyHeader() {
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Image
              src="/logos/mm-logo.webp"
              alt="manage&more"
              width={80}
              height={28}
              className="h-7 w-auto"
            />
            <span className="text-xs text-muted-foreground">×</span>
            <Image
              src="/logos/kunstlabor-logo.webp"
              alt="Kunstlabor"
              width={80}
              height={28}
              className="h-7 w-auto"
            />
          </div>

          <Button
            size="sm"
            className="rounded-full bg-accent px-5 text-sm text-accent-foreground hover:bg-accent/90"
            onClick={() => setModalOpen(true)}
          >
            Become a Founding Member
          </Button>
        </div>
      </header>

      <DonationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
