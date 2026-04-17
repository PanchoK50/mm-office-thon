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
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-md px-4 py-3 transition-transform duration-300 sm:bottom-auto sm:top-0 sm:border-b sm:border-t-0 ${visible ? "translate-y-0" : "translate-y-full sm:-translate-y-full"}`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 sm:justify-between">
          <div className="hidden items-center gap-3 sm:flex">
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
            className="w-full rounded-full bg-accent px-6 text-accent-foreground hover:bg-accent/90 sm:w-auto"
            onClick={() => setModalOpen(true)}
          >
            Become a Founding Member
          </Button>
        </div>
      </div>

      <DonationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
