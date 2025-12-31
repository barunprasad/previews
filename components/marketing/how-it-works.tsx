"use client";

import { Upload, Smartphone, Wand2, Download } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Smartphone,
    title: "Choose your device",
    description:
      "Select from our collection of iPhone, Android, and tablet frames.",
  },
  {
    step: "02",
    icon: Upload,
    title: "Upload your screenshot",
    description:
      "Drag and drop your app screenshot. It will automatically fit the device screen.",
  },
  {
    step: "03",
    icon: Wand2,
    title: "Customize your design",
    description:
      "Add backgrounds, text overlays, and adjust positioning to make it perfect.",
  },
  {
    step: "04",
    icon: Download,
    title: "Export and submit",
    description:
      "Download your high-resolution mockup, ready for the App Store or Play Store.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-border bg-muted/30 py-20 md:py-32"
    >
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create your first mockup in{" "}
            <span className="text-primary">4 simple steps</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From screenshot to store-ready asset in minutes. No design skills
            required.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connector line - hidden on mobile */}
          <div className="absolute left-1/2 top-12 hidden h-[calc(100%-96px)] w-px -translate-x-1/2 bg-border lg:block" />

          <div className="grid gap-12 lg:gap-16">
            {steps.map((step, index) => (
              <div
                key={step.step}
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
                  <div
                    className={`mb-2 text-sm font-medium text-primary ${
                      index % 2 === 1 ? "lg:text-right" : ""
                    }`}
                  >
                    Step {step.step}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Icon */}
                <div className="relative z-10 flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl border border-border bg-card shadow-lg">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>

                {/* Spacer for alignment */}
                <div className="hidden flex-1 lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
