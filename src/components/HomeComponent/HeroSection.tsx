"use client"

import { forwardRef } from "react"
import { useRouter } from "next/navigation"

interface HeroSectionProps {
  ghostRef: React.RefObject<HTMLSpanElement | null>
  titleRef: React.RefObject<HTMLHeadingElement | null>
  subtitleRef: React.RefObject<HTMLParagraphElement | null>
  ctaRef: React.RefObject<HTMLDivElement | null>
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  function HeroSection({ ghostRef, titleRef, subtitleRef, ctaRef }, ref) {
    const router = useRouter()

    return (
      <section
        ref={ref as React.RefObject<HTMLElement>}
        className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden"
      >
        {/* Gradient background effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-pink-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-6">
          <span
            ref={ghostRef}
            className="inline-block text-6xl md:text-9xl cursor-default select-none opacity-0"
          >
            👻
          </span>

          <h1
            ref={titleRef}
            className="text-4xl md:text-7xl font-bold tracking-tight opacity-0"
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Phantom
            </span>
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg md:text-2xl text-[var(--muted)] max-w-xl mx-auto opacity-0"
          >
            Private conversations that vanish into thin air.
            <br />
            <span className="text-[var(--muted-foreground)]">
              No sign-up. No history. No trace.
            </span>
          </p>

          {/* CTA in Hero */}
          <div ref={ctaRef} className="space-y-4 opacity-0 pt-4">
            <button
              type="button"
              onClick={() => router.push("/room")}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-lg font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 cursor-pointer"
            >
              Start a Phantom Room
            </button>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Free. Anonymous. Secure.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-[var(--muted-foreground)] flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 bg-[var(--muted-foreground)] rounded-full" />
          </div>
        </div>
      </section>
    )
  }
)
