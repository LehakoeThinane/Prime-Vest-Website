"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { getChatThread, sendChatMessage } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

const POLL_INTERVAL_MS = 5000;

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    async function poll() {
      try {
        const thread = await getChatThread();
        if (!cancelled) setMessages(thread.messages);
      } catch {
        // ignore transient errors while polling
      }
    }
    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    try {
      const message = await sendChatMessage(body.trim());
      setMessages((prev) => [...prev, message]);
      setBody("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="mb-3 flex h-96 w-80 flex-col overflow-hidden rounded-xl border border-surface-border bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b border-surface-border bg-navy-950 px-4 py-3 text-white">
            <p className="text-sm font-semibold">Prime Vest Support</p>
            <button aria-label="Close chat" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-3">
            {messages.length === 0 && (
              <p className="text-center text-xs text-muted">
                Send a message and our team will get back to you here.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  m.sender_role === "investor"
                    ? "ml-auto bg-gold-500 text-navy-950"
                    : "bg-surface text-foreground"
                }`}
              >
                {m.body}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-surface-border p-3">
            <input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-md border border-surface-border bg-transparent px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gold-500 text-navy-950 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle support chat"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 text-white shadow-lg transition-transform hover:scale-105"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
