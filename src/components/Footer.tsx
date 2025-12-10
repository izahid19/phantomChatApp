import { ShieldCheck, Wind, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-[var(--card-border)]">
      <div className="max-w-6xl mx-auto text-center text-sm text-zinc-500 dark:text-zinc-400 space-y-3">
        <div className="footer-content opacity-0 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-500" /> End-to-end encrypted</span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
          <span className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-blue-500" /> Self-destructing</span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
          <span className="flex items-center gap-1.5">👻 Anonymous</span>
        </div>
        <p className="footer-content opacity-0 flex items-center justify-center gap-1">
          Built with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> by{" "}
          <a
            href="https://devzahid.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-purple-500 transition-colors underline decoration-purple-500/30 hover:decoration-purple-500"
          >
            Zahid
          </a>
        </p>
      </div>
    </footer>
  )
}
