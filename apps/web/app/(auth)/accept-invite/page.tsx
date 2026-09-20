"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Shield, ArrowRight, Building, UserCheck } from "lucide-react";
import { ZapIcon } from "@/components/ui/Icons";

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgName = searchParams.get("org") || "Nexus AI Enterprise";
  const inviter = searchParams.get("inviter") || "Engineering Lead";
  const email = searchParams.get("email") || "jaswant.karun@nexusai.io";

  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAccepted(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    }, 900);
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <ZapIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">NEXUS AI</span>
        </Link>
        <h1 className="text-2xl font-bold text-white mb-2">Join Workspace</h1>
        <p className="text-sm text-slate-400">
          You have been invited to collaborate on autonomous multi-agent systems.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl">
        {accepted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Invitation Accepted!</h2>
            <p className="text-xs text-slate-400 mb-4">Redirecting you to the unified workspace console...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-400" /> Organization
                </span>
                <span className="font-semibold text-white">{orgName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Invited By
                </span>
                <span className="font-semibold text-slate-200">{inviter}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Recipient</span>
                <span className="font-mono text-slate-300">{email}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-start gap-2.5">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Accepting grants you immediate access to shared agent models, vector knowledge graphs, and workflow orchestrators.</span>
            </div>

            <button
              onClick={handleAccept}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
            >
              {loading ? "Joining Organization..." : "Accept & Join Workspace"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="text-center">
              <Link href="/login" className="text-xs text-slate-400 hover:text-slate-200">
                Decline or sign in with another account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Suspense fallback={<div className="text-slate-400 text-sm">Loading invitation details...</div>}>
        <AcceptInviteContent />
      </Suspense>
    </div>
  );
}
