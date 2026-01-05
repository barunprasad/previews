import { Metadata } from "next";
import Link from "next/link";
import { Shield, Database, Eye, Lock, UserCheck, Mail, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Previews - App Store Screenshot Generator",
};

const sections = [
  { id: "collection", label: "Data Collection", icon: Database },
  { id: "usage", label: "How We Use It", icon: Eye },
  { id: "storage", label: "Storage & Security", icon: Lock },
  { id: "rights", label: "Your Rights", icon: UserCheck },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full bg-[var(--accent-amber)] opacity-10 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-[var(--accent-coral)] opacity-10 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-24 md:py-32">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-orange)]/10 px-4 py-1.5 text-sm font-medium text-[var(--accent-orange)]">
            <Shield className="h-4 w-4" />
            Privacy
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: January 2025
          </p>
        </div>

        {/* Quick navigation */}
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-[var(--accent-orange)]/50 hover:text-foreground"
            >
              <section.icon className="h-3 w-3" />
              {section.label}
            </a>
          ))}
        </div>

        {/* TL;DR Card */}
        <div className="mb-8 rounded-xl border border-[var(--accent-orange)]/20 bg-[var(--accent-orange)]/5 p-6">
          <h3 className="mb-2 font-semibold text-[var(--accent-orange)]">TL;DR - The Short Version</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>We collect only what&apos;s needed to provide the service (email, name, your uploads)</li>
            <li>Your screenshots and mockups belong to you</li>
            <li>We don&apos;t sell your data or show you ads</li>
            <li>You can delete your account and data anytime</li>
          </ul>
        </div>

        {/* Content */}
        <div className="glass-card rounded-2xl p-8 md:p-12">
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-h2:text-xl prose-h2:font-semibold prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h2:mb-4 prose-h3:text-lg prose-a:text-[var(--accent-orange)] prose-a:no-underline hover:prose-a:underline prose-li:marker:text-[var(--accent-orange)]">

            <section>
              <h2>1. Introduction</h2>
              <p>
                Previews (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy and is committed
                to protecting your personal data. This Privacy Policy explains how we collect,
                use, and safeguard your information when you use our Service.
              </p>
            </section>

            <section id="collection">
              <h2>2. Information We Collect</h2>

              <h3>Account Information</h3>
              <p>When you create an account, we collect:</p>
              <ul>
                <li>Email address</li>
                <li>Name (if provided)</li>
                <li>Profile picture (if using Google or GitHub sign-in)</li>
              </ul>

              <h3>Content You Upload</h3>
              <p>
                We store screenshots and images you upload to create mockups. These are
                stored securely in your personal media library and associated with your account.
              </p>

              <h3>Usage Data</h3>
              <p>We automatically collect basic usage information:</p>
              <ul>
                <li>Pages visited and features used</li>
                <li>Time and date of visits</li>
                <li>Device type and browser information</li>
              </ul>
            </section>

            <section id="usage">
              <h2>3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Provide, maintain, and improve the Service</li>
                <li>Process and store your mockups and projects</li>
                <li>Send important service updates (no marketing spam)</li>
                <li>Respond to your support requests</li>
                <li>Detect and prevent abuse or security issues</li>
              </ul>
              <p>
                <strong>We do not:</strong> Sell your data, show you targeted ads, or share
                your information with third parties for marketing purposes.
              </p>
            </section>

            <section id="storage">
              <h2>4. Data Storage and Security</h2>
              <p>
                Your data is stored securely using industry-standard practices:
              </p>
              <ul>
                <li><strong>Supabase</strong> - For authentication and database (PostgreSQL)</li>
                <li><strong>Cloudinary</strong> - For image storage and optimization</li>
                <li><strong>Vercel</strong> - For hosting (with edge network)</li>
              </ul>
              <p>
                All data transmission is encrypted using HTTPS/TLS. We implement appropriate
                technical and organizational measures to protect your data.
              </p>
            </section>

            <section>
              <h2>5. Data Retention</h2>
              <p>
                We retain your data for as long as your account is active. If you delete
                your account:
              </p>
              <ul>
                <li>Your profile and projects are deleted immediately</li>
                <li>Your uploaded images are removed from our storage within 30 days</li>
                <li>Backup copies may persist for up to 90 days before deletion</li>
              </ul>
            </section>

            <section id="rights">
              <h2>6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access</strong> - Request a copy of your personal data</li>
                <li><strong>Correct</strong> - Update inaccurate information</li>
                <li><strong>Delete</strong> - Delete your account and all associated data</li>
                <li><strong>Export</strong> - Download your projects and media</li>
                <li><strong>Object</strong> - Opt out of certain data processing</li>
              </ul>
              <p>
                To exercise these rights, contact us at{" "}
                <a href="mailto:hello@bpstack.com">hello@bpstack.com</a>.
              </p>
            </section>

            <section>
              <h2>7. Cookies</h2>
              <p>
                We use essential cookies only:
              </p>
              <ul>
                <li><strong>Authentication cookies</strong> - To keep you signed in</li>
                <li><strong>Preference cookies</strong> - To remember your theme preference</li>
              </ul>
              <p>
                We do not use tracking cookies, analytics cookies, or advertising cookies.
              </p>
            </section>

            <section>
              <h2>8. Third-Party Services</h2>
              <p>
                Our third-party service providers have their own privacy policies:
              </p>
              <ul>
                <li><a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a></li>
                <li><a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer">Cloudinary Privacy Policy</a></li>
                <li><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a></li>
              </ul>
            </section>

            <section>
              <h2>9. Children&apos;s Privacy</h2>
              <p>
                The Service is not intended for children under 13. We do not knowingly
                collect personal data from children under 13. If you believe we have
                collected such data, please contact us immediately.
              </p>
            </section>

            <section>
              <h2>10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you
                of significant changes by posting a notice on the Service or sending you
                an email. The &ldquo;Last updated&rdquo; date at the top indicates when the policy
                was last revised.
              </p>
            </section>

            <section id="contact">
              <h2>11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices,
                please contact us at{" "}
                <a href="mailto:hello@bpstack.com">hello@bpstack.com</a>.
              </p>
            </section>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/terms"
            className="inline-flex items-center gap-2 rounded-full border bg-card/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-[var(--accent-orange)]/50 hover:text-foreground"
          >
            <FileText className="h-4 w-4" />
            Read our Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
