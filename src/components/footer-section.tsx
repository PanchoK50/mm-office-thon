export function FooterSection() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center text-sm text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">
            manage<span className="text-accent">&</span>more
          </span>
          {" "}&mdash; UnternehmerTUM GmbH
        </p>
        <div className="flex gap-4 text-xs">
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
