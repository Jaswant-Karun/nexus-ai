"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { AppNavbar }        from "@/components/layout/AppNavbar";
import { AppSidebar }       from "@/components/sidebar/AppSidebar";
import { streamChat }       from "@/lib/chat-client";
import { cn }               from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { ModelSelector }    from "@/components/chat/ModelSelector";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
interface Message {
  id:        string;
  role:      "user" | "assistant" | "system";
  content:   string;
  time:      string;
  model?:    string;
  provider?: string;
  tokens?:   number;
  streaming?: boolean;
  error?:    boolean;
  /* NEXUS Agent extras */
  domain?:           string;
  reasoningSteps?:   string[];
  reflection?:       string;
  elapsedSeconds?:   number;
  fromKB?:           boolean;
}

interface AgentInfo {
  type:         string;
  name:         string;
  description:  string;
  icon:         string;
  use_in:       string[];
  example_task: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */
const PROVIDER_LABELS: Record<string, string> = {
  openai: "OpenAI", anthropic: "Anthropic", gemini: "Gemini",
  grok: "Grok", deepseek: "DeepSeek",
};

const DOMAIN_ICONS: Record<string, string> = {
  code: "💻", ai_ml: "🧠", architecture: "🏗️",
  math: "🔢", business: "📈", explanation: "💡",
  general: "✨", knowledge_base: "📚",
};

function now() {
  if (typeof window === "undefined") return "--:--";
  return new Date().toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

let _seq = 0;
function makeId() {
  _seq += 1;
  return `msg-${Date.now()}-${_seq}-${Math.random().toString(36).slice(2, 6)}`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   NEXUS AGENT WELCOME MESSAGE
───────────────────────────────────────────────────────────────────────────── */
const NEXUS_WELCOME = `# NEXUS Agent 🧠 — Powered by Llama 3.2

I'm **NEXUS** — running on **Llama 3.2**, a real 3.2 billion parameter neural network by Meta AI, installed locally on this machine via Ollama.

**🔒 No API keys. No internet. 100% local.**

**What I can do:**
- 💻 **Write & debug code** — Python, TypeScript, SQL, Bash, and more
- 🏗️ **System design** — architecture diagrams, trade-off analysis
- 🧠 **AI/ML concepts** — RAG, embeddings, fine-tuning, vector search
- 🔢 **Mathematics** — step-by-step derivations, proofs, calculations
- 🔬 **Science** — physics, chemistry, biology explained clearly
- 📈 **Business analysis** — SaaS metrics, strategy, product decisions
- 💡 **Anything else** — general knowledge, comparisons, explanations

**How the neural network pipeline works:**
1. 🔍 Domain detection (instant — local regex)
2. 🤔 Chain-of-thought reasoning (Llama 3.2 thinks first)
3. ✍️ Answer generation (Llama 3.2 streams the response)
4. 🪞 Self-reflection (Llama 3.2 reviews its own answer)

**Try asking:**
- *"What is a syntax error and give an example?"*
- *"Write a Python function to reverse a linked list"*
- *"Explain how neural networks learn"*
- *"Design a REST API for a todo app"*`;

const API_CHAT_WELCOME = `# API Chat ⚡

Direct streaming chat through the **Nexus Auto Router** — connects to the best available AI model using your configured API keys.

**How it works:**
- Routes to **Gemini 2.5 Flash** → Anthropic Claude → OpenAI GPT-4o (in order of availability)
- Real-time **streaming** — words appear as they're generated
- Select specific models using the model picker above
- No session memory — each message is independent

**Best for:**
- Quick questions and lookups
- Creative writing and brainstorming
- Testing specific models
- High-volume conversations`;

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────────────────────── */

/** Pulsing dot indicator */
function StatusDot({ status }: { status: "online" | "offline" | "checking" }) {
  return (
    <span className={cn(
      "h-2 w-2 rounded-full flex-shrink-0",
      status === "online"   && "bg-emerald-400 animate-pulse",
      status === "offline"  && "bg-red-400",
      status === "checking" && "bg-amber-400 animate-pulse",
    )} />
  );
}

/** Reasoning steps panel */
function ReasoningPanel({ steps }: { steps: string[] }) {
  const [open, setOpen] = useState(false);
  if (!steps.length) return null;
  return (
    <div className="mt-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-indigo-400 hover:bg-indigo-500/10 transition-colors text-left"
      >
        <span className="text-base">🤔</span>
        Reasoning steps ({steps.length})
        <span className="ml-auto text-indigo-500">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-1.5 border-t border-indigo-500/10">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-[10px] font-bold text-indigo-400 mt-0.5 w-4 shrink-0">
                {i + 1}.
              </span>
              <p className="text-[11px] text-indigo-300 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Three-dot typing indicator */
function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="flex gap-3 items-end">
      <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm text-white font-bold">
        N
      </div>
      <div className="bg-slate-800/60 border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3 space-y-1">
        <p className="text-[10px] text-indigo-400/70 font-semibold uppercase tracking-wider">{label}</p>
        <div className="flex items-center gap-1.5">
          {[0, 150, 300].map(d => (
            <span key={d} className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce"
              style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Example prompt chips */
function ExampleChips({
  examples,
  onSelect,
}: {
  examples: string[];
  onSelect: (e: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-white/[0.04] bg-dark-950/30">
      <span className="text-[10px] font-semibold text-dark-500 uppercase tracking-wider self-center mr-1">
        Try:
      </span>
      {examples.map(e => (
        <button
          key={e}
          onClick={() => onSelect(e)}
          className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-dark-300 hover:bg-indigo-600/20 hover:border-indigo-500/40 hover:text-indigo-300 transition-all"
        >
          {e}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function ChatPage() {
  /* ── Mode ──────────────────────────────────────────────────────────────── */
  const [mode, setMode] = useState<"nexus" | "api">("nexus");

  /* ── Messages — separate history per mode ──────────────────────────────── */
  const makeWelcome = useCallback((m: "nexus" | "api"): Message => ({
    id: "welcome",
    role: "assistant",
    time: "--:--",
    content: m === "nexus" ? NEXUS_WELCOME : API_CHAT_WELCOME,
  }), []);

  const [nexusMessages, setNexusMessages] = useState<Message[]>(() => [makeWelcome("nexus")]);
  const [apiMessages,   setApiMessages]   = useState<Message[]>(() => [makeWelcome("api")]);

  const messages    = mode === "nexus" ? nexusMessages : apiMessages;
  const setMessages = mode === "nexus" ? setNexusMessages : setApiMessages;

  /* ── Shared ────────────────────────────────────────────────────────────── */
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ── NEXUS Agent state ─────────────────────────────────────────────────── */
  const [nexusStatus,  setNexusStatus]  = useState<"online" | "offline" | "checking">("checking");
  const [nexusModel,   setNexusModel]   = useState("Llama 3.2 · local");
  const [sessionId]                     = useState(() => `session-${Date.now()}`);
  const [showReasoning, setShowReasoning] = useState(true);

  /* ── API Chat state ────────────────────────────────────────────────────── */
  const [selectedModel, setSelectedModel] = useState("auto");
  const [agentList,     setAgentList]     = useState<AgentInfo[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("analytics");
  const [showAgents,    setShowAgents]    = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  /* ── Auto-scroll ───────────────────────────────────────────────────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ── Check NEXUS Agent status (Ollama health check) ────────────────────── */
  useEffect(() => {
    fetch("/api/nexus-agent")
      .then(r => r.json())
      .then((d: { status?: string; model?: string; engine?: string }) => {
        setNexusStatus(d.status === "online" ? "online" : "offline");
        // Show model name cleanly: "llama3.2:latest" → "Llama 3.2 · local"
        if (d.model) {
          const clean = d.model
            .replace(/:latest$/, "")
            .replace("llama", "Llama ")
            .replace("3.2", "3.2")
            .trim();
          setNexusModel(`${clean} · local`);
        }
      })
      .catch(() => setNexusStatus("offline"));
  }, []);

  /* ── Load agent list for API Chat agent sub-mode (only needed when using agents) ── */
  useEffect(() => {
    // Only try if we might show the agent strip — quiet fail if FastAPI is offline
    fetch("/api/ai/api/v1/agents/list")
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then((d: { agents?: AgentInfo[] }) => {
        if (d.agents) setAgentList(d.agents);
      })
      .catch(() => {
        // FastAPI offline — agents list stays empty, UI shows graceful fallback
      });
  }, []);

  const currentAgent = agentList.find(a => a.type === selectedAgent);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("conversation");
    if (!id) return;

    setMode("api");
    setConversationId(id);
    fetch(`/api/conversations/${id}/messages`)
      .then((response) => response.ok ? response.json() : Promise.reject(response.status))
      .then((payload: { data?: Array<{ id: string; role: string; content: string; createdAt: string }> }) => {
        const loaded = (payload.data ?? [])
          .filter((message) => message.role === "user" || message.role === "assistant")
          .map((message) => ({
            id: message.id,
            role: message.role as "user" | "assistant",
            content: message.content,
            time: new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          }));
        setApiMessages(loaded.length ? [makeWelcome("api"), ...loaded] : [makeWelcome("api")]);
      })
      .catch(() => setConversationId(null));
  }, [makeWelcome]);

  const ensureConversation = async (): Promise<string> => {
    if (conversationId) return conversationId;

    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "API Chat" }),
    });
    const data = await response.json() as { data?: { id: string }; error?: string };
    if (!response.ok || !data.data?.id) {
      throw new Error(data.error ?? "Unable to create conversation");
    }
    setConversationId(data.data.id);
    return data.data.id;
  };

  /* ── Clear conversation ─────────────────────────────────────────────────── */
  const clearChat = useCallback(() => {
    setMessages([makeWelcome(mode)]);
    if (mode === "nexus") {
      fetch(`/api/ai/api/v1/nexus-agent/session?session_id=${sessionId}`, {
        method: "DELETE",
      }).catch(() => {});
    }
  }, [mode, makeWelcome, sessionId, setMessages]);

  /* ─────────────────────────────────────────────────────────────────────────
     SEND — NEXUS AGENT (streaming SSE from Python agent)
  ───────────────────────────────────────────────────────────────────────── */
  const sendNexusMessage = async (text: string) => {
    const userId      = makeId();
    const assistantId = makeId();
    setMessages(prev => [
      ...prev,
      { id: userId,      role: "user",      content: text, time: now() },
      { id: assistantId, role: "assistant",  content: "", time: now(), streaming: true },
    ]);
    setLoading(true);

    // Build history from current messages for context
    const history = nexusMessages
      .filter(m => m.role !== "system" && m.id !== "welcome" && !m.error)
      .slice(-8)
      .map(m => ({ role: m.role as "user" | "assistant", content: m.content }));

    try {
      // Use native Next.js route — works without FastAPI being running
      const res = await fetch("/api/nexus-agent", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:    text,
          session_id: sessionId,
          history,
          model:      "auto",
        }),
      });

      if (!res.ok || !res.body) {
        const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` })) as { error?: string };
        const errMsg = errData.error ?? `NEXUS Agent returned ${res.status}`;
        // Give an actionable message for common errors
        if (res.status === 401) throw new Error("Not logged in — please refresh the page.");
        if (res.status === 503) throw new Error("No AI provider keys configured. Add GOOGLE_AI_API_KEY to apps/web/.env.local");
        throw new Error(errMsg);
      }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = "";
      let   reasoningSteps: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const data = event.trim();
          if (!data.startsWith("data: ")) continue;
          try {
            const chunk = JSON.parse(data.slice(6)) as {
              type:              string;
              content?:          string;
              steps?:            string[];
              domain?:           string;
              tokens_used?:      number;
              model_used?:       string;
              elapsed_seconds?:  number;
              reflection?:       string;
              from_knowledge_base?: boolean;
              error?:            string;
            };

            if (chunk.type === "thinking" && chunk.steps) {
              reasoningSteps = chunk.steps;
              setMessages(prev => prev.map(m => m.id === assistantId
                ? { ...m, reasoningSteps: chunk.steps } : m));

            } else if (chunk.type === "delta" && chunk.content) {
              setMessages(prev => prev.map(m => m.id === assistantId
                ? { ...m, content: m.content + chunk.content } : m));

            } else if (chunk.type === "done") {
              setMessages(prev => prev.map(m => m.id === assistantId ? {
                ...m,
                streaming:      false,
                domain:         chunk.domain,
                tokens:         chunk.tokens_used,
                model:          chunk.model_used?.replace("models/", "") ?? nexusModel,
                elapsedSeconds: chunk.elapsed_seconds,
                reflection:     chunk.reflection ?? undefined,
                fromKB:         chunk.from_knowledge_base,
                reasoningSteps,
              } : m));

            } else if (chunk.type === "error") {
              setMessages(prev => prev.map(m => m.id === assistantId
                ? { ...m, streaming: false, content: `⚠️ ${chunk.error}`, error: true } : m));
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages(prev => prev.map(m => m.id === assistantId
        ? { ...m, streaming: false, content: `⚠️ ${msg}`, error: true } : m));
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
     SEND — API CHAT (streaming from Next.js /api/chat)
  ───────────────────────────────────────────────────────────────────────── */
  const sendApiMessage = async (text: string) => {
    const userId      = makeId();
    const assistantId = makeId();
    setMessages(prev => [
      ...prev,
      { id: userId,      role: "user",     content: text, time: now() },
      { id: assistantId, role: "assistant", content: "", time: now(), streaming: true },
    ]);
    setLoading(true);

    const history = messages
      .filter(m => m.role !== "system" && m.id !== "welcome" && !m.error)
      .slice(-10)
      .map(m => ({ role: m.role as "user" | "assistant", content: m.content }));

    try {
      const activeConversationId = await ensureConversation();
      for await (const chunk of streamChat({
        model:       selectedModel,
        conversationId: activeConversationId,
        messages:    [...history, { role: "user", content: text }],
        temperature: 0.7,
      })) {
        if (chunk.type === "delta") {
          setMessages(prev => prev.map(m => m.id === assistantId
            ? { ...m, content: m.content + chunk.content } : m));
        } else if (chunk.type === "done") {
          setMessages(prev => prev.map(m => m.id === assistantId ? {
            ...m,
            streaming: false,
            model:     chunk.model,
            provider:  PROVIDER_LABELS[chunk.provider ?? ""] ?? chunk.provider,
            tokens:    chunk.usage?.totalTokens,
          } : m));
        } else if (chunk.type === "error") {
          setMessages(prev => prev.map(m => m.id === assistantId
            ? { ...m, streaming: false, content: `⚠️ ${chunk.error}`, error: true } : m));
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages(prev => prev.map(m => m.id === assistantId
        ? { ...m, streaming: false, content: `⚠️ ${msg}`, error: true } : m));
    } finally {
      setLoading(false);
    }
  };

  /* ── Specialist agent send (sub-mode inside API Chat) ─────────────────── */
  const sendSpecialistAgent = async (text: string) => {
    const userId      = makeId();
    const assistantId = makeId();
    setMessages(prev => [
      ...prev,
      { id: userId,      role: "user",      content: text, time: now() },
      { id: assistantId, role: "assistant",  content: "", time: now(), streaming: true },
    ]);
    setLoading(true);

    try {
      const res  = await fetch("/api/ai/api/v1/agents/run", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_type: selectedAgent,
          task:       text,
          context:    "",
          documents:  [],
          data:       {},
          model:      "gpt-4o",
          temperature: 0.4,
        }),
      });
      const data = await res.json() as {
        answer?: string; tokens_used?: number;
        model_used?: string; error?: string; detail?: string;
      };

      const content = data.answer || data.error || data.detail || "No response";
      setMessages(prev => prev.map(m => m.id === assistantId ? {
        ...m,
        streaming: false,
        content,
        model:  data.model_used ?? nexusModel,
        tokens: data.tokens_used,
        error:  !data.answer,
      } : m));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages(prev => prev.map(m => m.id === assistantId
        ? { ...m, streaming: false, content: `⚠️ ${msg}`, error: true } : m));
    } finally {
      setLoading(false);
    }
  };

  /* ── Unified send ───────────────────────────────────────────────────────── */
  const sendMessage = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    textareaRef.current?.focus();

    if (mode === "nexus") {
      sendNexusMessage(text);
    } else if (showAgents) {
      sendSpecialistAgent(text);
    } else {
      sendApiMessage(text);
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
     NEXUS AGENT example prompts
  ───────────────────────────────────────────────────────────────────────── */
  const NEXUS_EXAMPLES = [
    "What is a syntax error? Give examples",
    "Write a Python function to reverse a linked list",
    "Explain how neural networks learn",
    "Design a REST API for a todo app",
    "What is the difference between RAM and ROM?",
  ];

  const API_EXAMPLES = [
    "How does JavaScript closures work?",
    "Write a Python FastAPI CRUD endpoint",
    "Explain Docker vs Kubernetes",
    "What are SOLID principles?",
  ];

  /* ─────────────────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar activeNav="chat" />

        <div className="flex flex-1 overflow-hidden min-w-0">

          {/* ──────────────────────────────── LEFT: Main chat ─────────────── */}
          <main className="flex-1 flex flex-col overflow-hidden min-w-0">

            {/* ── Top bar ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/[0.06] bg-dark-900/60 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <h1 className="text-sm font-extrabold text-white whitespace-nowrap">AI Studio</h1>

                {/* Mode toggle — the two main options */}
                <div className="flex rounded-xl border border-white/10 bg-dark-800/80 p-0.5 gap-0.5">
                  {/* NEXUS Agent */}
                  <button
                    type="button"
                    onClick={() => { setMode("nexus"); setShowAgents(false); }}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                      mode === "nexus"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow"
                        : "text-dark-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <span>🧠</span>
                    <span>NEXUS Agent</span>
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                      mode === "nexus" ? "bg-white/20 text-white" : "bg-emerald-500/20 text-emerald-400"
                    )}>LOCAL</span>
                  </button>

                  {/* API Chat */}
                  <button
                    type="button"
                    onClick={() => setMode("api")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                      mode === "api"
                        ? "bg-brand-600 text-white shadow"
                        : "text-dark-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <span>⚡</span>
                    <span>API Chat</span>
                  </button>
                </div>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2 shrink-0">
                {mode === "nexus" ? (
                  <>
                    {/* NEXUS Agent status pill */}
                    <div className={cn(
                      "hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border",
                      nexusStatus === "online"   && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                      nexusStatus === "offline"  && "bg-red-500/10 text-red-400 border-red-500/20",
                      nexusStatus === "checking" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    )}>
                      <StatusDot status={nexusStatus} />
                      {nexusStatus === "online"
                        ? nexusModel
                        : nexusStatus === "offline"
                          ? "Ollama offline — run: ollama serve"
                          : "Checking Ollama…"}
                    </div>
                    {/* Toggle reasoning */}
                    <button
                      type="button"
                      onClick={() => setShowReasoning(r => !r)}
                      title={showReasoning ? "Hide reasoning steps" : "Show reasoning steps"}
                      className={cn(
                        "rounded-xl px-2.5 py-1.5 text-[11px] font-semibold border transition-colors",
                        showReasoning
                          ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-400"
                          : "border-white/10 bg-white/5 text-dark-400 hover:text-white"
                      )}
                    >
                      🤔 Reasoning
                    </button>
                  </>
                ) : (
                  <>
                    {/* Agent sub-mode toggle */}
                    <button
                      type="button"
                      onClick={() => setShowAgents(a => !a)}
                      className={cn(
                        "rounded-xl px-2.5 py-1.5 text-[11px] font-semibold border transition-colors",
                        showAgents
                          ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-400"
                          : "border-white/10 bg-white/5 text-dark-400 hover:text-white"
                      )}
                    >
                      🤖 Agents
                    </button>
                    {/* Model selector (only for direct API chat, not agent sub-mode) */}
                    {!showAgents && (
                      <ModelSelector value={selectedModel} onChange={setSelectedModel} />
                    )}
                  </>
                )}

                <button
                  type="button"
                  onClick={clearChat}
                  className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-[11px] font-medium text-dark-300 hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* ── Agent selector strip (API Chat > Agents sub-mode) ──────── */}
            {mode === "api" && showAgents && (
              <div className="flex gap-1.5 px-4 py-2 border-b border-white/[0.04] bg-dark-900/40 overflow-x-auto shrink-0">
                <span className="text-[10px] font-semibold text-dark-500 uppercase tracking-wider self-center shrink-0 mr-1">
                  Specialist:
                </span>
                {agentList.map(a => (
                  <button
                    key={a.type}
                    type="button"
                    onClick={() => setSelectedAgent(a.type)}
                    title={a.description}
                    className={cn(
                      "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all shrink-0",
                      selectedAgent === a.type
                        ? "bg-brand-600 text-white shadow"
                        : "border border-white/10 bg-white/5 text-dark-300 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span>{a.icon}</span>
                    <span>{a.name.replace(" Agent", "")}</span>
                  </button>
                ))}
              </div>
            )}

            {/* ── Example chips (shown when chat is fresh) ─────────────────── */}
            {messages.length <= 1 && (
              <ExampleChips
                examples={mode === "nexus" ? NEXUS_EXAMPLES : API_EXAMPLES}
                onSelect={text => { setInput(text); textareaRef.current?.focus(); }}
              />
            )}

            {/* ── Messages ─────────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                >
                  {/* Avatar */}
                  <div className={cn(
                    "h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold",
                    msg.role === "user"
                      ? "bg-brand-600 text-white"
                      : msg.error
                        ? "bg-red-600/20 text-red-400"
                        : mode === "nexus"
                          ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                          : "bg-gradient-to-br from-brand-500 to-teal-500 text-white"
                  )}>
                    {msg.role === "user"
                      ? "U"
                      : mode === "nexus" ? "N" : "AI"}
                  </div>

                  {/* Bubble */}
                  <div className={cn("max-w-[78%] space-y-1", msg.role === "user" && "items-end flex flex-col")}>
                    {/* Agent label */}
                    {msg.role === "assistant" && !msg.error && (
                      <p className={cn(
                        "text-[10px] font-semibold uppercase tracking-wider px-1 flex items-center gap-1.5",
                        mode === "nexus" ? "text-indigo-400/70" : "text-brand-400/70"
                      )}>
                        {mode === "nexus" ? (
                          <>
                            🧠 NEXUS Agent
                            {msg.domain && msg.domain !== "knowledge_base" && (
                              <span className="text-dark-500">·</span>
                            )}
                            {msg.domain && (
                              <span className="text-dark-500">
                                {DOMAIN_ICONS[msg.domain] ?? "✨"} {msg.domain.replace("_", " ")}
                              </span>
                            )}
                            {msg.fromKB && (
                              <span className="text-amber-400/70">📚 knowledge base</span>
                            )}
                          </>
                        ) : showAgents && currentAgent ? (
                          <>{currentAgent.icon} {currentAgent.name}</>
                        ) : (
                          <>⚡ API Chat</>
                        )}
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
                          ? <>
                              <MarkdownRenderer content={msg.content} />
                              {msg.streaming && (
                                <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-indigo-400 align-middle" />
                              )}
                            </>
                          : msg.streaming
                            ? <span className="text-dark-500 text-xs animate-pulse">
                                {mode === "nexus" ? "NEXUS is thinking…" : "Generating response…"}
                              </span>
                            : null
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>

                    {/* Reasoning steps (NEXUS mode only) */}
                    {mode === "nexus" && showReasoning && !msg.streaming && (msg.reasoningSteps?.length ?? 0) > 0 && (
                      <ReasoningPanel steps={msg.reasoningSteps!} />
                    )}

                    {/* Reflection (NEXUS mode only) */}
                    {mode === "nexus" && msg.reflection && !msg.streaming && (
                      <div className="mt-1.5 px-3 py-2 rounded-xl bg-violet-500/5 border border-violet-500/15 text-[11px] text-violet-300/70 italic">
                        🪞 {msg.reflection}
                      </div>
                    )}

                    {/* Meta row */}
                    {!msg.streaming && msg.role === "assistant" && msg.id !== "welcome" && (
                      <p className="text-[10px] text-dark-600 px-1 flex items-center gap-1.5 flex-wrap">
                        <span>{msg.time}</span>
                        {msg.model && <><span className="text-dark-700">·</span><span className={cn(
                          mode === "nexus" ? "text-indigo-400/50" : "text-brand-400/50"
                        )}>{
                          msg.model.startsWith("llama") || msg.model.includes("local")
                            ? "🧠 Llama 3.2 · local"
                            : msg.model
                        }</span></>}
                        {msg.tokens && <><span className="text-dark-700">·</span><span>{msg.tokens.toLocaleString()} tokens</span></>}
                        {msg.elapsedSeconds && <><span className="text-dark-700">·</span><span>{msg.elapsedSeconds}s</span></>}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && !messages.some(m => m.streaming && m.content) && (
                <TypingIndicator
                  label={mode === "nexus"
                    ? "Llama 3.2 · thinking…"
                    : showAgents && currentAgent
                      ? `${currentAgent.name} · processing…`
                      : "Generating…"}
                />
              )}

              <div ref={bottomRef} />
            </div>

            {/* ── Input area ───────────────────────────────────────────────── */}
            <div className="px-4 pb-3 pt-2.5 border-t border-white/[0.06] bg-dark-900/40 backdrop-blur-sm shrink-0">

              {/* Context hint bar */}
              <div className={cn(
                "mb-2 flex items-center gap-2 text-[11px] px-1",
                mode === "nexus" ? "text-indigo-400/60" : "text-brand-400/60"
              )}>
                {mode === "nexus" ? (
                  <>
                    <span>🧠</span>
                    <span>NEXUS Agent — Llama 3.2 (3.2B) · local neural network · no API key · no internet</span>
                    <span className="ml-auto">
                      {nexusStatus === "online" ? "🟢 Ollama running" : nexusStatus === "offline" ? "🔴 Run: ollama serve" : "🟡 checking…"}
                    </span>
                  </>
                ) : showAgents && currentAgent ? (
                  <>
                    <span>{currentAgent.icon}</span>
                    <span>{currentAgent.name} — {currentAgent.description.slice(0, 60)}…</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>API Chat — Nexus Auto routes to best available model · real-time streaming</span>
                  </>
                )}
              </div>

              {/* Textarea + send button */}
              <div className="flex gap-2 items-end">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={
                    mode === "nexus"
                      ? "Ask NEXUS Agent anything… (Enter to send, Shift+Enter for new line)"
                      : showAgents && currentAgent
                        ? `Ask ${currentAgent.name}… (Enter to send)`
                        : "Message API Chat… (Enter to send)"
                  }
                  rows={1}
                  disabled={loading}
                  className="flex-1 resize-none rounded-2xl border border-white/10 bg-dark-800/80 px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition disabled:opacity-50 min-h-[44px] max-h-32"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all shadow-lg self-end disabled:opacity-40 disabled:cursor-not-allowed",
                    mode === "nexus"
                      ? "bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/25"
                      : "bg-brand-600 hover:bg-brand-500 shadow-brand-600/25"
                  )}
                >
                  {loading
                    ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    : <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="m22 2-7 20-4-9-9-4Z"/>
                        <path d="M22 2 11 13"/>
                      </svg>
                  }
                </button>
              </div>
            </div>
          </main>

          {/* Right panel removed — clean full-width chat */}
        </div>
      </div>
    </div>
  );
}
