'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Sparkles, MessageSquarePlus, RefreshCw } from 'lucide-react';

const chatSubnav = [
  { label: 'Active Chat', href: '/chat' },
  { label: 'New Conversation', href: '/chat/new' },
  { label: 'History', href: '/chat/history' },
  { label: 'Share', href: '/chat/share' },
  { label: 'Export', href: '/chat/export' },
];

export default function NewChatPage() {
  const router = useRouter();

  useEffect(() => {
    // Generate new conversation session ID and redirect to fresh chat
    const newId = 'session_' + Date.now().toString(36);
    const timer = setTimeout(() => {
      router.replace(`/chat?session=${newId}`);
    }, 600);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ModuleLayout
      title="Initializing Fresh AI Workspace"
      subtitle="Allocating new conversational context with auto-routing multi-model support"
      subnav={chatSubnav}
    >
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 animate-bounce">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Creating New Session...</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
          Resetting working memory and attaching global tools. Redirecting you to the active chat canvas now.
        </p>
      </div>
    </ModuleLayout>
  );
}
