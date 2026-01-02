"use client";

import { motion } from "motion/react";
import {
  Smartphone,
  Download,
  Palette,
  Layers,
  Zap,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Multiple Devices",
    description:
      "iPhone 15 Pro, Pixel 8 Pro, Galaxy S24, and more. All the latest devices at your fingertips.",
    gradient: "from-[var(--accent-orange)] to-[var(--accent-amber)]",
  },
  {
    icon: Palette,
    title: "Customizable Backgrounds",
    description:
      "Choose from solid colors, gradients, or upload your own background images.",
    gradient: "from-[var(--accent-amber)] to-[var(--accent-gold)]",
  },
  {
    icon: Layers,
    title: "Text Overlays",
    description:
      "Add headlines, descriptions, and badges to highlight your app's best features.",
    gradient: "from-[var(--accent-gold)] to-[var(--accent-amber)]",
  },
  {
    icon: Download,
    title: "High-Quality Export",
    description:
      "Export at exact App Store and Play Store dimensions. Ready for submission.",
    gradient: "from-[var(--accent-coral)] to-[var(--accent-orange)]",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Real-time preview. No waiting. Create multiple screenshots in minutes, not hours.",
    gradient: "from-[var(--accent-orange)] to-[var(--accent-coral)]",
  },
  {
    icon: Shield,
    title: "Free Forever",
    description:
      "No hidden fees. No watermarks. Everything you need to launch your app.",
    gradient: "from-[var(--accent-rose)] to-[var(--accent-coral)]",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function Features() {
  return (
    <section id="features" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 h-[400px] w-[400px] rounded-full bg-[var(--accent-orange)] opacity-5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 h-[500px] w-[500px] rounded-full bg-[var(--accent-amber)] opacity-5 blur-[100px]" />
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
            <span className="gradient-text">professional screenshots</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No design experience required. Our intuitive editor makes it easy to
            create stunning app store assets.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative"
            >
              {/* Gradient border on hover */}
              <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

              {/* Glow effect */}
              <div className={`absolute -inset-2 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20`} />

              {/* Card content */}
              <div className="relative rounded-2xl glass-card border-0 p-6 h-full">
                {/* Icon with gradient background */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} text-white shadow-soft`}
                >
                  <feature.icon className="h-6 w-6" />
                </motion.div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative corner accent */}
                <div className={`absolute top-0 right-0 h-20 w-20 rounded-bl-full bg-gradient-to-br ${feature.gradient} opacity-5`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
