import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto flex flex-col gap-4 px-4 py-8 sm:px-6 sm:flex-row sm:items-center sm:justify-between max-w-7xl">
        <Logo size="sm" />
        <p className="text-body-sm text-text-subtle font-mono uppercase tracking-wide">
          Live scoring · Built for every sport
        </p>
        <div className="flex items-center gap-4 text-body-sm text-text-muted">
          <Link href="/about" className="hover:text-text">About</Link>
          <Link href="/privacy" className="hover:text-text">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
