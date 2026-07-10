"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { clearTokens, getMe, getTokens } from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const { access } = getTokens();
    if (!access) {
      router.push("/login");
      return;
    }
    getMe()
      .then((me) => {
        if (!me.is_staff) router.push("/dashboard");
      })
      .catch(() => router.push("/login"))
      .finally(() => setChecked(true));
  }, [router]);

  function handleLogout() {
    clearTokens();
    router.push("/login");
  }

  if (!checked) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted">Loading…</div>;
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-surface-border px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Prime<span className="text-gold-500">Vest</span> <span className="text-sm font-normal text-muted">Admin</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
        >
          <LogOut size={16} /> Log out
        </button>
      </header>
      <main className="p-6 sm:p-8">{children}</main>
    </div>
  );
}
