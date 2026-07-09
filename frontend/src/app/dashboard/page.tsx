"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, clearTokens, getTokens } from "@/lib/api";

type Me = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { access } = getTokens();
    if (!access) {
      router.push("/login");
      return;
    }

    apiFetch("/api/auth/me/")
      .then(async (res) => {
        if (!res.ok) throw new Error("Session expired, please sign in again");
        setMe(await res.json());
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load profile");
        router.push("/login");
      });
  }, [router]);

  function handleLogout() {
    clearTokens();
    router.push("/login");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {me ? (
        <div className="w-full max-w-sm rounded-lg border border-black/10 p-6 text-sm dark:border-white/10">
          <p>
            <span className="font-medium">Email:</span> {me.email}
          </p>
          <p>
            <span className="font-medium">Joined:</span>{" "}
            {new Date(me.date_joined).toLocaleDateString()}
          </p>
        </div>
      ) : (
        !error && <p className="text-sm opacity-70">Loading…</p>
      )}
      <button
        onClick={handleLogout}
        className="rounded bg-foreground px-3 py-2 text-sm font-medium text-background"
      >
        Log out
      </button>
    </main>
  );
}
