import type { Metadata } from "next";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: {
    template: "%s | Previews",
    default: "Account | Previews",
  },
  description:
    "Access your Previews account to create beautiful app store screenshots for iOS and Android.",
  robots: {
    index: false, // Auth pages typically shouldn't be indexed
    follow: true,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-center border-b border-border px-4">
        <Logo href="/" />
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="flex h-16 items-center justify-center border-t border-border px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Previews. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
