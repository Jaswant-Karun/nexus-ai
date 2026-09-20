"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AppNavbar }        from "@/components/layout/AppNavbar";
import { AppSidebar }       from "@/components/sidebar/AppSidebar";
import { streamChat }       from "@/lib/chat-client";
import { cn }               from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { ModelSelector }    from "@/components/chat/ModelSelector";

/* ── Types ─────────────────────────────────────────────────────── */
interface Message {
  id:        string;
  role:      "user" | "assistant" | "system";
  content:   string;
  time:      string;
  model?:    string;
  provider?: string;
  tokens?:   number;
  agentType?: string;
  streaming?: boolean;
  error?:    boolean;
}

interface AgentInfo {
  type:         string;
  name:         string;
  description:  string;
  icon:         string;
  use_in:       string[];
  example_task: string;
}

/* ── Constants ─────────────────────────────────────────────────── */
const PROVIDER_LABELS: Record<string, string> = {
  openai: "OpenAI", anthropic: "Anthropic", gemini: "Gemini",
  grok: "Grok", deepseek: "DeepSeek",
};

function now() {
  if (typeof window === "undefined") return "--:--";
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function ChatPage() {
  // ── Mode: "chat" (stream) or "agent" (Python agent via FastAPI) ──
  const [mode, setMode] = useState<"chat" | "agent">("chat");

  // ── Shared state ────────────────────────────────────────────────
  const [messages,    setMessages]    = useState<Message[]>(() => [{
    id: "0", role: "assistant", time: "--:--", model: "system",
    content: "Hi! I'm NEXUS AI. Switch between **Chat Mode** (streaming model) and **Agent Mode** (13 specialist Python agents).",
  }]);
  const [input,       setInput]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Chat mode ────────────────────────────────────────────────────
  const [selectedModel, setSelectedModel] = useState("auto");

  // ── Agent mode ───────────────────────────────────────────────────
  const [agents,       setAgents]       = useState<AgentInfo[]>([]);
  const [selectedAgent,setSelectedAgent]= useState("analytics");
  const [agentStatus,  setAgentStatus]  = useState<"online"|"offline"|"checking">("checking");
  const [activeModel,  setActiveModel]  = useState("Gemini 2.5 Flash");

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // ── Load agent list from FastAPI ────────────────────────────────
  useEffect(() => {
    fetch("/api/ai/api/v1/agents/list")
      .then((r) => r.json())
      .then((d: { agents?: AgentInfo[]; active_model?: string }) => {
        if (d.agents) setAgents(d.agents);
        if (d.active_model) setActiveModel(d.active_model.replace("models/", ""));
        setAgentStatus("online");
      })
      .catch(() => setAgentStatus("offline"));
  }, []);

  const currentAgent = agents.find((a) => a.type === selectedAgent);

  /* ── Chat mode — streaming ─────────────────────────────────────── */
  const sendChatMessage = async (text: string) => {
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: text, time: now() },
      { id: assistantId, role: "assistant", content: "", time: now(), streaming: true },
    ]);
    setLoading(true);

    const history = messages
      .filter((m) => m.role !== "system" && m.id !== "0" && !m.error)
      .slice(-10)
      .map((m) => ({ role: m.role as "user"|"assistant", content: m.content }));

    try {
      for await (const chunk of streamChat({
        model: selectedModel,
        messages: [...history, { role: "user", content: text }],
        temperature: 0.7,
      })) {
        if (chunk.type === "delta") {
          setMessages((prev) => prev.map((m) => m.id === assistantId
            ? { ...m, content: m.content + chunk.content } : m));
        } else if (chunk.type === "done") {
          setMessages((prev) => prev.map((m) => m.id === assistantId
            ? { ...m, streaming: false, model: chunk.model,
                provider: PROVIDER_LABELS[chunk.provider ?? ""] ?? chunk.provider,
                tokens: chunk.usage?.totalTokens } : m));
        } else if (chunk.type === "error") {
          setMessages((prev) => prev.map((m) => m.id === assistantId
            ? { ...m, streaming: false, content: `⚠️ ${chunk.error}`, error: true } : m));
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages((prev) => prev.map((m) => m.id === assistantId
        ? { ...m, streaming: false, content: `⚠️ ${msg}`, error: true } : m));
    } finally {
      setLoading(false);
    }
  };

  /* ── Agent mode — Python agent via FastAPI ──────────────────────── */
  const sendAgentMessage = async (text: string) => {
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: text, time: now() },
      { id: assistantId, role: "assistant", content: "", time: now(),
        streaming: true, agentType: selectedAgent },
    ]);
    setLoading(true);

    try {
      const res  = await fetch("/api/ai/api/v1/agents/run", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_type:  selectedAgent,
          task:        text,
          context:     "",
          documents:   [],
          data:        {},
          model:       "gpt-4o",
          temperature: 0.4,
        }),
      });
      const data = await res.json() as {
        answer: string; tokens_used: number;
        model_used?: string; extra?: Record<string, unknown>;
        error?: string; detail?: string;
      };

      const content = data.answer || data.error || data.detail || "No response";
      setMessages((prev) => prev.map((m) => m.id === assistantId
        ? { ...m, streaming: false, content,
            model:  data.model_used ?? activeModel,
            tokens: data.tokens_used,
            agentType: selectedAgent,
            error: !data.answer } : m));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages((prev) => prev.map((m) => m.id === assistantId
        ? { ...m, streaming: false, content: `⚠️ ${msg}`, error: true } : m));
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    if (mode === "chat") sendChatMessage(text);
    else sendAgentMessage(text);
  };

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar activeNav="chat" />

        <div className="flex flex-1 overflow-hidden">
          {/* ── Left: Chat area ─────────────────────────────────── */}
          <main className="flex-1 flex flex-col overflow-hidden">

            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-dark-900/60 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3">
                <h1 className="text-base font-extrabold text-white">AI Agent Studio</h1>

                {/* Mode toggle */}
                <div className="flex rounded-xl border border-white/10 bg-dark-800/80 p-0.5 gap-0.5">
                  {(["chat", "agent"] as const).map((m) => (
                    <button key={m} type="button" onClick={() => setMode(m)}
                      className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
                        mode === m ? "bg-brand-600 text-white" : "text-dark-400 hover:text-white")}>
                      {m === "chat" ? "💬 Chat" : "🤖 Agents"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {mode === "chat" ? (
                  <ModelSelector value={selectedModel} onChange={setSelectedModel} />
                ) : (
                  <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border",
                    agentStatus === "online"  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    agentStatus === "offline" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    "bg-amber-500/10 text-amber-400 border-amber-500/20")}>
                    <span className={cn("h-1.5 w-1.5 rounded-full",
                      agentStatus === "online" ? "bg-emerald-400 animate-pulse" :
                      agentStatus === "offline" ? "bg-red-400" : "bg-amber-400 animate-pulse")} />
                    {agentStatus === "online" ? activeModel : agentStatus === "offline" ? "AI Service Offline" : "Connecting…"}
                  </div>
                )}
                <button type="button" onClick={() => setMessages([messages[0]])}
                  className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-medium text-dark-300 hover:text-white transition-colors">
                  Clear
                </button>
              </div>
            </div>

            {/* Agent selector strip */}
            {mode === "agent" && (
              <div className="flex gap-1.5 px-5 py-2.5 border-b border-white/[0.04] bg-dark-900/40 overflow-x-auto shrink-0">
                {agents.map((a) => (
                  <button key={a.type} type="button"
                    onClick={() => setSelectedAgent(a.type)}
                    title={a.description}
                    className={cn(
                      "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all shrink-0",
                      selectedAgent === a.type
                        ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                        : "border border-white/10 bg-white/5 text-dark-300 hover:bg-white/10 hover:text-white"
                    )}>
                    <span>{a.icon}</span>
                    <span>{a.name.replace(" Agent","")}</span>
                  </button>
                ))}
                {agents.length === 0 && agentStatus === "offline" && (
                  <p className="text-xs text-red-400 px-2 py-1.5">
                    Start the AI service: <code className="bg-dark-800 px-1.5 py-0.5 rounded font-mono">uvicorn main:app --port 8001</code>
                  </p>
                )}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id}
                  className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold",
                    msg.role === "user"
                      ? "bg-brand-600 text-white"
                      : msg.error
                        ? "bg-red-600/20 text-red-400"
                        : "bg-gradient-to-br from-brand-500 to-purple-600 text-white"
                  )}>
                    {msg.role === "user" ? "J" : msg.agentType
                      ? (agents.find(a => a.type === msg.agentType)?.icon ?? "🤖")
                      : "AI"}
                  </div>

                  <div className={cn("max-w-[76%] space-y-1", msg.role === "user" && "items-end flex flex-col")}>
                    {/* Agent label */}
                    {msg.agentType && msg.role === "assistant" && (
                      <p className="text-[10px] font-semibold text-brand-400/70 uppercase tracking-wider px-1">
                        {agents.find(a => a.type === msg.agentType)?.name ?? msg.agentType}
                      </p>
                    )}
                    <div className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-brand-600/20 border border-brand-500/20 text-white rounded-tr-sm"
                        : msg.error
                          ? "bg-red-500/8 border border-red-500/20 text-red-300 rounded-tl-sm"
                          : "bg-dark-800/60 border border-white/[0.06] text-dark-100 rounded-tl-sm"
                    )}>
                      {msg.role === "assistant" ? (
                        msg.content
                          ? <MarkdownRenderer content={msg.content} />
                          : msg.streaming
                            ? <span className="text-dark-500 text-xs animate-pulse">Thinking…</span>
                            : null
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                      {msg.streaming && msg.content && (
                        <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-brand-400 align-middle" />
                      )}
                    </div>
                    {/* Meta */}
                    {msg.model && msg.model !== "system" && !msg.streaming && (
                      <p className="text-[10px] text-dark-600 px-1 flex items-center gap-1.5 flex-wrap">
                        <span>{msg.time}</span>
                        {msg.model && <span className="text-brand-400/60">· {msg.model}</span>}
                        {msg.tokens && <span>· {msg.tokens.toLocaleString()} tokens</span>}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {loading && !messages.some((m) => m.streaming && m.content) && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-sm text-white">
                    {mode === "agent" ? (agents.find(a => a.type === selectedAgent)?.icon ?? "🤖") : "AI"}
                  </div>
                  <div className="bg-dark-800/60 border border-white/[0.06] rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {[0,150,300].map((d) => (
                        <span key={d} className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-bounce"
                          style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-3 border-t border-white/[0.06] bg-dark-900/40 backdrop-blur-sm shrink-0">
              {/* Example task hint */}
              {mode === "agent" && currentAgent && (
                <button type="button"
                  onClick={() => setInput(currentAgent.example_task)}
                  className="mb-2 text-[11px] text-brand-400/60 hover:text-brand-300 transition-colors text-left flex items-center gap-1.5">
                  <span className="text-base">{currentAgent.icon}</span>
                  <span>Try: <em>{currentAgent.example_task}</em></span>
                </button>
              )}
              <div className="flex gap-2">
                <textarea value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={
                    mode === "agent" && currentAgent
                      ? `Ask ${currentAgent.name}… (Enter to send)`
                      : "Message Nexus Auto… (Enter to send, Shift+Enter for new line)"
                  }
                  rows={1} disabled={loading}
                  className="flex-1 resize-none rounded-2xl border border-white/10 bg-dark-800/80 px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition disabled:opacity-50 min-h-[44px] max-h-28"
                />
                <button type="button" onClick={sendMessage} disabled={loading || !input.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-600/25 self-end">
                  {loading
                    ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    : <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                  }
                </button>
              </div>
              <p className="mt-1.5 text-[10px] text-dark-600 text-center">
                {mode === "agent"
                  ? `${currentAgent?.name ?? "Agent"} · Python agent via NEXUS AI Service (port 8001) · ${activeModel}`
                  : "⚡ Nexus Auto routes to the best available model · automatic fallback"}
              </p>
            </div>
          </main>

          {/* ── Right panel: Agent info ──────────────────────────── */}
          {mode === "agent" && currentAgent && (
            <aside className="w-64 shrink-0 border-l border-white/[0.06] bg-dark-900/70 p-5 overflow-y-auto hidden lg:block">
              <div className="text-3xl mb-3">{currentAgent.icon}</div>
              <h2 className="text-sm font-bold text-white mb-1">{currentAgent.name}</h2>
              <p className="text-xs text-dark-300 leading-relaxed mb-4">{currentAgent.description}</p>

              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-500 mb-1.5">Used in pages</p>
                  <div className="flex flex-wrap gap-1">
                    {currentAgent.use_in.map((page) => (
                      <span key={page} className="rounded-lg bg-dark-800 border border-white/[0.06] px-2 py-0.5 text-[10px] font-mono text-dark-300">
                        {page}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-500 mb-1.5">Example task</p>
                  <button type="button" onClick={() => setInput(currentAgent.example_task)}
                    className="w-full text-left rounded-xl bg-brand-500/8 border border-brand-500/20 px-3 py-2.5 text-xs text-brand-300 hover:bg-brand-500/15 transition-colors italic">
                    "{currentAgent.example_task}"
                  </button>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-500 mb-1.5">AI Provider</p>
                  <div className={cn("flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold border",
                    agentStatus === "online" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20")}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", agentStatus === "online" ? "bg-emerald-400" : "bg-red-400")} />
                    {agentStatus === "online" ? activeModel : "Offline"}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-500 mb-1.5">All 13 agents</p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {agents.map((a) => (
                      <button key={a.type} type="button"
                        onClick={() => setSelectedAgent(a.type)}
                        className={cn("w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors text-left",
                          selectedAgent === a.type ? "bg-brand-600/20 text-brand-300" : "text-dark-400 hover:bg-white/5 hover:text-white")}>
                        <span>{a.icon}</span>
                        <span>{a.name.replace(" Agent","")}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
