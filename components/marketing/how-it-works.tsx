"use client";

import { motion } from "motion/react";
import { Upload, LayoutTemplate, Wand2, Download } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: LayoutTemplate,
    title: "Pick a template",
    description:
      "Browse our library of professionally designed templates, or start from scratch with any device.",
    gradient: "from-[var(--accent-orange)] to-[var(--accent-amber)]",
  },
  {
    step: "02",
    icon: Upload,
    title: "Upload your screenshots",
    description:
      "Drag and drop your app screenshots. They automatically fit the device screen perfectly.",
    gradient: "from-[var(--accent-amber)] to-[var(--accent-gold)]",
  },
  {
    step: "03",
    icon: Wand2,
    title: "Customize your design",
    description:
      "Add backgrounds, text overlays, badges, and adjust positioning to make it perfect.",
    gradient: "from-[var(--accent-coral)] to-[var(--accent-orange)]",
  },
  {
    step: "04",
    icon: Download,
    title: "Export and submit",
    description:
      "Download high-resolution mockups in exact App Store and Play Store dimensions.",
    gradient: "from-[var(--accent-orange)] to-[var(--accent-coral)]",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 glass" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-[300px] w-[300px] rounded-full bg-[var(--accent-orange)] opacity-5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-[var(--accent-amber)] opacity-5 blur-[100px]" />
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
            Create your first mockup in{" "}
            <span className="gradient-text">4 simple steps</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From screenshot to store-ready asset in minutes. No design skills
            required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Animated connector line - hidden on mobile */}
          <div className="absolute left-1/2 top-12 hidden h-[calc(100%-96px)] w-px -translate-x-1/2 lg:block">
            <div className="h-full w-full bg-gradient-to-b from-[var(--accent-orange)] via-[var(--accent-amber)] to-[var(--accent-coral)] opacity-30" />
          </div>

          <div className="grid gap-12 lg:gap-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col items-center gap-6 lg:flex-row lg:gap-12 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div
                  className={`flex-1 text-center lg:text-left ${
                    index % 2 === 1 ? "lg:text-right" : ""
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  >
                    <div
                      className={`mb-2 text-sm font-medium gradient-text ${
                        index % 2 === 1 ? "lg:text-right" : ""
                      }`}
                    >
                      Step {step.step}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </motion.div>
                </div>

                {/* Icon with gradient background */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10"
                >
                  {/* Glow effect */}
                  <div className={`absolute -inset-2 rounded-2xl bg-gradient-to-r ${step.gradient} opacity-20 blur-xl`} />

                  <div className={`relative flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r ${step.gradient} shadow-elevated`}>
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                </motion.div>

                {/* Spacer for alignment */}
                <div className="hidden flex-1 lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
