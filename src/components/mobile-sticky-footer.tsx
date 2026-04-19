"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { DonationModal } from "@/components/donation-modal"

const GREEN = "#34d399"
const TRACK = "#f3f4f6"

interface MobileStickyFooterProps {
  percent: number
  label: string
  totalRaised: number
  totalGoal: number
}

export function MobileStickyFooter({ percent, label, totalRaised, totalGoal }: MobileStickyFooterProps) {
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [animated, setAnimated] = useState(0)
  const totalPct = Math.min(100, Math.round((totalRaised / totalGoal) * 100))

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setAnimated(percent), 80)
    return () => clearTimeout(t)
  }, [percent])

  const size = 44
  const stroke = 5
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - animated / 100)

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md px-4 py-3 transition-transform duration-300 lg:hidden ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ backgroundColor: TRACK }}
          role="progressbar"
          aria-valuenow={totalPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${totalPct}% of total goal raised`}
        >
          <div
            className="h-full transition-[width] duration-1000 ease-out"
            style={{
              width: visible ? `${totalPct}%` : "0%",
              backgroundColor: GREEN,
            }}
          />
        </div>

        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="relative"
              style={{ width: size, height: size }}
              role="progressbar"
              aria-valuenow={Math.round(percent)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${label}: ${Math.round(percent)}% funded`}
            >
              <svg width={size} height={size} className="-rotate-90">
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={TRACK}
                  strokeWidth={stroke}
                  fill="none"
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={GREEN}
                  strokeWidth={stroke}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 1.1s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold tabular-nums">
                  {Math.round(animated)}%
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium tabular-nums text-muted-foreground leading-tight">
                Total raised · {totalPct}%
              </p>
              <p className="text-xs font-bold text-foreground truncate leading-tight mt-0.5">
                {label}
                <span className="ml-1 text-[10px] font-semibold tabular-nums text-muted-foreground">
                  · {Math.round(percent)}%
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="ml-auto flex h-10 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-bold text-accent-foreground shadow-sm shadow-accent/20 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 active:translate-y-0"
          >
            <Heart className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            Support
          </button>
        </div>
      </div>

      <DonationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
