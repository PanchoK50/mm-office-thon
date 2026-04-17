"use client"

import { useEffect, useState } from "react"
import { cn, formatEUR } from "@/lib/utils"

interface Milestone {
  position: number
  label: string
  funded: boolean
}

interface MilestoneProgressBarProps {
  current: number
  total: number
  milestones: Milestone[]
  className?: string
}

export function MilestoneProgressBar({
  current,
  total,
  milestones,
  className,
}: MilestoneProgressBarProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0)
  const percentage = Math.min((current / total) * 100, 100)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWidth(percentage), 100)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold sm:text-3xl">{formatEUR(current)}</span>
          <span className="ml-2 text-muted-foreground">of {formatEUR(total)}</span>
        </div>
        <span className="text-sm font-semibold text-accent">
          {percentage >= 100 ? "100% ✓" : `${percentage.toFixed(0)}%`}
        </span>
      </div>

      <div className="relative pb-10">
        <div
          className="relative h-5 w-full overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={Math.round(percentage)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${formatEUR(current)} of ${formatEUR(total)} raised`}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out animate-pulse-glow"
            style={{ width: `${animatedWidth}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent bg-[length:200%_100%] animate-shimmer"
            style={{ width: `${animatedWidth}%` }}
          />
        </div>

        {milestones.map((milestone) => {
          const nearStart = milestone.position <= 8
          const nearEnd = milestone.position >= 92
          return (
            <div
              key={milestone.label}
              className={cn(
                "absolute top-0 flex flex-col",
                nearStart ? "items-start" : nearEnd ? "items-end" : "items-center"
              )}
              style={{
                left: `${milestone.position}%`,
                transform: nearStart
                  ? "translateX(0)"
                  : nearEnd
                    ? "translateX(-100%)"
                    : "translateX(-50%)",
              }}
            >
              <div
                className={cn(
                  "h-5 w-5 shrink-0 rounded-full flex items-center justify-center",
                  milestone.funded
                    ? "bg-green-500"
                    : "bg-secondary border border-border"
                )}
              >
                {milestone.funded && (
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span
                className={cn(
                  "mt-1.5 max-w-[80px] text-xs leading-tight",
                  nearStart ? "text-left" : nearEnd ? "text-right" : "text-center",
                  milestone.funded ? "font-medium text-green-600" : "text-muted-foreground"
                )}
              >
                {milestone.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
