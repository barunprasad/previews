import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

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
  ],
  authors: [{ name: "Previews" }],
  creator: "Previews",
  openGraph: {
    type: "website",
    locale: "en_US",
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
