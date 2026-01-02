"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Smartphone } from "lucide-react";

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
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg shadow-soft">
                <Smartphone className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="gradient-text">Previews</span>
              </span>
            </Link>
          </motion.div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-8">
            {[
              { href: "#features", label: "Features" },
              { href: "#how-it-works", label: "How it Works" },
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
      </div>
    </footer>
  );
}
