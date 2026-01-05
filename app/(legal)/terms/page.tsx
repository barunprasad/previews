import { Metadata } from "next";
import Link from "next/link";
import { FileText, Shield, Users, AlertTriangle, Scale, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Previews - App Store Screenshot Generator",
};

const sections = [
  { id: "acceptance", label: "Acceptance", icon: FileText },
  { id: "service", label: "Service", icon: Shield },
  { id: "accounts", label: "Accounts", icon: Users },
  { id: "acceptable-use", label: "Acceptable Use", icon: AlertTriangle },
  { id: "intellectual-property", label: "IP Rights", icon: Scale },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function TermsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-[var(--accent-orange)] opacity-10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-[var(--accent-amber)] opacity-10 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-24 md:py-32">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-orange)]/10 px-4 py-1.5 text-sm font-medium text-[var(--accent-orange)]">
            <FileText className="h-4 w-4" />
            Legal
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Terms of Service
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

        {/* Content */}
        <div className="glass-card rounded-2xl p-8 md:p-12">
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-h2:text-xl prose-h2:font-semibold prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h2:mb-4 prose-a:text-[var(--accent-orange)] prose-a:no-underline hover:prose-a:underline prose-li:marker:text-[var(--accent-orange)]">

            <section id="acceptance">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Previews (&ldquo;the Service&rdquo;), you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section id="service">
              <h2>2. Description of Service</h2>
              <p>
                Previews is a web-based tool that allows users to create app store screenshots
                and device mockups for iOS and Android applications. The Service is provided &ldquo;as is&rdquo;
                and may be updated, modified, or discontinued at any time.
              </p>
              <p>
                Our Service includes features such as:
              </p>
              <ul>
                <li>Device mockup generation for various smartphones and tablets</li>
                <li>Customizable backgrounds, text overlays, and badges</li>
                <li>Media library for storing and organizing your screenshots</li>
                <li>Export functionality for App Store and Play Store dimensions</li>
              </ul>
            </section>

            <section id="accounts">
              <h2>3. User Accounts</h2>
              <p>
                To use certain features of the Service, you must create an account. You are
                responsible for maintaining the confidentiality of your account credentials
                and for all activities that occur under your account.
              </p>
              <p>
                You agree to provide accurate and complete information when creating your account
                and to update this information as necessary.
              </p>
            </section>

            <section id="acceptable-use">
              <h2>4. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Upload content that infringes on intellectual property rights of others</li>
                <li>Attempt to gain unauthorized access to the Service or its systems</li>
                <li>Use the Service to distribute malware, viruses, or harmful content</li>
                <li>Resell, redistribute, or sublicense the Service without permission</li>
                <li>Interfere with or disrupt the integrity or performance of the Service</li>
              </ul>
            </section>

            <section id="intellectual-property">
              <h2>5. Intellectual Property</h2>
              <p>
                <strong>Your Content:</strong> You retain ownership of the screenshots and content
                you create using the Service. By using the Service, you grant us a limited license
                to process and store your content as necessary to provide the Service.
              </p>
              <p>
                <strong>Our Service:</strong> The Service itself, including its design, features,
                code, and device mockups, is owned by Previews and protected by intellectual
                property laws. Device frames and bezels are used for mockup purposes only.
              </p>
            </section>

            <section>
              <h2>6. Privacy</h2>
              <p>
                Your use of the Service is also governed by our{" "}
                <Link href="/privacy">Privacy Policy</Link>, which is incorporated into these
                Terms by reference. Please review our Privacy Policy to understand how we
                collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2>7. Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES
                OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE,
                OR THAT ANY DEFECTS WILL BE CORRECTED.
              </p>
            </section>

            <section>
              <h2>8. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, PREVIEWS AND ITS AFFILIATES SHALL NOT
                BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                DAMAGES ARISING FROM YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF
                THE POSSIBILITY OF SUCH DAMAGES.
              </p>
            </section>

            <section>
              <h2>9. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. We will notify users of significant
                changes by posting a notice on the Service or by other appropriate means. Your
                continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section id="contact">
              <h2>10. Contact</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:hello@bpstack.com">hello@bpstack.com</a>.
              </p>
            </section>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 rounded-full border bg-card/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-[var(--accent-orange)]/50 hover:text-foreground"
          >
            <Shield className="h-4 w-4" />
            Read our Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
