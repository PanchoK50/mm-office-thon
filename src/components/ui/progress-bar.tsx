"use client"

import { useEffect, useState } from "react"
import { cn, formatEUR } from "@/lib/utils"

interface ProgressBarProps {
  current: number
  goal: number
  className?: string
}

export function ProgressBar({ current, goal, className }: ProgressBarProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0)
  const percentage = Math.min((current / goal) * 100, 100)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWidth(percentage), 100)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold sm:text-3xl">{formatEUR(current)}</span>
          <span className="ml-2 text-muted-foreground">of {formatEUR(goal)}</span>
        </div>
        <span className="text-sm font-semibold text-accent">
          {percentage >= 100 ? "100% ✓" : `${percentage.toFixed(0)}%`}
        </span>
      </div>

      <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={Math.round(percentage)} aria-valuemin={0} aria-valuemax={100} aria-label={`${formatEUR(current)} of ${formatEUR(goal)} raised`}>
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out animate-pulse-glow"
          style={{ width: `${animatedWidth}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent bg-[length:200%_100%] animate-shimmer"
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
    </div>
  )
}
