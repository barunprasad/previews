import { Logo } from "@/components/ui/logo";

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
