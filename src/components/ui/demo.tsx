import { useState } from "react"
import Confetti from "@/components/ui/confetti"

export function Example1() {
  const [showBasicConfetti, setShowBasicConfetti] = useState(false)

  return (
    <div className="p-8">
      <h1 className="mb-8 text-3xl font-bold">Confetti</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Basic Confetti</h2>
          <button
            type="button"
            onClick={() => setShowBasicConfetti(true)}
            className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white transition-all hover:scale-105 hover:bg-blue-600 active:scale-95"
          >
            Celebrate!
          </button>
          <Confetti isActive={showBasicConfetti} duration={5000} loop={false} zIndex={100} />
        </div>
      </div>
    </div>
  )
}
