"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function LandingPage() {
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ghost floating animation
      gsap.to(ghostRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })

      // Initial entrance animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(
        ghostRef.current,
        { scale: 0, opacity: 0, rotation: -180 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1 }
      )
        .fromTo(
          titleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.3"
        )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          ".feature-card",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.15, duration: 0.6 },
          "-=0.2"
        )
        .fromTo(
          ctaRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.2"
        )
        .fromTo(
          footerRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.4"
        )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const features = [
    {
      icon: "🔥",
      title: "Self-Destructing",
      description: "Messages vanish after 10 minutes. No traces left behind.",
    },
    {
      icon: "🔐",
      title: "Passcode Protected",
      description: "6-digit passcode ensures only invited users can join.",
    },
    {
      icon: "⚡",
      title: "Real-Time",
      description: "Instant messaging with live typing indicators.",
    },
  ]

  return (
    <main
      ref={heroRef}
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-[var(--background)] overflow-hidden"
    >
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Gradient background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-8 md:space-y-12">
        {/* Hero Section */}
        <div className="space-y-6">
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
        </div>

        {/* Features */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card p-4 md:p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg backdrop-blur-md hover:border-purple-500/50 transition-all duration-300 hover:scale-105 opacity-0"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--muted)]">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="space-y-4 opacity-0">
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

        {/* Footer */}
        <div ref={footerRef} className="pt-8 text-sm text-zinc-500 dark:text-zinc-400 opacity-0 space-y-2">
          <p>🔒 End-to-end encrypted • 💨 Self-destructing • 👻 Anonymous</p>
          <p>
            Built with ❤️ by{" "}
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
      </div>
    </main>
  )
}
