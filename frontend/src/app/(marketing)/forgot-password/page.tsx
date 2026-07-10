"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/api";
import { AuthCard, authInputClass } from "@/components/marketing/AuthCard";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
    } finally {
      setLoading(false);
      setDone(true);
    }
  }

  if (done) {
    return (
      <AuthCard title="Check your email">
        <p className="text-sm text-muted">
          If an account exists for {email}, we&apos;ve sent a link to reset your password.
        </p>
        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="text-gold-500 underline underline-offset-4">
            Back to sign in
          </Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Reset your password" subtitle="Enter your email and we'll send you a reset link.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={authInputClass}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Please wait…" : "Send reset link"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="text-gold-500 underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </AuthCard>
  );
}
