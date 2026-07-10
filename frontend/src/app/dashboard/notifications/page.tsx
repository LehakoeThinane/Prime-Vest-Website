"use client";

import { useEffect, useState } from "react";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/api";
import type { Notification } from "@/lib/types";
import { Badge } from "@/components/ui/Card";
import { EmptyState, PageHeader } from "@/components/dashboard/DashboardUI";
import { Button } from "@/components/ui/Button";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  async function handleMarkRead(id: number) {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <PageHeader title="Notifications" description="Account, deposit, withdrawal, and announcement updates." />
        {unreadCount > 0 && (
          <Button variant="ghost" size="md" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState message="No notifications yet." />
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`rounded-xl border p-4 ${n.is_read ? "border-surface-border" : "border-gold-500/60 bg-gold-500/5"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{n.title}</p>
                  {!n.is_read && <Badge>New</Badge>}
                </div>
                {!n.is_read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="text-xs text-gold-500 underline underline-offset-4"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <p className="mt-1 text-sm text-muted">{n.body}</p>
              <p className="mt-2 text-xs text-muted">{new Date(n.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
