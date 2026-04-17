import Image from "next/image"

export function FooterSection() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
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
            href="https://www.linkedin.com/company/manageandmore/"
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
