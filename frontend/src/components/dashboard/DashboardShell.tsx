"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  PiggyBank,
  TrendingUp,
  User,
  Wallet,
  X,
} from "lucide-react";
import { clearTokens, getTokens, getProfile } from "@/lib/api";
import type { Profile } from "@/lib/types";
import { ChatWidget } from "./ChatWidget";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: TrendingUp },
  { href: "/dashboard/deposits", label: "Deposits", icon: Wallet },
  { href: "/dashboard/withdrawals", label: "Withdrawals", icon: PiggyBank },
  { href: "/dashboard/earnings", label: "Earnings", icon: TrendingUp },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checked, setChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const { access } = getTokens();
    if (!access) {
      router.push("/login");
      return;
    }
    getProfile()
      .then(setProfile)
      .catch(() => router.push("/login"))
      .finally(() => setChecked(true));
  }, [router]);

  function handleLogout() {
    clearTokens();
    router.push("/login");
  }

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Loading your dashboard…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-surface-border bg-surface/40 lg:flex lg:flex-col">
        <DashboardNav pathname={pathname} profile={profile} onLogout={handleLogout} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-64 bg-background">
            <DashboardNav
              pathname={pathname}
              profile={profile}
              onLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
          <button
            aria-label="Close menu"
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-surface-border px-4 py-3 lg:hidden">
          <Link href="/" className="text-base font-bold">
            Prime<span className="text-gold-500">Vest</span>
          </Link>
          <button aria-label="Open menu" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <ChatWidget />
    </div>
  );
}

function DashboardNav({
  pathname,
  profile,
  onLogout,
  onNavigate,
}: {
  pathname: string;
  profile: Profile | null;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col p-5">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Prime<span className="text-gold-500">Vest</span>
        </Link>
        {onNavigate && (
          <button aria-label="Close menu" onClick={onNavigate}>
            <X size={20} />
          </button>
        )}
      </div>

      {profile && (
        <div className="mb-6 rounded-lg bg-surface p-3">
          <p className="truncate text-sm font-medium">{profile.email}</p>
          <p
            className={`mt-1 text-xs font-medium ${
              profile.profile.verification_status === "verified"
                ? "text-success"
                : profile.profile.verification_status === "rejected"
                  ? "text-danger"
                  : "text-gold-500"
            }`}
          >
            {profile.profile.verification_status === "verified"
              ? "Verified investor"
              : profile.profile.verification_status === "rejected"
                ? "Verification unsuccessful"
                : "Verification pending"}
          </p>
        </div>
      )}

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                active ? "bg-gold-500 text-green-950" : "text-muted hover:bg-surface hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="mt-6 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-foreground"
      >
        <LogOut size={18} />
        Log out
      </button>
    </div>
  );
}
