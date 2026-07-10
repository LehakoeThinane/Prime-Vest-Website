"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { isLoggedIn } from "@/lib/api";
import { ButtonLink } from "@/components/ui/Button";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Deliberately deferred to an effect: reading localStorage must stay
    // client-only so the first render matches the server-rendered (logged-out) HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoggedIn(isLoggedIn());
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-background/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Prime<span className="text-gold-500">Vest</span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm font-medium text-muted hover:text-foreground">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/search" aria-label="Search" className="text-muted hover:text-foreground">
            <Search size={18} />
          </Link>
          {loggedIn ? (
            <ButtonLink href="/dashboard" variant="secondary" size="md">
              Dashboard
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="md">
                Sign in
              </ButtonLink>
              <ButtonLink href="/register" variant="primary" size="md">
                Invest Now
              </ButtonLink>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-surface-border px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-3 pt-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-3">
            {loggedIn ? (
              <ButtonLink href="/dashboard" variant="secondary" size="md" className="flex-1">
                Dashboard
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/login" variant="ghost" size="md" className="flex-1">
                  Sign in
                </ButtonLink>
                <ButtonLink href="/register" variant="primary" size="md" className="flex-1">
                  Invest Now
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
