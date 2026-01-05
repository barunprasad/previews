"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-orange)]/50 to-transparent" />

      {/* Glass background */}
      <div className="absolute inset-0 -z-10 glass" />

      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[200px] w-[400px] bg-[var(--accent-orange)] opacity-5 blur-[100px]" />

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo */}
          <Logo href="/" size="lg" />

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-8">
            {[
              { href: "#features", label: "Features" },
              { href: "#how-it-works", label: "How it Works" },
              { href: "/terms", label: "Terms" },
              { href: "/privacy", label: "Privacy" },
              { href: "/login", label: "Sign in" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-amber)] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Previews. All rights reserved.
          </p>
        </div>

        {/* Divider */}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Built by section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex items-center justify-center gap-1.5 text-sm text-muted-foreground"
        >
          <span>Built with</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart className="h-4 w-4 fill-[var(--accent-coral)] text-[var(--accent-coral)]" />
          </motion.div>
          <span>by</span>
          <motion.a
            href="https://barunprasad.com"
            target="_blank"
            rel="noopener noreferrer"
            className="relative font-medium text-foreground transition-colors hover:text-[var(--accent-orange)]"
            whileHover={{ y: -1 }}
          >
            Barun Prasad
            <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-coral)] opacity-50" />
          </motion.a>
        </motion.div>
      </div>
    </footer>
  );
}
