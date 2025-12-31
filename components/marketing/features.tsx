"use client";

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
  },
  {
    icon: Palette,
    title: "Customizable Backgrounds",
    description:
      "Choose from solid colors, gradients, or upload your own background images.",
  },
  {
    icon: Layers,
    title: "Text Overlays",
    description:
      "Add headlines, descriptions, and badges to highlight your app's best features.",
  },
  {
    icon: Download,
    title: "High-Quality Export",
    description:
      "Export at exact App Store and Play Store dimensions. Ready for submission.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Real-time preview. No waiting. Create multiple screenshots in minutes, not hours.",
  },
  {
    icon: Shield,
    title: "Free Forever",
    description:
      "No hidden fees. No watermarks. Everything you need to launch your app.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to create{" "}
            <span className="text-primary">professional screenshots</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No design experience required. Our intuitive editor makes it easy to
            create stunning app store assets.
          </p>
        </div>

        {/* Features grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
