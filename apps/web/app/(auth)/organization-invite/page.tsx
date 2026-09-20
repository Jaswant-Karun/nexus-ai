"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Mail, Building, Shield, Send, CheckCircle2, ArrowLeft } from "lucide-react";
import { ZapIcon } from "@/components/ui/Icons";

export default function OrganizationInvitePage() {
  const [emails, setEmails] = useState("");
  const [role, setRole] = useState("Developer");
  const [department, setDepartment] = useState("Engineering");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendInvites = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emails.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <ZapIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">NEXUS AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Invite Organization Members</h1>
          <p className="text-sm text-slate-400">
            Invite teammates and collaborators into your NEXUS AI Enterprise cluster workspace.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Invitations Dispatched!</h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Secure invitation links with role credentials have been sent. Teammates can immediately activate their multi-agent access tokens.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setSubmitted(false); setEmails(""); }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                >
                  Invite More
                </button>
                <Link
                  href="/organization/members"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30"
                >
                  View Workspace Members
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendInvites} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Colleague Email Addresses (comma or line separated)
                </label>
                <textarea
                  required
                  rows={3}
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  placeholder="alex@acmecorp.com, devin@acmecorp.com"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Default Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="Admin">Admin (Full cluster control)</option>
                    <option value="Developer">Developer (Agent + API)</option>
                    <option value="Operator">Operator (Workflows & runs)</option>
                    <option value="Viewer">Viewer (Read-only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Product">Product</option>
                    <option value="Security">Security & Operations</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-start gap-2.5">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Invited users inherit Single Sign-On (SSO) and SAML policies enforced by your organization admin.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending Encrypted Invites..." : "Send Workspace Invitations"}
              </button>

              <div className="pt-3 text-center">
                <Link href="/dashboard" className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
