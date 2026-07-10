"use client";

import { FormEvent, useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/lib/api";
import type { Profile } from "@/lib/types";
import { PageHeader, StatusBadge } from "@/components/dashboard/DashboardUI";
import { Button } from "@/components/ui/Button";

const inputClass =
  "w-full rounded-md border border-surface-border bg-transparent px-3 py-2 text-sm focus:border-gold-500 focus:outline-none";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateProfile({
        first_name: profile.first_name,
        last_name: profile.last_name,
        profile: {
          phone: profile.profile.phone,
          date_of_birth: profile.profile.date_of_birth,
          address: profile.profile.address,
          id_number: profile.profile.id_number,
          risk_profile: profile.profile.risk_profile,
        },
      });
      setProfile(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (!profile) return <p className="text-sm text-muted">Loading profile…</p>;

  return (
    <div>
      <PageHeader title="Investor Profile" description="Keep your details up to date for verification." />

      <div className="mb-6 flex items-center gap-3 rounded-xl border border-surface-border p-4">
        <span className="text-sm font-medium">Verification status:</span>
        <StatusBadge status={profile.profile.verification_status} />
        {profile.profile.verification_status === "rejected" && profile.profile.verification_notes && (
          <span className="text-sm text-muted">— {profile.profile.verification_notes}</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-muted">First name</label>
            <input
              value={profile.first_name}
              onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Last name</label>
            <input
              value={profile.last_name}
              onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Email</label>
          <input value={profile.email} disabled className={`${inputClass} opacity-60`} />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Phone</label>
          <input
            value={profile.profile.phone}
            onChange={(e) => setProfile({ ...profile, profile: { ...profile.profile, phone: e.target.value } })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Date of birth</label>
          <input
            type="date"
            value={profile.profile.date_of_birth ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, profile: { ...profile.profile, date_of_birth: e.target.value } })
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Address</label>
          <input
            value={profile.profile.address}
            onChange={(e) => setProfile({ ...profile, profile: { ...profile.profile, address: e.target.value } })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">ID number</label>
          <input
            value={profile.profile.id_number}
            onChange={(e) => setProfile({ ...profile, profile: { ...profile.profile, id_number: e.target.value } })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Risk profile</label>
          <select
            value={profile.profile.risk_profile}
            onChange={(e) =>
              setProfile({
                ...profile,
                profile: { ...profile.profile, risk_profile: e.target.value as Profile["profile"]["risk_profile"] },
              })
            }
            className={inputClass}
          >
            <option value="conservative">Conservative</option>
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {saved && <p className="text-sm text-success">Profile saved.</p>}
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
