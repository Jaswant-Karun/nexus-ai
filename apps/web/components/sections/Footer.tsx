import Link from "next/link";
import { ZapIcon, GithubIcon, TwitterIcon, LinkedinIcon } from "@/components/ui/Icons";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Dashboard", href: "#dashboard" },
    { label: "Pricing", href: "/pricing" },
    { label: "Changelog", href: "/changelog" },
  ],
  Developers: [
    { label: "Docs", href: "/docs" },
    { label: "API Reference", href: "/docs/api" },
    { label: "SDK", href: "/docs/sdk" },
    { label: "GitHub", href: "https://github.com/nexus-ai" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Security", href: "/security" },
    { label: "Cookies", href: "/cookies" },
  ],
};

const socialLinks = [
  { Icon: GithubIcon, label: "GitHub", href: "https://github.com/nexus-ai" },
  { Icon: TwitterIcon, label: "Twitter", href: "https://twitter.com/nexus_ai" },
  { Icon: LinkedinIcon, label: "LinkedIn", href: "https://linkedin.com/company/nexus-ai" },
];

export default function Footer() {
  return (
    <footer className="relative bg-dark-950 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* CTA Banner */}
      <div className="relative border-b border-white/[0.06] bg-gradient-to-r from-brand-600/10 via-brand-500/5 to-purple-600/10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready to build with{" "}
            <span className="text-gradient">Nexus AI</span>?
          </h2>
          <p className="mt-3 text-dark-400 max-w-xl mx-auto">
            Start free. No credit card required. Deploy your first AI agent in minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/register" className="btn-primary">
              Get Started Free
            </Link>
            <Link href="/docs" className="btn-secondary">
              Read the Docs
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-lg shadow-brand-600/40">
                <ZapIcon size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-white">NEXUS</span>
                <span className="text-brand-400"> AI</span>
              </span>
            </Link>
            <p className="text-sm text-dark-400 max-w-xs leading-relaxed">
              Universal Adaptive Intelligence Platform. Build, deploy, and scale intelligent AI systems.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((s) => {
                const { Icon } = s;
                return (
                  <Link
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-dark-400 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={16} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-dark-400">
                {group}
              </h3>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-dark-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-dark-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Nexus AI. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
