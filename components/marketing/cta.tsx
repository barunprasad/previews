"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { MovingBorderButton } from "@/components/ui/aceternity/moving-border";

export function CTA() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 md:py-24"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 -z-10 gradient-bg opacity-95" />

          {/* Aurora effects */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20 blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, -40, 0],
                y: [0, 40, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/20 blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"
            />
          </div>

          {/* Floating sparkles */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[15%] top-[20%]"
          >
            <Sparkles className="h-6 w-6 text-white/40" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-[20%] top-[30%]"
          >
            <Sparkles className="h-5 w-5 text-white/30" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute left-[25%] bottom-[25%]"
          >
            <Sparkles className="h-4 w-4 text-white/25" />
          </motion.div>

          {/* Content */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            Ready to create beautiful app screenshots?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative mx-auto mt-6 max-w-xl text-lg text-white/80"
          >
            Join thousands of developers who trust Previews to create stunning
            app store assets. Get started for free today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/signup">
              <MovingBorderButton
                duration={3000}
                borderClassName="stroke-white"
                className="bg-white text-[var(--accent-orange)] hover:bg-white/95 font-semibold"
                containerClassName="shadow-elevated"
              >
                <span className="flex items-center gap-2">
                  Get Started for Free
                  <ArrowRight className="h-4 w-4" />
                </span>
              </MovingBorderButton>
            </Link>
          </motion.div>

          {/* Decorative border glow */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20" />
        </motion.div>
      </div>
    </section>
  );
}
