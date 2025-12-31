"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              Free, fast, and professional
            </span>
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Create stunning{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              app store
            </span>{" "}
            screenshots in minutes
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Generate beautiful device mockups for iOS and Android. No design
            skills needed. Perfect for indie developers and startups.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2 px-8">
              <Link href="/signup">
                Start Creating
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8">
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          {/* Social proof */}
          <p className="mt-10 text-sm text-muted-foreground">
            No credit card required. Free forever for basic use.
          </p>
        </div>

        {/* Hero Image/Preview */}
        <div className="relative mt-16 md:mt-24">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            {/* Mock editor UI */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="ml-4 h-6 w-48 rounded-md bg-muted" />
            </div>
            <div className="flex min-h-[300px] items-center justify-center bg-muted/30 p-8 md:min-h-[400px] lg:min-h-[500px]">
              {/* Placeholder for actual preview */}
              <div className="flex flex-col items-center gap-6 md:flex-row md:gap-12">
                {/* iPhone mockup placeholder */}
                <div className="relative">
                  <div className="h-[280px] w-[140px] rounded-[24px] border-4 border-foreground/20 bg-gradient-to-br from-primary/10 to-primary/5 p-2 shadow-xl md:h-[400px] md:w-[200px]">
                    <div className="h-full w-full rounded-[18px] bg-background/80" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-lg">
                    iPhone
                  </div>
                </div>

                {/* Android mockup placeholder */}
                <div className="relative">
                  <div className="h-[280px] w-[140px] rounded-[16px] border-4 border-foreground/20 bg-gradient-to-br from-green-500/10 to-green-500/5 p-2 shadow-xl md:h-[400px] md:w-[200px]">
                    <div className="h-full w-full rounded-[12px] bg-background/80" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white shadow-lg">
                    Android
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
