import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ContactForm } from "@/components/marketing/ContactForm";
import { getSiteSettings } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Prime Vest - contact form, WhatsApp, email, phone, and office address.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const whatsappDigits = settings.whatsapp_number.replace(/[^\d]/g, "");

  return (
    <Section>
      <SectionHeading
        eyebrow="Contact Us"
        title="We'd love to hear from you"
        description="Reach out with questions about investing, your account, or anything else - our team typically responds within a business day."
      />

      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-start gap-3 rounded-xl border border-surface-border p-4">
            <Phone className="mt-0.5 shrink-0 text-gold-500" size={20} />
            <div>
              <p className="text-sm font-semibold">Phone</p>
              <p className="text-sm text-muted">{settings.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-surface-border p-4">
            <Mail className="mt-0.5 shrink-0 text-gold-500" size={20} />
            <div>
              <p className="text-sm font-semibold">Email</p>
              <p className="text-sm text-muted">{settings.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-surface-border p-4">
            <MapPin className="mt-0.5 shrink-0 text-gold-500" size={20} />
            <div>
              <p className="text-sm font-semibold">Office</p>
              <p className="text-sm text-muted">{settings.address}</p>
            </div>
          </div>
          {whatsappDigits && (
            <a
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-surface-border p-4 hover:border-[#25D366]"
            >
              <MessageCircle className="shrink-0 text-[#25D366]" size={20} />
              <div>
                <p className="text-sm font-semibold">WhatsApp</p>
                <p className="text-sm text-muted">Chat with us instantly</p>
              </div>
            </a>
          )}

          {settings.google_maps_embed_url && (
            <div className="overflow-hidden rounded-xl border border-surface-border">
              <iframe
                src={settings.google_maps_embed_url}
                title="Prime Vest office location"
                width="100%"
                height="220"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
