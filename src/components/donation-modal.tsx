"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createDonation, uploadScreenshot } from "@/app/actions"
import {
  DONATION_TIERS,
  GENERATIONS,
  MIN_CUSTOM_AMOUNT,
  MAX_CUSTOM_AMOUNT,
} from "@/lib/constants"
import { formatEUR, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Balloons } from "@/components/ui/balloons"

const MAX_NAME_LENGTH = 100
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
  campaignGoal?: number
}

export function DonationModal({
  isOpen,
  onClose,
  campaignGoal: _campaignGoal,
}: DonationModalProps) {
  const [step, setStep] = useState(1)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [donorName, setDonorName] = useState("")
  const [generation, setGeneration] = useState("")
  const [donorMessage, setDonorMessage] = useState("")
  const [donationId, setDonationId] = useState<number | null>(null)
  const [referenceCode, setReferenceCode] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [amountError, setAmountError] = useState("")
  const [nameError, setNameError] = useState("")
  const [uploadError, setUploadError] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [copied, setCopied] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const balloonsRef = useRef<HTMLDivElement & { launchAnimation: () => void }>(
    null
  )

  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"

    const timer = setTimeout(() => {
      const firstInput = modalRef.current?.querySelector<HTMLElement>(
        "button, input, select"
      )
      firstInput?.focus()
    }, 50)

    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
      clearTimeout(timer)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (step === 4) {
      balloonsRef.current?.launchAnimation()
    }
  }, [step])

  const resetState = useCallback(() => {
    setStep(1)
    setSelectedAmount(null)
    setCustomAmount("")
    setDonorName("")
    setGeneration("")
    setDonorMessage("")
    setDonationId(null)
    setReferenceCode("")
    setUploadSuccess(false)
    setAmountError("")
    setNameError("")
    setUploadError("")
    setIsPending(false)
    setCopied(false)
  }, [])

  const handleClose = useCallback(() => {
    onClose()
    resetState()
  }, [onClose, resetState])

  const effectiveAmount =
    selectedAmount ?? (customAmount ? Number(customAmount) : 0)

  function handleStep1Next() {
    setAmountError("")

    if (!selectedAmount && !customAmount) {
      setAmountError("Please select or enter an amount")
      return
    }

    if (customAmount && !selectedAmount) {
      const parsed = Number(customAmount)
      if (isNaN(parsed) || parsed < MIN_CUSTOM_AMOUNT) {
        setAmountError(`Minimum amount is ${formatEUR(MIN_CUSTOM_AMOUNT)}`)
        return
      }
      if (parsed > MAX_CUSTOM_AMOUNT) {
        setAmountError(`Maximum amount is ${formatEUR(MAX_CUSTOM_AMOUNT)}`)
        return
      }
    }

    setStep(2)
  }

  async function handleStep2Next() {
    setNameError("")

    const trimmedName = donorName.trim()
    if (!trimmedName) {
      setNameError("Please enter your name")
      return
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      setNameError(`Name must be ${MAX_NAME_LENGTH} characters or less`)
      return
    }

    if (!generation) {
      setNameError("Please select your generation")
      return
    }

    setIsPending(true)
    const result = await createDonation({
      donor_name: trimmedName,
      amount: effectiveAmount,
      generation,
      message: donorMessage || undefined,
      commitment_type: "transfer",
    })
    setIsPending(false)

    if (result.success) {
      setDonationId(result.donationId)
      setReferenceCode(result.referenceCode)
      setStep(3)
    } else {
      setNameError(result.error)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!donationId) return

    setUploadError("")

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setUploadError("Only JPEG, PNG, or WebP images are allowed")
      e.target.value = ""
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError("File size must be less than 5 MB")
      e.target.value = ""
      return
    }

    setIsPending(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("donationId", String(donationId))
    const result = await uploadScreenshot(formData)
    setIsPending(false)

    if (result.success) {
      setUploadSuccess(true)
      setTimeout(() => setStep(4), 500)
    } else {
      setUploadError(result.error)
    }
  }

  function handleWhatsApp() {
    const whatsappText = encodeURIComponent(
      `Hi! I just committed ${formatEUR(effectiveAmount)} to the Kunstlabor office fundraiser. Reference: ${referenceCode}`
    )
    const whatsappUrl = `https://wa.me/PHONE_PLACEHOLDER?text=${whatsappText}`
    window.open(whatsappUrl, "_blank")
    setUploadSuccess(true)
    setTimeout(() => setStep(4), 500)
  }

  async function handleCopyIBAN() {
    try {
      await navigator.clipboard.writeText("IBAN_PLACEHOLDER")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Donation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal content — fullscreen on mobile, centered card on desktop */}
      <div
        ref={modalRef}
        className="relative z-10 flex w-full flex-col rounded-t-2xl border border-border bg-background p-6 shadow-2xl sm:mx-4 sm:max-w-lg sm:rounded-2xl max-h-[100dvh] sm:max-h-[90vh] overflow-y-auto"
      >
        {/* Step indicator */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                s <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Step 1: Tier Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Choose your commitment</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a tier or enter a custom amount
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3" role="group" aria-label="Donation tiers">
              {DONATION_TIERS.map((tier) => (
                <Button
                  key={tier}
                  variant={selectedAmount === tier ? "default" : "outline"}
                  size="lg"
                  className="h-14 text-lg"
                  onClick={() => {
                    setSelectedAmount(tier)
                    setCustomAmount("")
                    setAmountError("")
                  }}
                >
                  {formatEUR(tier)}
                </Button>
              ))}
            </div>

            <div className="relative">
              <label htmlFor="custom-amount" className="sr-only">
                Custom donation amount in EUR
              </label>
              <input
                id="custom-amount"
                type="number"
                inputMode="numeric"
                min={MIN_CUSTOM_AMOUNT}
                max={MAX_CUSTOM_AMOUNT}
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setSelectedAmount(null)
                  setAmountError("")
                }}
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-base outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                EUR
              </span>
            </div>

            {amountError && (
              <p className="text-sm text-destructive" role="alert">{amountError}</p>
            )}

            <Button
              className="w-full"
              size="lg"
              disabled={!selectedAmount && !customAmount}
              onClick={handleStep1Next}
            >
              Next
            </Button>
          </div>
        )}

        {/* Step 2: Donor Info */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Your details</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tell us who you are
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="donor-name" className="sr-only">
                  Your name
                </label>
                <input
                  id="donor-name"
                  type="text"
                  placeholder="Your name"
                  maxLength={MAX_NAME_LENGTH}
                  value={donorName}
                  onChange={(e) => {
                    setDonorName(e.target.value)
                    setNameError("")
                  }}
                  className="h-11 w-full rounded-lg border border-border bg-background px-4 text-base outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
                />
              </div>

              <div>
                <label htmlFor="generation-select" className="sr-only">
                  Your generation
                </label>
                <select
                  id="generation-select"
                  value={generation}
                  onChange={(e) => {
                    setGeneration(e.target.value)
                    setNameError("")
                  }}
                  className="h-11 w-full rounded-lg border border-border bg-background px-4 text-base outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
                >
                  <option value="">Select generation</option>
                  {GENERATIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="donor-message" className="sr-only">
                  Optional message
                </label>
                <textarea
                  id="donor-message"
                  placeholder="Optional message"
                  maxLength={500}
                  rows={3}
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-base outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
                />
              </div>
            </div>

            {nameError && (
              <p className="text-sm text-destructive" role="alert">{nameError}</p>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                size="lg"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                size="lg"
                disabled={isPending}
                onClick={handleStep2Next}
              >
                {isPending ? "Submitting..." : "Next"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Bank Details */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                Transfer to Thomas Stiftung
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Thomas Stiftung supports manage&amp;more by renting the office
                space for our community.
              </p>
            </div>

            <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account holder</span>
                <span className="font-medium">Thomas Stiftung</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IBAN</span>
                <span className="font-mono text-xs font-medium">
                  IBAN_PLACEHOLDER
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">BIC</span>
                <span className="font-mono text-xs font-medium">
                  BIC_PLACEHOLDER
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-mono text-xs font-medium">
                  {referenceCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">
                  {formatEUR(effectiveAmount)}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleCopyIBAN}
            >
              {copied ? "Copied!" : "Copy IBAN"}
            </Button>

            <div className="space-y-2">
              <p className="text-center text-sm font-medium">
                Choose one to confirm your donation:
              </p>

              <label className="flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-accent active:bg-accent/80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {isPending
                  ? "Uploading..."
                  : uploadSuccess
                    ? "Uploaded!"
                    : "Upload transfer screenshot"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="sr-only"
                  disabled={isPending}
                  aria-label="Upload transfer screenshot"
                />
              </label>

              <Button
                variant="outline"
                className="w-full min-h-[44px]"
                onClick={handleWhatsApp}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-2"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Confirm via WhatsApp
              </Button>
            </div>

            {uploadError && (
              <p className="text-sm text-destructive" role="alert">{uploadError}</p>
            )}
          </div>
        )}

        {/* Step 4: Celebration */}
        {step === 4 && (
          <div className="space-y-4 text-center">
            <div className="text-5xl">🎉</div>
            <h2 className="text-2xl font-bold">
              You&apos;re a founding member!
            </h2>
            <p className="text-lg text-muted-foreground">
              Thank you, {donorName}!
            </p>
            <p className="text-sm text-muted-foreground">
              {formatEUR(effectiveAmount)} &middot; {generation}
            </p>

            <Button className="w-full" size="lg" onClick={handleClose}>
              Close
            </Button>

            <Balloons ref={balloonsRef} type="default" />
          </div>
        )}
      </div>
    </div>
  )
}
