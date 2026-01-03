import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://previews.app";

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Previews",
  description:
    "Create beautiful app store screenshots for iOS and Android. Free, fast, and professional quality.",
  url: baseUrl,
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "Previews",
    url: baseUrl,
  },
  featureList: [
    "iPhone and Android device mockups",
    "Professional templates",
    "Custom backgrounds and gradients",
    "Text overlays and badges",
    "High-quality PNG export",
    "Batch export for App Store and Play Store",
  ],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Previews - Create Beautiful App Store Screenshots",
    template: "%s | Previews",
  },
  description:
    "Generate stunning app store previews and device mockups for iOS and Android. Free, fast, and professional quality.",
  keywords: [
    "app store screenshots",
    "app preview generator",
    "device mockups",
    "iOS screenshots",
    "Android screenshots",
    "Play Store graphics",
    "app mockup",
    "screenshot generator",
    "app store optimization",
    "ASO tools",
  ],
  authors: [{ name: "Previews" }],
  creator: "Previews",
  publisher: "Previews",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Previews",
    title: "Previews - Create Beautiful App Store Screenshots",
    description:
      "Generate stunning app store previews and device mockups for iOS and Android. Free, fast, and professional quality.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Previews - Create Beautiful App Store Screenshots",
    description:
      "Generate stunning app store previews and device mockups for iOS and Android.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background`}
      >
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
