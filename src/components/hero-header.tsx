"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { DonationModal } from "@/components/donation-modal"

const MM_URL = "https://www.manageandmore.de"
const KUNSTLABOR_URL = "https://kunstlabor.org/kunst/atelier-mieten-muenchen/"

export function HeroHeader() {
  const [modalOpen, setModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <div
        className={`sticky top-0 z-40 transition-[background-color,backdrop-filter,box-shadow] duration-300 ${
          scrolled
            ? "bg-white/85 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
            : "bg-white"
        }`}
      >
        {/* Accent top hairline in brand cyan */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />

        <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-6 py-3.5 sm:py-4 lg:pl-24 lg:pr-[456px]">
          {/* Left: logos with elegant vertical divider */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <a
              href={MM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block transition-opacity hover:opacity-80"
              aria-label="Manage and More, opens in new tab"
            >
              <Image
                src="/logos/mm-logo.webp"
                alt="Manage and More"
                width={160}
                height={56}
                className="h-6 w-auto sm:h-8"
                priority
              />
            </a>
            <span
              aria-hidden="true"
              className="h-6 w-px bg-gradient-to-b from-transparent via-black/25 to-transparent sm:h-7"
            />
            <a
              href={KUNSTLABOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block transition-opacity hover:opacity-80"
              aria-label="Kunstlabor München, opens in new tab"
            >
              <Image
                src="/logos/kunstlabor-logo.webp"
                alt="Kunstlabor München"
                width={160}
                height={56}
                className="h-6 w-auto sm:h-8"
                priority
              />
            </a>
          </div>

          {/* Middle: live-campaign pill */}
          <div className="hidden flex-1 justify-center md:flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Live Fundraiser · MM Office
            </span>
          </div>

          {/* Right: Donate CTA */}
          <div className="ml-auto flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="group inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-accent hover:shadow-md sm:px-5"
            >
              <span className="hidden sm:inline">Support the Office</span>
              <span className="sm:hidden">Donate</span>
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      <DonationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
