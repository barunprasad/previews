"use client";

import { motion } from "motion/react";
import {
  Smartphone,
  Download,
  Palette,
  Layers,
  Zap,
  Shield,
  LayoutTemplate,
  Sparkles,
  Package,
} from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/aceternity/bento-grid";

const features = [
  {
    icon: Smartphone,
    title: "Multiple Devices",
    description:
      "iPhone 17 Pro, Pixel 9 Pro, Galaxy S24, and more. All the latest devices at your fingertips.",
    gradient: "from-violet-500 to-purple-500",
    header: (
      <div className="flex h-full min-h-[8rem] items-center justify-center gap-4 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 dark:from-violet-500/20 dark:via-purple-500/10 dark:to-fuchsia-500/20 p-4">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="h-20 w-10 rounded-[12px] bg-gradient-to-b from-slate-800 to-slate-900 p-[2px] shadow-xl ring-1 ring-white/10"
        >
          <div className="h-full w-full rounded-[10px] bg-gradient-to-br from-violet-500 to-purple-600" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="h-20 w-10 rounded-[10px] bg-gradient-to-b from-slate-800 to-slate-900 p-[2px] shadow-xl ring-1 ring-white/10"
        >
          <div className="h-full w-full rounded-[8px] bg-gradient-to-br from-fuchsia-500 to-pink-600" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          className="h-20 w-10 rounded-[10px] bg-gradient-to-b from-slate-800 to-slate-900 p-[2px] shadow-xl ring-1 ring-white/10"
        >
          <div className="h-full w-full rounded-[8px] bg-gradient-to-br from-cyan-500 to-blue-600" />
        </motion.div>
      </div>
    ),
  },
  {
    icon: LayoutTemplate,
    title: "Pro Templates",
    description:
      "Start with professionally designed templates. Just swap your screenshots and you're ready to publish.",
    gradient: "from-rose-500 to-pink-500",
    header: (
      <div className="flex h-full min-h-[8rem] items-center justify-center bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-fuchsia-500/10 dark:from-rose-500/20 dark:via-pink-500/10 dark:to-fuchsia-500/20 p-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative h-24 w-12 rounded-lg bg-gradient-to-b from-slate-800 to-slate-900 p-[2px] shadow-xl ring-1 ring-white/10"
            >
              <div className="h-full w-full rounded-[6px] overflow-hidden bg-gradient-to-br from-rose-500/20 to-pink-600/20">
                <div className="h-2 w-6 mx-auto mt-2 rounded-sm bg-white/30" />
                <div className="h-1.5 w-4 mx-auto mt-1 rounded-sm bg-white/20" />
                <div className="h-8 w-8 mx-auto mt-2 rounded bg-white/15" />
              </div>
              {i === 1 && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Palette,
    title: "Customizable Backgrounds",
    description:
      "Choose from solid colors, gradients, or upload your own background images.",
    gradient: "from-cyan-500 to-blue-500",
    header: (
      <div className="flex h-full min-h-[8rem] items-center justify-center bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-indigo-500/10 dark:from-cyan-500/20 dark:via-blue-500/10 dark:to-indigo-500/20 p-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            "bg-gradient-to-br from-violet-500 to-purple-600",
            "bg-gradient-to-br from-cyan-500 to-blue-600",
            "bg-gradient-to-br from-emerald-500 to-teal-600",
            "bg-gradient-to-br from-orange-500 to-red-600",
            "bg-gradient-to-br from-pink-500 to-rose-600",
            "bg-gradient-to-br from-amber-500 to-orange-600",
          ].map((gradient, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className={`h-8 w-8 rounded-lg shadow-lg ring-1 ring-white/20 ${gradient}`}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Layers,
    title: "Text Overlays",
    description:
      "Add headlines, descriptions, and badges to highlight your app's best features.",
    gradient: "from-emerald-500 to-teal-500",
    header: (
      <div className="flex h-full min-h-[8rem] flex-col items-center justify-center gap-2 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-500/20 dark:via-teal-500/10 dark:to-cyan-500/20 p-4">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "80%" }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="h-4 rounded-full bg-gradient-to-r from-emerald-500/40 to-teal-500/40 dark:from-emerald-500/50 dark:to-teal-500/50"
        />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "60%" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="h-3 rounded-full bg-gradient-to-r from-teal-500/30 to-cyan-500/30 dark:from-teal-500/40 dark:to-cyan-500/40"
        />
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-xs text-white font-medium shadow-lg"
        >
          New Feature
        </motion.div>
      </div>
    ),
  },
  {
    icon: Download,
    title: "High-Quality Export",
    description:
      "Export at exact App Store and Play Store dimensions. Ready for submission.",
    gradient: "from-pink-500 to-rose-500",
    header: (
      <div className="flex h-full min-h-[8rem] items-center justify-center bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-red-500/10 dark:from-pink-500/20 dark:via-rose-500/10 dark:to-red-500/20 p-4">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 rounded-xl bg-white/80 dark:bg-white/10 backdrop-blur-sm px-4 py-2.5 shadow-lg ring-1 ring-black/5 dark:ring-white/10"
        >
          <Download className="h-5 w-5 text-pink-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-white">Export PNG</span>
        </motion.div>
      </div>
    ),
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Real-time preview. No waiting. Create multiple screenshots in minutes, not hours.",
    gradient: "from-amber-500 to-orange-500",
    header: (
      <div className="relative flex h-full min-h-[8rem] items-center justify-center overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 dark:from-amber-500/20 dark:via-orange-500/10 dark:to-red-500/20 p-4">
        <motion.div
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute"
        >
          <Zap className="h-20 w-20 text-amber-500/30 dark:text-amber-400/30" />
        </motion.div>
        <Zap className="h-12 w-12 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
      </div>
    ),
  },
  {
    icon: Shield,
    title: "Free Forever",
    description:
      "No hidden fees. No watermarks. Everything you need to launch your app.",
    gradient: "from-indigo-500 to-violet-500",
    header: (
      <div className="flex h-full min-h-[8rem] items-center justify-center bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-purple-500/10 dark:from-indigo-500/20 dark:via-violet-500/10 dark:to-purple-500/20 p-4">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative"
        >
          <Shield className="h-14 w-14 text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-indigo-500/30 blur-xl"
          />
        </motion.div>
      </div>
    ),
  },
  {
    icon: Sparkles,
    title: "Smart Background Removal",
    description:
      "Remove backgrounds from your screenshots. Fast, private, and works offline.",
    gradient: "from-fuchsia-500 to-purple-500",
    header: (
      <div className="flex h-full min-h-[8rem] items-center justify-center bg-gradient-to-br from-fuchsia-500/10 via-purple-500/5 to-violet-500/10 dark:from-fuchsia-500/20 dark:via-purple-500/10 dark:to-violet-500/20 p-4">
        <div className="relative">
          {/* Before/After split visualization */}
          <div className="flex items-center gap-1">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-16 w-12 rounded-lg bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 p-1 shadow-lg"
            >
              <div className="h-full w-full rounded bg-slate-200 dark:bg-slate-500" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="h-5 w-5 text-fuchsia-500" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="h-16 w-12 rounded-lg p-1 shadow-lg ring-2 ring-fuchsia-500/50"
              style={{
                background: "repeating-conic-gradient(#e5e5e5 0% 25%, #ffffff 0% 50%) 50% / 8px 8px",
              }}
            >
              <div className="h-full w-full rounded bg-gradient-to-br from-fuchsia-500/80 to-purple-600/80" />
            </motion.div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Package,
    title: "Batch Export",
    description:
      "Export all your screenshots at once. Multiple sizes for App Store and Play Store in one click.",
    gradient: "from-teal-500 to-cyan-500",
    header: (
      <div className="flex h-full min-h-[8rem] items-center justify-center bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-blue-500/10 dark:from-teal-500/20 dark:via-cyan-500/10 dark:to-blue-500/20 p-4">
        <div className="relative">
          {/* Stacked export files animation */}
          <div className="relative">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="absolute rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg"
                style={{
                  width: `${48 - i * 8}px`,
                  height: `${64 - i * 8}px`,
                  top: `${i * 6}px`,
                  left: `${i * 6}px`,
                  opacity: 1 - i * 0.2,
                }}
              >
                <div className="absolute bottom-1 right-1">
                  <Download className="h-3 w-3 text-white/80" />
                </div>
              </motion.div>
            ))}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative ml-16 mt-2 flex items-center gap-1 rounded-full bg-teal-500 px-2 py-1 text-[10px] font-medium text-white shadow-lg"
            >
              <Package className="h-3 w-3" />
              ZIP
            </motion.div>
          </div>
        </div>
      </div>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 h-[400px] w-[400px] rounded-full bg-violet-500 opacity-5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500 opacity-5 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to create{" "}
            <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">professional screenshots</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No design experience required. Our intuitive editor makes it easy to
            create stunning app store assets.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="mt-16">
          <BentoGrid className="md:auto-rows-[20rem]">
            {features.map((feature) => (
              <BentoGridItem
                key={feature.title}
                title={feature.title}
                description={feature.description}
                header={feature.header}
                icon={<feature.icon className="h-5 w-5" />}
                gradient={feature.gradient}
              />
            ))}
          </BentoGrid>
        </div>
      </div>
    </section>
  );
}
