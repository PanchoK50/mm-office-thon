"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Check,
  Users,
  Briefcase,
  MessagesSquare,
  Frame,
  Fingerprint,
  Upload,
  MessageCircle,
  FileSignature,
  Zap,
  Sparkles,
} from "lucide-react"
import {
  createDonation,
  uploadScreenshot,
  updateDonationCommitment,
} from "@/app/actions"
import {
  CONTRIBUTION_TIERS,
  type ContributionTier,
  GENERATIONS,
  MIN_CUSTOM_AMOUNT,
  MAX_CUSTOM_AMOUNT,
} from "@/lib/constants"
import { formatEUR, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Balloons } from "@/components/ui/balloons"

const MAX_NAME_LENGTH = 100
const MAX_TAGLINE_LENGTH = 120
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

const LOI_DEADLINE_LABEL = "Friday, 24 April 2026"

/** Every tier card renders this many benefit rows — shorter tiers get invisible
 *  placeholder rows so the divider + bullets line up across all cards. */
const MAX_BENEFIT_ROWS = Math.max(
  ...CONTRIBUTION_TIERS.map((t) => t.benefits.length)
)

/** Cards shown in the grid — Wall of Fame is handled as a disclaimer row. */
const CARD_TIERS = CONTRIBUTION_TIERS
  .filter((t) => t.id !== "wall")
  // Display order requested by the user: Gold · Silver · Bronze · Founding.
  .sort((a, b) => {
    const order: Record<ContributionTier["id"], number> = {
      gold: 0,
      silver: 1,
      bronze: 2,
      founding: 3,
      wall: 4,
    }
    return order[a.id] - order[b.id]
  })

/** Amount → tier id. Highest-threshold match wins. */
function tierForAmount(n: number): ContributionTier["id"] | null {
  if (n >= 15_000) return "gold"
  if (n >= 10_000) return "silver"
  if (n >= 5_000) return "bronze"
  if (n >= 1_000) return "founding"
  if (n >= 50) return "wall"
  return null
}

function tierById(id: ContributionTier["id"] | null): ContributionTier | null {
  if (!id) return null
  return CONTRIBUTION_TIERS.find((t) => t.id === id) ?? null
}

/**
 * Per-tier visual treatment — deliberately ONE hue per tier so nothing inside
 * the card introduces a competing colour. Fingerprint details live in the
 * benefits text, not as an icon, so the palette stays quiet.
 */
const TIER_THEME: Record<
  ContributionTier["id"],
  {
    dot: string // small colour tag next to the tier name
    borderIdle: string
    borderActive: string
    ring: string
    accentText: string
    chipBg: string
    tagBg: string
    headlineBg: string // highlighted hero-benefit box
    headlineBorder: string
    headlineIcon: string
  }
> = {
  gold: {
    dot: "bg-amber-500",
    borderIdle: "border-amber-300/60",
    borderActive: "border-amber-500",
    ring: "ring-amber-500/30",
    accentText: "text-amber-700",
    chipBg: "bg-amber-500/10",
    tagBg: "bg-amber-500/15",
    headlineBg: "bg-amber-500/5",
    headlineBorder: "border-amber-500/30",
    headlineIcon: "text-amber-600",
  },
  silver: {
    dot: "bg-slate-500",
    borderIdle: "border-slate-300/70",
    borderActive: "border-slate-500",
    ring: "ring-slate-500/30",
    accentText: "text-slate-700",
    chipBg: "bg-slate-500/10",
    tagBg: "bg-slate-500/15",
    headlineBg: "bg-slate-500/5",
    headlineBorder: "border-slate-500/30",
    headlineIcon: "text-slate-600",
  },
  bronze: {
    dot: "bg-orange-700",
    borderIdle: "border-orange-300/60",
    borderActive: "border-orange-700",
    ring: "ring-orange-700/30",
    accentText: "text-orange-800",
    chipBg: "bg-orange-700/10",
    tagBg: "bg-orange-700/15",
    headlineBg: "bg-orange-700/5",
    headlineBorder: "border-orange-700/30",
    headlineIcon: "text-orange-700",
  },
  founding: {
    dot: "bg-neutral-900",
    borderIdle: "border-neutral-300",
    borderActive: "border-neutral-900",
    ring: "ring-neutral-900/25",
    accentText: "text-neutral-900",
    chipBg: "bg-neutral-900/5",
    tagBg: "bg-neutral-900/10",
    headlineBg: "bg-neutral-900/5",
    headlineBorder: "border-neutral-900/25",
    headlineIcon: "text-neutral-900",
  },
  wall: {
    dot: "bg-neutral-400",
    borderIdle: "border-neutral-200",
    borderActive: "border-neutral-400",
    ring: "ring-neutral-400/25",
    accentText: "text-neutral-700",
    chipBg: "bg-neutral-500/10",
    tagBg: "bg-neutral-500/15",
    headlineBg: "bg-neutral-500/5",
    headlineBorder: "border-neutral-400/40",
    headlineIcon: "text-neutral-500",
  },
}

const HEADLINE_ICON: Record<
  ContributionTier["headline"]["icon"],
  typeof Users
> = {
  community: Users,          // Gold: big, communal
  office: Briefcase,         // Silver: professional workspace
  meeting: MessagesSquare,   // Bronze: meeting / conversation
  photo: Frame,              // Founding: photo on the wall
  wall: Fingerprint,         // Wall of Fame: fingerprint mark
}

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [step, setStep] = useState(1)

  // Step 1 — unified amount state
  const [amount, setAmount] = useState(0)
  const [amountInput, setAmountInput] = useState("")
  const [amountError, setAmountError] = useState("")

  // Step 2
  const [donorName, setDonorName] = useState("")
  const [generation, setGeneration] = useState("")
  const [donorMessage, setDonorMessage] = useState("")
  const [nameError, setNameError] = useState("")

  // Post-step-2 — identity of the created donation row
  const [donationId, setDonationId] = useState<number | null>(null)
  const [referenceCode, setReferenceCode] = useState("")
  const [isPending, setIsPending] = useState(false)

  // Step 3 — payment confirmation
  const [confirmationMethod, setConfirmationMethod] = useState<
    "upload" | "whatsapp" | "loi" | null
  >(null)
  const [uploadError, setUploadError] = useState("")
  const [copied, setCopied] = useState(false)
  const [showLoIPanel, setShowLoIPanel] = useState(false)
  const [loiError, setLoiError] = useState("")

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
        } else if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
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
    setAmount(0)
    setAmountInput("")
    setAmountError("")
    setDonorName("")
    setGeneration("")
    setDonorMessage("")
    setNameError("")
    setDonationId(null)
    setReferenceCode("")
    setIsPending(false)
    setConfirmationMethod(null)
    setUploadError("")
    setCopied(false)
    setShowLoIPanel(false)
    setLoiError("")
  }, [])

  const handleClose = useCallback(() => {
    onClose()
    resetState()
  }, [onClose, resetState])

  const derivedTierId = tierForAmount(amount)
  const derivedTier = tierById(derivedTierId)

  /** Tier label for the receipt / celebration views. */
  const tierLabel = derivedTier?.name ?? "Supporter"

  function setAmountFromInput(raw: string) {
    // Accept digits + optional decimal separator; coerce comma to dot for parsing.
    const cleaned = raw.replace(/[^\d.,]/g, "")
    setAmountInput(cleaned)
    const numeric = Number(cleaned.replace(",", "."))
    setAmount(Number.isFinite(numeric) ? numeric : 0)
    setAmountError("")
  }

  function pickTier(tier: ContributionTier) {
    setAmount(tier.price)
    setAmountInput(String(tier.price))
    setAmountError("")
  }

  function handleStep1Next() {
    setAmountError("")

    if (amount < MIN_CUSTOM_AMOUNT) {
      setAmountError(`Minimum amount is ${formatEUR(MIN_CUSTOM_AMOUNT)}`)
      return
    }
    if (amount > MAX_CUSTOM_AMOUNT) {
      setAmountError(`Maximum amount is ${formatEUR(MAX_CUSTOM_AMOUNT)}`)
      return
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
      amount,
      generation,
      message: donorMessage || undefined,
      commitment_type: "transfer", // tentative, may be flipped to "loi" in step 3
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
    if (!file || !donationId) return

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
      setConfirmationMethod("upload")
    } else {
      setUploadError(result.error)
    }
  }

  function handleWhatsApp() {
    const whatsappText = encodeURIComponent(
      `Hi! I just transferred ${formatEUR(amount)} for the Kunstlabor office. ` +
        `My name is ${donorName} (${generation}). Here's my confirmation screenshot:`
    )
    const whatsappUrl = `https://wa.me/4915255839400?text=${whatsappText}`
    window.open(whatsappUrl, "_blank")
    setConfirmationMethod("whatsapp")
  }

  async function handleConfirmLoI() {
    setLoiError("")
    if (!donationId) return

    setIsPending(true)
    const result = await updateDonationCommitment(donationId, "loi")
    setIsPending(false)

    if (result.success) {
      setConfirmationMethod("loi")
      setShowLoIPanel(false)
    } else {
      setLoiError(result.error)
    }
  }

  async function handleCopyIBAN() {
    try {
      await navigator.clipboard.writeText("IBAN_PLACEHOLDER")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignored
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
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className="relative z-10 flex w-full flex-col rounded-t-2xl border border-border bg-card p-6 shadow-2xl sm:mx-4 sm:max-w-4xl sm:rounded-2xl max-h-[100dvh] sm:max-h-[90vh] overflow-y-auto"
      >
        {/* Step indicator */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                s <= step ? "bg-accent" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* ---------------- Step 1: Tier & amount ---------------- */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                Choose your tier
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Click a tier to pre-fill the amount, or type your own below.
              </p>
            </div>

            {/* Four cards side by side on desktop */}
            <div
              className="grid grid-cols-1 gap-3 sm:grid-cols-4"
              role="radiogroup"
              aria-label="Contribution tiers"
            >
              {CARD_TIERS.map((tier) => (
                <TierCard
                  key={tier.id}
                  tier={tier}
                  selected={derivedTierId === tier.id}
                  onSelect={() => pickTier(tier)}
                />
              ))}
            </div>

            {/* Wall-of-Fame disclaimer row */}
            <div className="flex items-start gap-3 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-sm">
              <Fingerprint
                className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500"
                strokeWidth={2}
                aria-hidden="true"
              />
              <p className="text-foreground">
                <span className="font-semibold">Donate €50+</span> and you&apos;ll
                be added to the Wall of Fame: fingerprint, name and generation
                in grey on the wall.
              </p>
            </div>

            {/* Prominent amount input */}
            <div>
              <label
                htmlFor="amount-input"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Your amount
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-muted-foreground">
                  €
                </span>
                <input
                  id="amount-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter amount"
                  value={amountInput}
                  onChange={(e) => setAmountFromInput(e.target.value)}
                  className="h-12 w-full rounded-xl border-2 border-border bg-background pl-10 pr-4 text-xl font-bold tabular-nums outline-none transition-colors focus-visible:border-accent"
                  aria-describedby="amount-hint"
                />
              </div>

              {/* Live derived tier chip / supporter chip */}
              <p
                id="amount-hint"
                className="mt-1.5 flex min-h-[18px] items-center gap-1.5 text-xs"
              >
                {amount >= 15_000 && (
                  <TierChip id="gold">You&apos;ll be a Gold member</TierChip>
                )}
                {amount >= 10_000 && amount < 15_000 && (
                  <TierChip id="silver">You&apos;ll be a Silver member</TierChip>
                )}
                {amount >= 5_000 && amount < 10_000 && (
                  <TierChip id="bronze">You&apos;ll be a Bronze member</TierChip>
                )}
                {amount >= 1_000 && amount < 5_000 && (
                  <TierChip id="founding">
                    You&apos;ll be a Founding Member
                  </TierChip>
                )}
                {amount >= 50 && amount < 1_000 && (
                  <TierChip id="wall">
                    You&apos;ll be listed on the Wall of Fame
                  </TierChip>
                )}
                {amount >= MIN_CUSTOM_AMOUNT && amount < 50 && (
                  <span className="text-muted-foreground">
                    Thanks for your support, {formatEUR(amount)}
                  </span>
                )}
                {amount > 0 && amount < MIN_CUSTOM_AMOUNT && (
                  <span className="text-destructive">
                    Minimum is {formatEUR(MIN_CUSTOM_AMOUNT)}
                  </span>
                )}
              </p>
            </div>

            {amountError && (
              <p className="text-sm text-destructive" role="alert">
                {amountError}
              </p>
            )}

            <Button
              className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
              disabled={amount < MIN_CUSTOM_AMOUNT}
              onClick={handleStep1Next}
            >
              {amount >= MIN_CUSTOM_AMOUNT
                ? `Continue with ${formatEUR(amount)}`
                : "Continue"}
            </Button>
          </div>
        )}

        {/* ---------------- Step 2: Donor info ---------------- */}
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
                  className="h-11 w-full rounded-lg border border-border bg-background px-4 text-base outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent/70"
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
                  className="h-11 w-full rounded-lg border border-border bg-background px-4 text-base outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent/70"
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
                <label
                  htmlFor="donor-message"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Tagline (optional)
                </label>
                <textarea
                  id="donor-message"
                  placeholder="Short tagline shown under your donation"
                  maxLength={MAX_TAGLINE_LENGTH}
                  rows={2}
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2 text-sm outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent/70"
                />
                <p className="mt-1 text-right text-xs text-muted-foreground tabular-nums">
                  {donorMessage.length}/{MAX_TAGLINE_LENGTH}
                </p>
              </div>
            </div>

            {nameError && (
              <p className="text-sm text-destructive" role="alert">
                {nameError}
              </p>
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
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                size="lg"
                disabled={isPending}
                onClick={handleStep2Next}
              >
                {isPending ? "Submitting..." : "Next"}
              </Button>
            </div>
          </div>
        )}

        {/* ---------------- Step 3: Bank details & confirmation ---------------- */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                Transfer to Thomas Stiftung
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Thomas Stiftung rents the office on behalf of Manage and More.
              </p>
            </div>

            {/* Instant-transfer callout */}
            <div className="flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm">
              <Zap
                className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <p className="text-foreground">
                <span className="font-semibold">Use Instant Transfer.</span>{" "}
                It&apos;s free for almost every German bank, credits within
                seconds, and that momentum makes a real difference for the
                campaign.
              </p>
            </div>

            {/* Bank details box */}
            <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-4 text-sm">
              <Row label="Account holder" value="Thomas Stiftung" />
              <Row label="IBAN" value="IBAN_PLACEHOLDER" mono />
              <Row label="BIC" value="BIC_PLACEHOLDER" mono />
              <Row label="Reference" value={referenceCode} mono />
              {derivedTier && <Row label="Tier" value={tierLabel} />}
              <Row label="Amount" value={formatEUR(amount)} emphasis />
            </div>

            <Button variant="outline" className="w-full" onClick={handleCopyIBAN}>
              {copied ? "Copied!" : "Copy IBAN"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Once transferred, send us the confirmation screenshot. Upload it
              here or share via WhatsApp.
            </p>

            {/* Confirmation method buttons */}
            <div className="space-y-2.5">
              {/* Upload */}
              <MethodButton
                icon={<Upload className="h-5 w-5" aria-hidden />}
                label={
                  isPending && confirmationMethod === null
                    ? "Uploading..."
                    : "Upload transfer screenshot"
                }
                chosen={confirmationMethod === "upload"}
                as="label"
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="sr-only"
                  disabled={isPending}
                  aria-label="Upload transfer screenshot"
                />
              </MethodButton>

              {/* WhatsApp */}
              <MethodButton
                icon={<MessageCircle className="h-5 w-5" aria-hidden />}
                label="Send confirmation via WhatsApp"
                chosen={confirmationMethod === "whatsapp"}
                onClick={handleWhatsApp}
              />

              {/* LoI — only for donations ≥ €1,000 */}
              {amount >= 1_000 && (
                <>
                  <MethodButton
                    icon={<FileSignature className="h-5 w-5" aria-hidden />}
                    label="Binding commitment (transfer by 24 April)"
                    chosen={confirmationMethod === "loi"}
                    onClick={() => {
                      if (confirmationMethod === "loi") return
                      setShowLoIPanel((v) => !v)
                    }}
                  />

                  {showLoIPanel && confirmationMethod !== "loi" && (
                    <div className="rounded-lg border-2 border-neutral-900 bg-neutral-900/5 p-4 text-sm">
                      <p className="text-foreground">
                        I,{" "}
                        <span className="font-semibold">
                          {donorName || "-"}
                        </span>
                        , hereby commit to transferring{" "}
                        <span className="font-semibold tabular-nums">
                          {formatEUR(amount)}
                        </span>{" "}
                        to Thomas Stiftung by{" "}
                        <span className="font-semibold">
                          {LOI_DEADLINE_LABEL}
                        </span>{" "}
                        for the Manage and More × Kunstlabor office fundraiser.
                        This is a binding declaration of intent.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowLoIPanel(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="bg-neutral-900 text-white hover:bg-neutral-800"
                          disabled={isPending}
                          onClick={handleConfirmLoI}
                        >
                          {isPending ? "Confirming..." : "I confirm"}
                        </Button>
                      </div>
                      {loiError && (
                        <p className="mt-2 text-xs text-destructive" role="alert">
                          {loiError}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {uploadError && (
              <p className="text-sm text-destructive" role="alert">
                {uploadError}
              </p>
            )}

            {/* Gated Confirm Payment */}
            <Button
              size="lg"
              className={cn(
                "w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90",
                !confirmationMethod && "cursor-not-allowed opacity-50"
              )}
              disabled={!confirmationMethod}
              onClick={() => setStep(4)}
            >
              Confirm payment
            </Button>
          </div>
        )}

        {/* ---------------- Step 4: Committed ---------------- */}
        {step === 4 && (
          <div className="space-y-4 text-center">
            <div className="text-5xl" aria-hidden="true">
              🎉
            </div>
            <h2 className="text-2xl font-bold">Thank you, you&apos;re in!</h2>
            <p className="mx-auto max-w-sm text-base leading-relaxed text-muted-foreground">
              Your contribution is{" "}
              <span className="font-semibold text-foreground">committed</span>.
              We&apos;ll mark it as{" "}
              <span className="font-semibold text-foreground">received</span>{" "}
              once the transfer arrives in the Thomas Stiftung account.
            </p>
            <p className="text-sm text-muted-foreground">
              {donorName} · {formatEUR(amount)} · {tierLabel}
              {generation ? ` · ${generation}` : ""}
            </p>

            <Button
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
              onClick={handleClose}
            >
              Close
            </Button>

            <Balloons ref={balloonsRef} type="default" />
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------- Tier card ---------------- */

function TierCard({
  tier,
  selected,
  onSelect,
}: {
  tier: ContributionTier
  selected: boolean
  onSelect: () => void
}) {
  const theme = TIER_THEME[tier.id]
  const HeadlineIcon = HEADLINE_ICON[tier.headline.icon]
  const priceLabel =
    tier.id === "founding" ? `${formatEUR(tier.price)}+` : formatEUR(tier.price)

  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        "group relative flex h-full cursor-pointer flex-col rounded-xl border bg-card p-4 transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        selected
          ? "border-accent shadow-md ring-2 ring-accent/20"
          : "border-border shadow-sm"
      )}
    >
      {/* Header: tier name (left), optional tag (right) */}
      <div className="flex items-start justify-between gap-2">
        <h3
          className={cn(
            "text-[11px] font-bold uppercase tracking-[0.08em]",
            theme.accentText
          )}
        >
          {tier.name}
        </h3>
        {tier.tag && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
              theme.tagBg,
              theme.accentText
            )}
          >
            <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} aria-hidden />
            {tier.tag}
          </span>
        )}
      </div>

      {/* Price */}
      <p
        className={cn(
          "mt-1 text-2xl font-bold tabular-nums leading-none",
          theme.accentText
        )}
      >
        {priceLabel}
      </p>

      {/* Hero benefit — size pill + distinct icon + room type */}
      <div className="mt-3 space-y-1.5">
        {tier.headline.size && (
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold tabular-nums",
              theme.chipBg,
              theme.accentText
            )}
          >
            {tier.headline.size}
          </span>
        )}
        <div className="flex items-start gap-2">
          <HeadlineIcon
            className={cn("mt-0.5 h-4 w-4 shrink-0", theme.headlineIcon)}
            strokeWidth={2}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-snug text-foreground">
              {tier.headline.title}
            </p>
            {tier.headline.subtitle && (
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                {tier.headline.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Supporting benefits — pinned to bottom with a fixed row count so the
          divider and every bullet line up horizontally across cards. */}
      <ul className="mt-auto space-y-1 border-t border-border/60 pt-3 text-[11px] leading-snug text-muted-foreground">
        {Array.from({ length: MAX_BENEFIT_ROWS }).map((_, i) => {
          const benefit = tier.benefits[i]
          return benefit ? (
            <li key={benefit} className="flex gap-1.5">
              <Check
                className="mt-0.5 h-3 w-3 shrink-0"
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <span>{benefit}</span>
            </li>
          ) : (
            <li
              key={`empty-${i}`}
              aria-hidden="true"
              className="invisible flex gap-1.5"
            >
              <Check className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={2.5} />
              <span>-</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ---------------- Inline tier chip (step 1 hint) ---------------- */

function TierChip({
  id,
  children,
}: {
  id: ContributionTier["id"]
  children: React.ReactNode
}) {
  const theme = TIER_THEME[id]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        theme.chipBg,
        theme.accentText
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", theme.dot)}
        aria-hidden="true"
      />
      {children}
    </span>
  )
}

/* ---------------- Small helpers ---------------- */

function Row({
  label,
  value,
  mono,
  emphasis,
}: {
  label: string
  value: string
  mono?: boolean
  emphasis?: boolean
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          mono && "font-mono text-xs",
          emphasis ? "font-semibold" : "font-medium"
        )}
      >
        {value}
      </span>
    </div>
  )
}

function MethodButton({
  icon,
  label,
  chosen,
  onClick,
  as = "button",
  children,
}: {
  icon: React.ReactNode
  label: string
  chosen: boolean
  onClick?: () => void
  as?: "button" | "label"
  children?: React.ReactNode
}) {
  const baseClass = cn(
    "flex min-h-[52px] w-full cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors",
    chosen
      ? "border-green-500 bg-green-500/5 text-foreground"
      : "border-border bg-background text-foreground hover:bg-muted/60"
  )

  const content = (
    <>
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          chosen ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
        )}
        aria-hidden="true"
      >
        {chosen ? <Check className="h-5 w-5" strokeWidth={3} /> : icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
      {chosen && (
        <span className="text-xs font-semibold uppercase tracking-wider text-green-600">
          Selected
        </span>
      )}
      {children}
    </>
  )

  if (as === "label") {
    return <label className={baseClass}>{content}</label>
  }

  return (
    <button type="button" onClick={onClick} className={baseClass}>
      {content}
    </button>
  )
}
