"use client"

import { useEffect, useMemo, useState } from "react"

interface ConfettiProps {
  isActive?: boolean
  duration?: number
  autoPlay?: boolean
  zIndex?: number
  loop?: boolean
  /** Number of confetti pieces */
  pieceCount?: number
}

const COLORS = [
  "#34d399",
  "#fbbf24",
  "#60a5fa",
  "#f472b6",
  "#a78bfa",
  "#00a2cc",
]

/**
 * Lightweight continuous confetti (CSS). Lottie JSON from quick prototypes
 * often fails silently in production; this stays visible and pointer-safe.
 */
const Confetti = ({
  isActive: externalIsActive,
  duration = 6000,
  autoPlay = false,
  zIndex = 25,
  loop = false,
  pieceCount = 48,
}: ConfettiProps) => {
  const [internalActive, setInternalActive] = useState(autoPlay)
  const active = externalIsActive ?? internalActive

  useEffect(() => {
    if (externalIsActive !== undefined) return
    if (!internalActive || loop || duration <= 0) return
    const id = window.setTimeout(() => setInternalActive(false), duration)
    return () => window.clearTimeout(id)
  }, [externalIsActive, internalActive, duration, loop])

  const pieces = useMemo(
    () =>
      Array.from({ length: pieceCount }, (_, i) => ({
        id: i,
        left: `${(i * 17 + (i % 7) * 11) % 100}%`,
        delay: `${(i % 12) * 0.15}s`,
        duration: `${3.2 + (i % 5) * 0.45}s`,
        size: 6 + (i % 4),
        color: COLORS[i % COLORS.length],
        dx: `${-40 + (i * 13) % 80}px`,
      })),
    [pieceCount]
  )

  if (!active) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 h-dvh w-full overflow-hidden"
      style={{ zIndex }}
      aria-hidden="true"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-[2px] opacity-90 will-change-transform"
          style={{
            left: p.left,
            top: "-5vh",
            width: p.size,
            height: p.size * 0.65,
            backgroundColor: p.color,
            animationName: "confetti-fall",
            animationDuration: p.duration,
            animationTimingFunction: "linear",
            animationIterationCount: loop ? "infinite" : 1,
            animationDelay: p.delay,
            ["--confetti-dx" as string]: p.dx,
          }}
        />
      ))}
    </div>
  )
}

export default Confetti
