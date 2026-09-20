"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@nexus/ui";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { streamChat } from "@/lib/chat-client";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { ModelSelector } from "@/components/chat/ModelSelector";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard",        href: "/dashboard", icon: "📊" },
  { id: "chat",      label: "AI Chat",          href: "/chat",      icon: "🤖", active: true },
  { id: "usage",     label: "AI Usage",         href: "/usage",     icon: "📈" },
  { id: "workflow",  label: "Workflow Builder", href: "/workflow",  icon: "⚡" },
  { id: "workspace", label: "Knowledge Engine", href: "/workspace", icon: "🧠" },
  { id: "storage",   label: "Storage",          href: "/storage",   icon: "☁️" },
  { id: "settings",  label: "Platform Settings",href: "/settings",  icon: "⚙️" },
];

interface Message {
  id:       string;
  role:     "user" | "assistant" | "system";
  content:  string;
  time:     string;
  model?:   string;
  provider?: string;
  tokens?:  number;
  fellBack?: boolean;
  routedCategory?: string;
  routedReason?: string;
  latencyMs?: number;
  streaming?: boolean;
  error?:    boolean;
}

const PROVIDER_LABELS: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  gemini: "Gemini",
  grok: "Grok",
  deepseek: "DeepSeek",
};

function now() {
  if (typeof window === "undefined") return "--:--";
  return new Date().toLocaleTimeString([], {
    hour:   "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(() => [{
    id: "0",
    role: "assistant",
    content: "Hi! I'm NEXUS AI — your multi-model assistant. I route your questions to the best AI model automatically (Nexus Auto), or you can pick a specific model. Add your API keys in `.env.local` to get started.",
    time: "--:--",
    model: "system",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("auto");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      time: now(),
    };

    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      time: now(),
      streaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setLoading(true);

    // Build conversation history (last 10 messages, excluding system/welcome).
    const history = messages
      .filter((m) => m.role !== "system" && m.id !== "0" && !m.error)
      .slice(-10)
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    try {
      for await (const chunk of streamChat({
        model: selectedModel,
        messages: [...history, { role: "user", content: text }],
        temperature: 0.7,
      })) {
        if (chunk.type === "delta") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: m.content + chunk.content }
                : m,
            ),
          );
        } else if (chunk.type === "done") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    streaming: false,
                    model: chunk.model,
                    provider: chunk.provider
                      ? PROVIDER_LABELS[chunk.provider] ?? chunk.provider
                      : undefined,
                    tokens: chunk.usage?.totalTokens,
                    fellBack: chunk.fellBack,
                  }
                : m,
            ),
          );
        } else if (chunk.type === "error") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    streaming: false,
                    content: `⚠️ **Error:** ${chunk.error}`,
                    error: true,
                  }
                : m,
            ),
          );
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                streaming: false,
                content: `⚠️ **Error:** ${msg}`,
                error: true,
              }
            : m,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const isAuto = selectedModel === "auto";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          items={sidebarItems}
          currentPath="/chat"
          onNavigate={(href) => { window.location.href = href; }}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.06] bg-dark-900/60 backdrop-blur-sm">
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">AI Chat</h1>
              <p className="text-xs text-dark-400 mt-0.5">
                {isAuto
                  ? "Nexus Auto — intelligent model routing"
                  : "Multi-model chat — pick a model or use Auto"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Auto badge */}
              {isAuto && (
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                  <span className="text-sm">⚡</span>
                  Auto-Routing
                </div>
              )}
              {/* Model selector */}
              <ModelSelector value={selectedModel} onChange={setSelectedModel} />
              {/* Clear */}
              <button
                type="button"
                onClick={() => setMessages([messages[0]])}
                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-medium text-dark-300 hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold",
                    msg.role === "user"
                      ? "bg-brand-600 text-white"
                      : msg.error
                        ? "bg-red-600/20 text-red-400"
                        : "bg-gradient-to-br from-brand-500 to-purple-600 text-white",
                  )}
                >
                  {msg.role === "user" ? "J" : "AI"}
                </div>

                <div
                  className={cn(
                    "max-w-[75%] space-y-1.5",
                    msg.role === "user" && "items-end flex flex-col",
                  )}
                >
                  {/* Bubble */}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-brand-600/20 border border-brand-500/20 text-white rounded-tr-sm"
                        : msg.error
                          ? "bg-red-500/8 border border-red-500/20 text-red-300 rounded-tl-sm"
                          : "bg-dark-800/60 border border-white/[0.06] text-dark-100 rounded-tl-sm",
                    )}
                  >
                    {msg.role === "assistant" ? (
                      msg.content ? (
                        <MarkdownRenderer content={msg.content} />
                      ) : msg.streaming ? (
                        <span className="text-dark-500 text-xs">Connecting…</span>
                      ) : null
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                    {msg.streaming && msg.content && (
                      <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-brand-400 align-middle" />
                    )}
                  </div>

                  {/* Meta */}
                  {msg.model && msg.model !== "system" && (
                    <p className="text-[10px] text-dark-600 px-1 flex items-center gap-1.5 flex-wrap">
                      {msg.time && <span>{msg.time}</span>}
                      {msg.provider && (
                        <span className="text-brand-400/70">
                          · {msg.provider}
                          {msg.model && ` / ${msg.model}`}
                        </span>
                      )}
                      {msg.tokens && <span>· {msg.tokens.toLocaleString()} tokens</span>}
                      {msg.fellBack && (
                        <span className="text-amber-400/70">· fallback used</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator (before stream starts) */}
            {loading && !messages.some((m) => m.streaming) && (
              <div className="flex gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                  AI
                </div>
                <div className="bg-dark-800/60 border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-white/[0.06] bg-dark-900/40 backdrop-blur-sm">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={
                    isAuto
                      ? "Message Nexus Auto… (Enter to send, Shift+Enter for new line)"
                      : "Message AI… (Enter to send, Shift+Enter for new line)"
                  }
                  rows={1}
                  disabled={loading}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-dark-800/80 px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition disabled:opacity-50 min-h-[44px] max-h-32"
                  style={{ height: "auto" }}
                />
              </div>
              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-600/25 self-end"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-2 text-[10px] text-dark-600 text-center">
              {isAuto
                ? "⚡ Nexus Auto intelligently routes to the best model · automatic fallback on errors"
                : `Using ${selectedModel} · automatic fallback on errors`}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
