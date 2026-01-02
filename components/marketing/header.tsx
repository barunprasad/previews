"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Smartphone } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "glass border-b border-white/10 dark:border-white/5 shadow-soft"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo with glow effect */}
        <Link href="/" className="group flex items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-bg shadow-soft"
          >
            <Smartphone className="h-4.5 w-4.5 text-white" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.div>
          <span className="text-lg font-bold tracking-tight">
            <span className="gradient-text">Previews</span>
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden items-center gap-8 md:flex">
          {[
            { href: "#features", label: "Features" },
            { href: "#how-it-works", label: "How it Works" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
              {/* Animated underline */}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-amber)] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:flex hover:bg-white/20 dark:hover:bg-white/10"
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="sm"
              asChild
              className="relative overflow-hidden gradient-bg border-0 shadow-soft hover:shadow-medium transition-shadow"
            >
              <Link href="/signup">
                <span className="relative z-10">Get Started</span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
