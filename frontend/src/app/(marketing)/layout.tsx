import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { WhatsAppButton } from "@/components/marketing/WhatsAppButton";
import { getSiteSettings } from "@/lib/server-api";

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer settings={siteSettings} />
      <WhatsAppButton whatsappNumber={siteSettings.whatsapp_number} />
    </>
  );
}
