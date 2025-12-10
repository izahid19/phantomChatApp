"use client"

import { forwardRef } from "react"
import { ShieldCheck } from "lucide-react"
import {
  SelfDestructCard,
  EncryptionCard,
  PasscodeCard,
  AnonymousCard,
  RealTimeCard,
} from "./FeatureSectionComponent"

export const FeatureSection = forwardRef<HTMLElement>(
  function FeatureSection(props, ref) {
    return (
      <section
        ref={ref as React.RefObject<HTMLElement>}
        className="py-20 px-4 relative overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-foreground/2 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="section-header inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium rounded-full mb-4 opacity-0">
              <ShieldCheck className="w-4 h-4" /> Built for Privacy
            </span>
            <h2 className="section-header text-3xl md:text-5xl font-bold text-foreground mb-4 opacity-0">
              Essential tools for{" "}
              <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                your privacy
              </span>
            </h2>
            <p className="section-header text-muted max-w-2xl mx-auto text-lg opacity-0">
              Built for privacy-conscious conversations that leave no digital footprint.
            </p>
          </div>

          {/* Bento Grid - 2 columns layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Card 1 - Self-Destructing with LIVE TIMER */}
            <SelfDestructCard />

            {/* Card 2 - Encrypted with SCRAMBLE ANIMATION */}
            <EncryptionCard />

            {/* Card 3 - Passcode with AUTO-TYPING */}
            <PasscodeCard />

            {/* Card 4 - Anonymous with USERNAME GENERATOR */}
            <AnonymousCard />

            {/* Card 5 - Real-Time with AUTO-PLAYING CHAT */}
            <RealTimeCard />

          </div>
        </div>
      </section>
    )
  }
)
