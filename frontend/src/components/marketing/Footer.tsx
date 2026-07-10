import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { NewsletterForm } from "./NewsletterForm";
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from "./SocialIcons";

const columns = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/services", label: "Investment Services" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact Us" },
      { href: "/dashboard", label: "Investor Dashboard" },
    ],
  },
];

export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { href: settings.facebook_url, icon: FacebookIcon, label: "Facebook" },
    { href: settings.twitter_url, icon: TwitterIcon, label: "Twitter" },
    { href: settings.linkedin_url, icon: LinkedinIcon, label: "LinkedIn" },
    { href: settings.instagram_url, icon: InstagramIcon, label: "Instagram" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-24 border-t border-white/10 bg-navy-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="text-lg font-bold">
            Prime<span className="text-gold-400">Vest</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-white/60">{settings.company_intro}</p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/50">{col.title}</p>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/50">Stay informed</p>
          <p className="mt-4 text-sm text-white/70">
            Market insights and investment updates, straight to your inbox.
          </p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Prime Vest (Pty) Ltd. All rights reserved. Secured with SSL.
      </div>
    </footer>
  );
}
