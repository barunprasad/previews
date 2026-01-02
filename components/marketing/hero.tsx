"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Aurora Background */}
      <div className="aurora-bg absolute inset-0 -z-10" />

      {/* Additional gradient overlay for depth */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-[var(--accent-orange)] opacity-20 blur-[100px]" />
        <div className="absolute right-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent-amber)] opacity-15 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--accent-coral)] opacity-10 blur-[120px]" />
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

          {/* Headline with gradient text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Create stunning{" "}
            <span className="gradient-text">
              app store
            </span>{" "}
            screenshots in minutes
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Generate beautiful device mockups for iOS and Android. No design
            skills needed. Perfect for indie developers and startups.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 text-sm text-muted-foreground"
          >
            No credit card required. Free forever for basic use.
          </motion.p>
        </div>

        {/* Hero Preview with floating animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative mt-16 md:mt-24"
        >
          {/* Glow effect behind the card */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[var(--accent-orange)]/30 via-[var(--accent-amber)]/20 to-[var(--accent-coral)]/30 blur-3xl opacity-50" />

          {/* Main preview card with glass effect */}
          <div className="relative overflow-hidden rounded-2xl glass-card">
            {/* Mock editor UI header */}
            <div className="flex items-center gap-2 border-b border-white/10 dark:border-white/5 px-4 py-3 bg-white/30 dark:bg-black/20">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="ml-4 h-6 w-48 rounded-md bg-muted/50" />
            </div>

            {/* Preview content area */}
            <div className="flex min-h-[300px] items-center justify-center p-8 md:min-h-[400px] lg:min-h-[500px] bg-gradient-to-br from-white/5 to-white/0 dark:from-white/5 dark:to-transparent">
              <div className="flex flex-col items-center gap-6 md:flex-row md:gap-12">
                {/* iPhone mockup with floating animation */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="h-[280px] w-[140px] rounded-[24px] border-4 border-foreground/10 bg-gradient-to-br from-[var(--accent-orange)]/20 to-[var(--accent-amber)]/10 p-2 shadow-elevated md:h-[400px] md:w-[200px]">
                    <div className="h-full w-full rounded-[18px] bg-background/80 backdrop-blur-sm" />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="absolute -bottom-2 -right-2 rounded-full gradient-bg px-3 py-1 text-xs font-medium text-white shadow-lg glow-sm"
                  >
                    iPhone
                  </motion.div>
                </motion.div>

                {/* Android mockup with offset floating animation */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="relative"
                >
                  <div className="h-[280px] w-[140px] rounded-[16px] border-4 border-foreground/10 bg-gradient-to-br from-[var(--accent-gold)]/20 to-[var(--accent-coral)]/10 p-2 shadow-elevated md:h-[400px] md:w-[200px]">
                    <div className="h-full w-full rounded-[12px] bg-background/80 backdrop-blur-sm" />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="absolute -bottom-2 -right-2 rounded-full bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-coral)] px-3 py-1 text-xs font-medium text-white shadow-lg glow-sm"
                  >
                    Android
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Decorative floating elements */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-8 top-1/4 h-16 w-16 rounded-2xl gradient-bg opacity-20 blur-sm md:h-24 md:w-24"
          />
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-4 bottom-1/4 h-12 w-12 rounded-full bg-[var(--accent-coral)] opacity-30 blur-sm md:h-20 md:w-20"
          />
        </motion.div>
      </div>
    </section>
  );
}
