"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "@/components/ui/aceternity/text-generate-effect";
import { SpotlightCard, Spotlight } from "@/components/ui/aceternity/spotlight";
import { GridBeams } from "@/components/ui/aceternity/background-beams";

// Samsung Galaxy S25 Ultra CSS Mockup Component
function SamsungGalaxyS25Ultra({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Device frame - Samsung's more squared design */}
      <div className="relative h-[280px] w-[135px] md:h-[400px] md:w-[192px] rounded-[16px] md:rounded-[20px] bg-gradient-to-b from-zinc-400 via-zinc-500 to-zinc-600 dark:from-zinc-500 dark:via-zinc-600 dark:to-zinc-700 p-[3px] shadow-2xl">
        {/* Titanium frame edge highlight */}
        <div className="absolute inset-0 rounded-[16px] md:rounded-[20px] bg-gradient-to-br from-white/40 via-transparent to-white/10 dark:from-white/30 dark:via-transparent dark:to-white/10 pointer-events-none" />

        {/* Inner bezel */}
        <div className="relative h-full w-full rounded-[13px] md:rounded-[17px] bg-zinc-900 dark:bg-black overflow-hidden ring-1 ring-zinc-700 dark:ring-zinc-600">
          {/* Punch-hole camera - Samsung style (centered) */}
          <div className="absolute left-1/2 top-[8px] md:top-[12px] z-20 h-[8px] w-[8px] md:h-[12px] md:w-[12px] -translate-x-1/2 rounded-full bg-zinc-950 ring-1 ring-zinc-700">
            <div className="absolute inset-[2px] md:inset-[3px] rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800" />
          </div>

          {/* Screen content */}
          <div className="h-full w-full rounded-[13px] md:rounded-[17px] overflow-hidden">
            {children}
          </div>
        </div>
      </div>

      {/* Side buttons - Power button */}
      <div className="absolute right-[-2px] top-[70px] md:top-[100px] h-[35px] md:h-[50px] w-[3px] rounded-r-sm bg-gradient-to-b from-zinc-400 via-zinc-500 to-zinc-600 dark:from-zinc-500 dark:via-zinc-600 dark:to-zinc-700" />

      {/* Side buttons - Volume */}
      <div className="absolute right-[-2px] top-[115px] md:top-[165px] h-[50px] md:h-[70px] w-[3px] rounded-r-sm bg-gradient-to-b from-zinc-400 via-zinc-500 to-zinc-600 dark:from-zinc-500 dark:via-zinc-600 dark:to-zinc-700" />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="var(--accent-orange)"
      />

      {/* Aurora Background */}
      <div className="aurora-bg absolute inset-0 -z-10" />

      {/* Grid beams */}
      <GridBeams className="-z-10 opacity-30" />

      {/* Additional gradient overlay for depth (optimized blur values) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-[var(--accent-orange)] opacity-15 blur-[60px]" />
        <div className="absolute right-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-[var(--accent-amber)] opacity-12 blur-[60px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--accent-coral)] opacity-10 blur-[80px]" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="h-4 w-4 text-[var(--accent-orange)]" />
            </motion.div>
            <span className="text-muted-foreground">
              Free, fast, and professional
            </span>
          </motion.div>

          {/* Headline with text generate effect */}
          <div className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <TextGenerateEffect
              words="Create stunning app store screenshots in minutes"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
              duration={0.4}
              highlightWords={["stunning", "screenshots"]}
            />
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Generate beautiful device mockups for iOS and Android. No design
            skills needed. Perfect for indie developers and startups.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button size="lg" asChild className="group relative gap-2 px-8 overflow-hidden">
              <Link href="/signup">
                <span className="relative z-10 flex items-center gap-2">
                  Start Creating
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-orange)] via-[var(--accent-coral)] to-[var(--accent-rose)] opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="glass border-0 px-8 hover:bg-white/20 dark:hover:bg-white/10">
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-10 text-sm text-muted-foreground"
          >
            No credit card required. Free forever for basic use.
          </motion.p>
        </div>

        {/* Hero Preview with spotlight effect */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          className="relative mt-16 md:mt-24"
        >
          {/* Glow effect behind the card */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[var(--accent-orange)]/30 via-[var(--accent-amber)]/20 to-[var(--accent-coral)]/30 blur-3xl opacity-50" />

          {/* Main preview card with spotlight */}
          <SpotlightCard
            className="rounded-2xl"
            spotlightColor="rgba(249, 115, 22, 0.12)"
          >
            <div className="glass-card overflow-hidden rounded-2xl">
              {/* Mock editor UI header */}
              <div className="flex items-center gap-2 border-b border-white/10 dark:border-white/5 px-4 py-3 bg-white/30 dark:bg-black/20">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md gradient-bg" />
                  <span className="text-sm font-medium text-muted-foreground">Previews Editor</span>
                </div>
                <div className="ml-auto flex gap-2">
                  <div className="h-6 w-16 rounded-md bg-muted/50" />
                  <div className="h-6 w-20 rounded-md gradient-bg opacity-80" />
                </div>
              </div>

              {/* Preview content area */}
              <div className="flex min-h-[300px] items-center justify-center p-8 md:min-h-[400px] lg:min-h-[500px] bg-gradient-to-br from-white/5 to-white/0 dark:from-white/5 dark:to-transparent">
                <div className="flex flex-col items-center gap-6 md:flex-row md:gap-12 lg:gap-16">
                  {/* iPhone 17 Pro mockup with real bezel */}
                  <div className="relative device-float">
                    {/* Device glow */}
                    <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-b from-[var(--accent-orange)]/20 to-[var(--accent-amber)]/10 blur-xl" />

                    {/* Real iPhone 17 Pro bezel */}
                    <div className="relative h-[280px] w-[137px] md:h-[400px] md:w-[196px]">
                      <Image
                        src="/bezels/iPhone17Pro/Color=CosmicOrange.svg"
                        alt="iPhone 17 Pro"
                        fill
                        className="object-contain"
                        priority
                      />
                      {/* Screen content overlay */}
                      <div
                        className="absolute bg-gradient-to-br from-[var(--accent-orange)]/40 via-[var(--accent-amber)]/30 to-[var(--accent-coral)]/40"
                        style={{
                          left: '5.3%',
                          top: '2.5%',
                          width: '89.3%',
                          height: '95%',
                          borderRadius: '26px',
                        }}
                      >
                        {/* Mock app content */}
                        <div className="h-full w-full p-3 pt-8 md:p-4 md:pt-10">
                          <div className="space-y-2 md:space-y-3">
                            <div className="h-4 md:h-6 w-3/4 rounded-md bg-white/25" />
                            <div className="h-3 md:h-4 w-1/2 rounded-md bg-white/20" />
                            <div className="mt-3 md:mt-4 h-16 md:h-24 w-full rounded-lg bg-white/15" />
                            <div className="h-3 md:h-4 w-2/3 rounded-md bg-white/20" />
                            <div className="h-3 md:h-4 w-1/3 rounded-md bg-white/15" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute -bottom-2 -right-2 rounded-full gradient-bg px-3 py-1 text-xs font-medium text-white shadow-lg glow-sm transition-transform hover:scale-110">
                      iPhone 17 Pro
                    </div>
                  </div>

                  {/* Samsung Galaxy S25 Ultra mockup */}
                  <div className="relative device-float-delayed">
                    {/* Device glow */}
                    <div className="absolute -inset-4 rounded-[24px] bg-gradient-to-b from-blue-500/20 to-purple-500/10 blur-xl" />

                    <SamsungGalaxyS25Ultra>
                      {/* Screen content */}
                      <div className="h-full w-full bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-pink-500/40 p-3 pt-6 md:p-4 md:pt-8">
                        <div className="space-y-2 md:space-y-3">
                          <div className="h-4 md:h-6 w-3/4 rounded-md bg-white/25" />
                          <div className="h-3 md:h-4 w-1/2 rounded-md bg-white/20" />
                          <div className="mt-3 md:mt-4 grid grid-cols-2 gap-1 md:gap-2">
                            <div className="h-12 md:h-20 rounded-lg bg-white/15" />
                            <div className="h-12 md:h-20 rounded-lg bg-white/15" />
                          </div>
                          <div className="h-3 md:h-4 w-2/3 rounded-md bg-white/20" />
                        </div>
                      </div>
                    </SamsungGalaxyS25Ultra>

                    <div className="absolute -bottom-2 -right-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-xs font-medium text-white shadow-lg transition-transform hover:scale-110">
                      Galaxy S25 Ultra
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Decorative floating elements (CSS animations) */}
          <div className="absolute -left-8 top-1/4 h-16 w-16 rounded-2xl gradient-bg opacity-20 blur-sm md:h-24 md:w-24 decorative-float" />
          <div className="absolute -right-4 bottom-1/4 h-12 w-12 rounded-full bg-[var(--accent-coral)] opacity-30 blur-sm md:h-20 md:w-20 decorative-float-reverse" />
        </motion.div>
      </div>
    </section>
  );
}
