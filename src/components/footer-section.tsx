import Image from "next/image"
import { BANK_DETAILS } from "@/lib/constants"

export function FooterSection() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logos/mm-logo.webp"
            alt="Manage and More"
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

        <div className="w-full rounded-lg border border-border bg-muted/40 p-4 text-sm">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Bank details
          </p>
          <dl className="grid gap-1.5 sm:grid-cols-[auto_1fr] sm:gap-x-4">
            <dt className="text-muted-foreground">Account holder</dt>
            <dd className="font-medium">{BANK_DETAILS.accountHolder}</dd>
            <dt className="text-muted-foreground">IBAN</dt>
            <dd className="font-mono">{BANK_DETAILS.iban}</dd>
            <dt className="text-muted-foreground">BIC</dt>
            <dd className="font-mono">{BANK_DETAILS.bic}</dd>
          </dl>
        </div>

        <div className="flex gap-4 text-xs text-muted-foreground">
          <a
            href="https://www.manageandmore.de"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center hover:text-accent"
          >
            Website
          </a>
          <a
            href="https://www.linkedin.com/school/manage&more-by-unternehmertum/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/manageandmore/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center hover:text-accent"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  )
}
