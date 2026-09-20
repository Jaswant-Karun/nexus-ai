"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MenuIcon, XIcon, ZapIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "glass-dark border-b border-white/[0.06] shadow-xl shadow-black/20"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-lg shadow-brand-600/40 group-hover:shadow-brand-500/60 transition-shadow">
          <ZapIcon size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-white">NEXUS</span>
            <span className="text-brand-400"> AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm font-medium text-dark-300 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-dark-300 transition-colors hover:text-white"
          >
            Sign in
          </Link>
          <Link href="/auth/register" className="btn-primary text-xs px-5 py-2.5">
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-dark-300 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
        {menuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-dark border-t border-white/[0.06] px-6 pb-6 pt-4">
          <ul className="flex flex-col gap-4 mb-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-dark-300 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="btn-secondary justify-center"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="btn-primary justify-center"
              onClick={() => setMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
