"use client";

import { useState } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 space-y-8 w-full">
        <div className="text-center space-y-3">
          <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs font-bold border border-blue-500/30 uppercase tracking-wider">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact the NEXUS Team
          </h1>
          <p className="text-dark-300 text-xs sm:text-sm">
            Reach out for enterprise custom deployments, partnership inquiries, or platform assistance.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-8 shadow-xl">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <span className="text-4xl">🎉</span>
              <h2 className="text-xl font-bold text-white">Message Dispatched</h2>
              <p className="text-xs text-dark-300 max-w-sm mx-auto">
                Thank you for contacting NEXUS AI. Our solutions engineering team will reply within 4 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-dark-300 font-medium">Your Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Alex Morgan"
                    className="w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 text-sm text-white placeholder:text-dark-500 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-dark-300 font-medium">Work Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="alex@enterprise.com"
                    className="w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 text-sm text-white placeholder:text-dark-500 focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-dark-300 font-medium">Subject</label>
                <input
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Enterprise deployment / Custom model integration"
                  className="w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 text-sm text-white placeholder:text-dark-500 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-dark-300 font-medium">Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your use case and timeline…"
                  className="w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 text-sm text-white placeholder:text-dark-500 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all cursor-pointer"
              >
                Send Message →
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
