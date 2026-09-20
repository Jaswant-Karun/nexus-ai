'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * /chat/[conversationId]
 * Redirects to /chat with the conversation ID in the query string.
 * The main chat page reads ?conversation= to pre-load the thread.
 */
export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.conversationId as string;

  useEffect(() => {
    if (id) {
      router.replace(`/chat?conversation=${id}`);
    } else {
      router.replace('/chat');
    }
  }, [id, router]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading conversation…</p>
      </div>
    </div>
  );
}
