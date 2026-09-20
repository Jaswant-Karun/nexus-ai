"use client";

import React, { useState } from "react";
import Link from "next/link";

type Language = "en" | "ta";

interface FeatureGuide {
  id: string;
  category: "agents" | "workflows" | "memory" | "storage" | "analytics" | "settings";
  icon: string;
  badge: {
    en: string;
    ta: string;
  };
  title: {
    en: string;
    ta: string;
  };
  subtitle: {
    en: string;
    ta: string;
  };
  overview: {
    en: string;
    ta: string;
  };
  steps: {
    en: string[];
    ta: string[];
  };
  proTip: {
    en: string;
    ta: string;
  };
  targetRoute: string;
  actionText: {
    en: string;
    ta: string;
  };
}

const FEATURE_GUIDES: FeatureGuide[] = [
  {
    id: "agents",
    category: "agents",
    icon: "🤖",
    badge: {
      en: "Core Intelligence",
      ta: "முக்கிய நுண்ணறிவு",
    },
    title: {
      en: "Autonomous AI Agents & Multi-Model Chat",
      ta: "தன்னாட்சி AI முகவர்கள் மற்றும் பல்வகை மாதிரி அரட்டை",
    },
    subtitle: {
      en: "Interact with GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, and local LLaMA with persistent memory.",
      ta: "GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro மற்றும் LLaMA மாதிரிகளுடன் நிலையான நினைவகத்துடன் உரையாடுங்கள்.",
    },
    overview: {
      en: "Nexus AI gives you an intelligent command chat where you can route queries to the world's best foundation models. Agents can execute real-world tools (web search, Python code sandbox, memory lookup) and retain conversation context across sessions.",
      ta: "Nexus AI உலகின் தலைசிறந்த AI மாதிரிகளை ஒரே இடத்தில் வழங்குகிறது. இந்த AI முகவர்கள் இணைய தேடல், பைதான் கோட் ரன் செய்தல் மற்றும் முந்தைய உரையாடல்களை நினைவில் வைத்து செயல்படும் ஆற்றல் கொண்டவை.",
    },
    steps: {
      en: [
        "Click 'Chat & Agents' in the left navigation sidebar or navbar.",
        "Select your preferred reasoning engine from the top model switcher (e.g. GPT-4o for code, Claude for deep analysis).",
        "Type your prompt or use '/' slash commands to load predefined skill templates.",
        "Toggle tools like Web Search or Memory Recall to give your agent real-time capabilities.",
      ],
      ta: [
        "பக்கவாட்டு மெனுவில் உள்ள 'Chat & Agents' பகுதியை கிளிக் செய்யவும்.",
        "மேலே உள்ள மாடல் தேர்வியில் உங்களுக்கு தேவையான AI மாடலை (GPT-4o, Claude, Gemini) தேர்வு செய்யவும்.",
        "உங்கள் கேள்வியை தட்டச்சு செய்யவும் அல்லது '/' கட்டளை மூலம் ஆயத்த டெம்ப்ளேட்களைப் பயன்படுத்தவும்.",
        "நிகழ்நேர தகவல்களைப் பெற Web Search அல்லது Memory Recall பொத்தானை ஆன் செய்யவும்.",
      ],
    },
    proTip: {
      en: "Press Enter to send, or Shift+Enter for a new line. You can pin important conversations for quick retrieval.",
      ta: "செய்தியை அனுப்ப Enter அழுத்தவும். முக்கியமான உரையாடல்களை விரைவாக அணுக 'Pin' செய்து வைக்கலாம்.",
    },
    targetRoute: "/chat",
    actionText: {
      en: "Launch AI Chat",
      ta: "AI அரட்டையைத் தொடங்கு",
    },
  },
  {
    id: "workflows",
    category: "workflows",
    icon: "⚡",
    badge: {
      en: "Visual Automation",
      ta: "பணிப்பாய்வு தானியக்கம்",
    },
    title: {
      en: "Visual Workflow Canvas & Multi-Step Pipelines",
      ta: "காட்சிப் பணிப்பாய்வு மற்றும் பல-படி குழாய்த்தொடர்",
    },
    subtitle: {
      en: "Connect triggers, webhooks, and AI agent steps in a drag-and-drop no-code environment.",
      ta: "கோடிங் இல்லாமல் டிராக்-அண்ட்-டிராப் முறையில் AI முகவர்கள் மற்றும் வெப்ஹூக்குகளை இணைத்து பணிகளை தானியக்கமாக்குங்கள்.",
    },
    overview: {
      en: "The Workflow Canvas enables you to automate complex business processes. Trigger actions on webhooks, schedule cron jobs, parse documents with AI, and dispatch automated emails or Slack notifications without writing code.",
      ta: "Workflow Canvas மூலம் சிக்கலான வணிக செயல்முறைகளை தானியக்கமாக்கலாம். வெப்ஹூக் வந்தவுடன் AI மூலம் ஆவணங்களை பகுப்பாய்வு செய்து, ஸ்லாக் (Slack) அல்லது மின்னஞ்சல் வழியாக தானியங்கி எச்சரிக்கைகளை அனுப்பலாம்.",
    },
    steps: {
      en: [
        "Open 'Workflows' from the platform sidebar.",
        "Click '+ New Workflow' or choose an existing automated template.",
        "Drag a Trigger node (e.g., Webhook, Schedule, or Inbound File) onto the canvas.",
        "Connect AI Processing, Filter, and Output notification nodes using visual wire connectors.",
        "Click 'Test Run' to inspect live execution payloads and click 'Deploy' to publish.",
      ],
      ta: [
        "பக்கவாட்டு மெனுவிலிருந்து 'Workflows' பகுதிக்கு செல்லவும்.",
        "'+ New Workflow' பொத்தானை கிளிக் செய்து புதிய கேன்வாஸை திறக்கவும்.",
        "ஒரு தூண்டுதல் முனையை (Trigger: Webhook அல்லது Schedule) கேன்வாஸில் இழுத்து வைக்கவும்.",
        "அதனுடன் AI செயலாக்கம் மற்றும் அறிவிப்பு முனைகளை கம்பிகள் (Wire connectors) மூலம் இணைக்கவும்.",
        "'Test Run' செய்து சோதித்துவிட்டு 'Deploy' கொடுத்து இயக்கவும்.",
      ],
    },
    proTip: {
      en: "Use condition branches (If/Else) to route requests based on AI classification confidence scores.",
      ta: "AI-ன் வகைப்பாட்டின் அடிப்படையில் முடிவுகளை எடுக்க 'If/Else' நிபந்தனை முனைகளைப் பயன்படுத்தவும்.",
    },
    targetRoute: "/workflow",
    actionText: {
      en: "Open Workflow Canvas",
      ta: "பணிப்பாய்வு கேன்வாஸை திற",
    },
  },
  {
    id: "memory",
    category: "memory",
    icon: "🧠",
    badge: {
      en: "Hybrid RAG Engine",
      ta: "அறிவு மற்றும் நினைவகம்",
    },
    title: {
      en: "Adaptive Memory Bank & Knowledge Base",
      ta: "தகவமைப்பு நினைவகம் மற்றும் அறிவுத்தளம்",
    },
    subtitle: {
      en: "Sub-millisecond hybrid vector retrieval (BM25 + Qdrant dense embeddings) for enterprise documents.",
      ta: "உங்கள் நிறுவன ஆவணங்களை உடனடியாக தேடி துல்லியமான ஆதாரங்களை வழங்கும் வெக்டார் RAG அமைப்பு.",
    },
    overview: {
      en: "The Knowledge Base indexes enterprise PDFs, Word documents, manuals, and codebases into a semantic vector database. When you chat or run workflows, relevant knowledge is automatically retrieved and injected into the prompt for hallucinations-free answers.",
      ta: "உங்கள் நிறுவனத்தின் PDFகள், ஆவணங்கள் மற்றும் வழிகாட்டிகளை வெக்டார் தரவுத்தளத்தில் சேமித்து வைக்கிறது. நீங்கள் கேள்வி கேட்கும்போது, ஆவணங்களில் உள்ள சரியான வரிகளை கண்டறிந்து பிழையற்ற பதில்களை வழங்குகிறது.",
    },
    steps: {
      en: [
        "Navigate to 'Knowledge Base' or 'Workspace' in the menu.",
        "Upload your technical documents, policy files, or project guidelines.",
        "The automated ingestion pipeline chunks text, calculates embeddings, and indexes them.",
        "Ask questions in natural language and receive grounded answers with exact document citations.",
      ],
      ta: [
        "மெனுவில் உள்ள 'Knowledge Base' அல்லது 'Workspace' பகுதிக்கு செல்லவும்.",
        "உங்கள் நிறுவனத்தின் ஆவணங்கள் அல்லது கோப்புகளை பதிவேற்றவும்.",
        "கணினி தானாகவே ஆவணங்களை சிறு பகுதிகளாக பிரித்து வெக்டார் குறியீடாக மாற்றும்.",
        "உங்கள் சொந்த மொழியில் வினாக்களை எழுப்பி, ஆவண ஆதாரங்களுடன் துல்லியமான பதில்களைப் பெறுங்கள்.",
      ],
    },
    proTip: {
      en: "Enable Hybrid Search to combine exact keyword matching (BM25) with semantic conceptual similarity.",
      ta: "சரியான வார்த்தை பொருத்தம் மற்றும் கருத்து பொருத்தம் இரண்டையும் ஒன்றாக பெற Hybrid Search-ஐ பயன்படுத்தவும்.",
    },
    targetRoute: "/workspace",
    actionText: {
      en: "Explore Knowledge Base",
      ta: "அறிவுத்தளத்தை காண்க",
    },
  },
  {
    id: "storage",
    category: "storage",
    icon: "☁️",
    badge: {
      en: "AI Document Intelligence",
      ta: "அறிவார்ந்த சேமிப்பகம்",
    },
    title: {
      en: "Smart File Storage & Automated OCR Processing",
      ta: "ஸ்மார்ட் கோப்பு சேமிப்பகம் மற்றும் தானியங்கி OCR",
    },
    subtitle: {
      en: "Upload PDFs, Word docs, and images with automatic text extraction, summaries, and encryption.",
      ta: "PDF, படங்கள் மற்றும் ஆவணங்களை பதிவேற்றி தானியங்கி உரை பிரித்தெடுத்தல் மற்றும் சுருக்கங்களை பெறுங்கள்.",
    },
    overview: {
      en: "Every uploaded file undergoes instant cryptographic hashing, virus scanning, OCR text extraction, and automated LLM summarization. You can organize files into collections, inspect extracted metadata, and link files directly to agents.",
      ta: "பதிவேற்றப்படும் ஒவ்வொரு கோப்பும் பாதுகாப்பாக மறைகுறியாக்கப்பட்டு (Encrypted), உரை பிரித்தெடுக்கப்பட்டு, AI மூலம் சிறிய சுருக்கமாக மாற்றப்படுகிறது. உங்கள் கோப்புகளை எளிதாக தொகுத்து வைக்கலாம்.",
    },
    steps: {
      en: [
        "Go to 'Smart Storage' in the left menu.",
        "Drag and drop documents or click 'Upload Files' from your computer.",
        "View processing status: Text extraction, vector embedding, and key tags.",
        "Click on any file to read its AI summary, extracted tables, and cryptographic hash.",
      ],
      ta: [
        "இடதுபுற மெனுவில் உள்ள 'Smart Storage' பகுதிக்கு செல்லவும்.",
        "உங்கள் கணினியிலிருந்து கோப்புகளை இழுத்து விடவும் அல்லது 'Upload Files' கிளிக் செய்யவும்.",
        "செயலாக்க நிலையை கண்காணிக்கவும்: உரை பிரித்தெடுத்தல், சுருக்கம் மற்றும் குறிச்சொற்கள்.",
        "கோப்பை கிளிக் செய்து AI தயாரித்த சுருக்கம் மற்றும் தகவல்களைப் படிக்கவும்.",
      ],
    },
    proTip: {
      en: "Scanned receipts and invoices are automatically OCR-converted and structured into clean JSON data.",
      ta: "ஸ்கேன் செய்யப்பட்ட ரசீதுகள் மற்றும் பில்கள் தானாகவே உரை வடிவமாக மாற்றப்பட்டு துல்லியமாக சேமிக்கப்படும்.",
    },
    targetRoute: "/storage",
    actionText: {
      en: "Open Smart Storage",
      ta: "சேமிப்பகத்தை திற",
    },
  },
  {
    id: "analytics",
    category: "analytics",
    icon: "📊",
    badge: {
      en: "Real-time Telemetry",
      ta: "நிகழ்நேர பகுப்பாய்வு",
    },
    title: {
      en: "Real-Time Telemetry, Token Tracking & Analytics",
      ta: "நிகழ்நேர தொலை அளவியல் மற்றும் பயன்பாட்டு கண்காணிப்பு",
    },
    subtitle: {
      en: "Monitor inference latencies, token consumption, cost per request, and agent performance.",
      ta: "டோக்கன் பயன்பாடு, செலவு, AI வேகம் மற்றும் கணினி இயக்க நிலையை நேரலையாக கண்காணிக்கவும்.",
    },
    overview: {
      en: "Nexus AI provides enterprise-grade observability. Track how many tokens your team consumes across OpenAI, Anthropic, and Gemini, measure agent execution latency in milliseconds, and identify workflow optimization opportunities.",
      ta: "உங்கள் குழு எவ்வளவு AI டோக்கன்களைப் பயன்படுத்துகிறது, எந்த மாதிரி குறைந்த செலவில் அதிக பலன் தருகிறது, மற்றும் பணிப்பாய்வுகளின் வேகம் ஆகியவற்றை வரைபடங்கள் மூலம் கண்காணிக்கலாம்.",
    },
    steps: {
      en: [
        "Click 'Analytics' or 'Dashboard' from the navigation bar.",
        "Examine the real-time activity graphs showing request volumes and response latency.",
        "Review token breakdown by model (GPT-4o vs Claude vs Gemini).",
        "Export audit logs and usage summaries for management and billing reconciliation.",
      ],
      ta: [
        "மெனுவில் உள்ள 'Analytics' அல்லது 'Dashboard' பக்கத்திற்கு செல்லவும்.",
        "கோரிக்கைகளின் எண்ணிக்கை மற்றும் வேகத்தை காட்டும் நிகழ்நேர வரைபடங்களை காண்க.",
        "ஒவ்வொரு மாடலின் டோக்கன் பயன்பாடு மற்றும் செலவு விவரங்களை சரிபார்க்கவும்.",
        "நிறுவன கணக்கீடுகளுக்காக பயன்பாட்டு அறிக்கைகளை (Reports) எக்ஸ்போர்ட் செய்யவும்.",
      ],
    },
    proTip: {
      en: "Set up budget limits in Settings to receive automatic warnings when 80% of monthly quota is reached.",
      ta: "மாதாந்திர ஒதுக்கீட்டில் 80% எட்டப்படும்போது எச்சரிக்கை பெற 'Settings'-ல் வரம்புகளை அமைக்கவும்.",
    },
    targetRoute: "/analytics",
    actionText: {
      en: "View Live Analytics",
      ta: "பகுப்பாய்வைக் காண்க",
    },
  },
  {
    id: "settings",
    category: "settings",
    icon: "⚙️",
    badge: {
      en: "Customization & Security",
      ta: "தனிப்பயனாக்கம் மற்றும் பாதுகாப்பு",
    },
    title: {
      en: "Theme Controls, AI Persona & Platform Settings",
      ta: "விருப்பத் தோற்றம், AI ஆளுமை மற்றும் கணக்கு அமைப்புகள்",
    },
    subtitle: {
      en: "Switch between crisp Light Mode & Obsidian Dark Mode, customize AI Co-Pilot, and manage API keys.",
      ta: "Light Mode அல்லது Dark Mode-க்கு மாறவும், தனிப்பட்ட AI துணைவரை வடிவமைக்கவும், API சாவிகளை நிர்வகிக்கவும்.",
    },
    overview: {
      en: "Configure the platform according to your exact ergonomics. Toggle between high-contrast Light Mode and dark mode, customize your personal AI companion persona codename and tone, manage organization API keys, and enable Two-Factor Authentication.",
      ta: "உங்கள் விருப்பத்திற்கேற்ப தளத்தின் தோற்றத்தை மாற்றலாம். பகல் நேரத்திற்கு தெளிவான Light Mode, இரவு நேரத்திற்கு Dark Mode-ஐ பயன்படுத்தலாம். மேலும் உங்கள் சொந்த AI உதவியாளரின் பெயர் மற்றும் இயல்புகளை மாற்றிக்கொள்ளலாம்.",
    },
    steps: {
      en: [
        "Click your profile avatar or select 'Settings' in the navigation bar.",
        "In Appearance & Theme, choose between 'Light Mode', 'Dark Mode', or 'System Sync'.",
        "Visit 'My Profile' to customize your Cyber Avatar archetype, title, and bio statement.",
        "Under 'AI Co-Pilot Persona', customize your companion's name, tone, and default reasoning engine.",
        "Manage API keys and review active sessions under Security.",
      ],
      ta: [
        "மேலே உள்ள உங்கள் அவதார் படத்தை அல்லது 'Settings' பொத்தானை அழுத்தவும்.",
        "தோற்ற அமைப்புகளில் 'Light Mode', 'Dark Mode' அல்லது 'System Sync'-ஐ தேர்வு செய்யவும்.",
        "'My Profile' சென்று உங்கள் அவதார், பதவி மற்றும் சுயவிவரத்தை மாற்றவும்.",
        "'AI Co-Pilot Persona' பகுதியில் உங்கள் AI உதவியாளரின் பெயர் மற்றும் தொனியை அமைக்கவும்.",
        "பாதுகாப்பு பகுதியில் API சாவிகளை உருவாக்கி பாதுகாப்பாக நிர்வகிக்கவும்.",
      ],
    },
    proTip: {
      en: "Light mode gives maximum daytime contrast, while dark mode reduces eye fatigue during extended deep work.",
      ta: "Light Mode பகலில் வாசிப்பதற்கு எளிதாகவும், Dark Mode இரவில் கண்களுக்கு இதமாகவும் இருக்கும்.",
    },
    targetRoute: "/settings",
    actionText: {
      en: "Open Settings",
      ta: "அமைப்புகளுக்கு செல்",
    },
  },
];

export function HowToUseGuide() {
  const [lang, setLang] = useState<Language>("en");
  const [activeTabId, setActiveTabId] = useState<string>("agents");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: { en: "All Features", ta: "அனைத்து அம்சங்கள்" } },
    { id: "agents", label: { en: "AI Agents", ta: "AI முகவர்கள்" } },
    { id: "workflows", label: { en: "Workflows", ta: "பணிப்பாய்வுகள்" } },
    { id: "memory", label: { en: "Knowledge RAG", ta: "அறிவுத்தளம்" } },
    { id: "storage", label: { en: "Storage & OCR", ta: "சேமிப்பகம்" } },
    { id: "analytics", label: { en: "Analytics", ta: "பகுப்பாய்வு" } },
    { id: "settings", label: { en: "Settings & Theme", ta: "அமைப்புகள்" } },
  ];

  const filteredGuides = selectedCategory === "all"
    ? FEATURE_GUIDES
    : FEATURE_GUIDES.filter((g) => g.category === selectedCategory);

  const activeGuide = FEATURE_GUIDES.find((g) => g.id === activeTabId) || FEATURE_GUIDES[0];

  return (
    <section id="how-to-use" className="py-24 border-t border-white/[0.08] bg-dark-900/40 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="pointer-events-none absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-brand-600/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/3 -right-32 h-96 w-96 rounded-full bg-cyan-600/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 relative">
        
        {/* Header with Title and English/Tamil Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-400 mb-3">
              <span>📖</span>
              <span>{lang === "en" ? "Comprehensive Platform Guide" : "முழுமையான தள வழிகாட்டி"}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {lang === "en" ? (
                <>How to Use <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Nexus AI</span></>
              ) : (
                <><span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Nexus AI</span> தளத்தை எவ்வாறு பயன்படுத்துவது?</>
              )}
            </h2>
            <p className="mt-2 text-sm md:text-base text-dark-300 max-w-2xl leading-relaxed">
              {lang === "en"
                ? "Step-by-step walkthrough of every core capability — from deploying multi-model agents and visual workflows to vector knowledge indexing and theme controls."
                : "ஒவ்வொரு முக்கிய அம்சத்தையும் எளிதாக பயன்படுத்த உதவும் படிப்படியான விளக்கம் — AI முகவர்கள், பணிப்பாய்வுகள், ஆவண அறிவுத்தளம் மற்றும் விருப்ப அமைப்புகள் வரை அனைத்தும்."}
            </p>
          </div>

          {/* DEDICATED LANGUAGE TOGGLE (English + Tamil) */}
          <div className="flex items-center gap-2 bg-dark-800/90 border border-white/10 p-1.5 rounded-2xl shadow-xl backdrop-blur-md self-start md:self-auto">
            <span className="text-xs text-dark-400 px-2 font-medium hidden sm:inline">
              {lang === "en" ? "Language:" : "மொழி:"}
            </span>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                lang === "en"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30 ring-1 ring-brand-400"
                  : "text-dark-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
            <button
              type="button"
              onClick={() => setLang("ta")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                lang === "ta"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30 ring-1 ring-brand-400"
                  : "text-dark-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>🇮🇳</span>
              <span>தமிழ் (Tamil)</span>
            </button>
          </div>
        </div>

        {/* ─── 4-Step Quick Launch Roadmap ─── */}
        <div className="mb-14 rounded-3xl border border-white/[0.08] bg-dark-800/40 p-6 md:p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm md:text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400 text-xs">🚀</span>
              {lang === "en" ? "Quick Start in 4 Simple Steps" : "4 எளிய படிகளில் விரைவுத் தொடக்கம்"}
            </h3>
            <span className="text-xs font-medium text-dark-400">
              {lang === "en" ? "Zero to Production in < 5 mins" : "5 நிமிடங்களுக்குள் தொடங்கலாம்"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: { en: "Create Account", ta: "கணக்கு தொடங்குதல்" },
                desc: {
                  en: "Sign in and customize your preferred theme (Light/Dark Mode).",
                  ta: "உள்நுழைந்து உங்களுக்குப் பிடித்த Light அல்லது Dark Mode-ஐ அமைக்கவும்.",
                },
                icon: "👤",
                color: "border-brand-500/30 bg-brand-500/10 text-brand-400",
              },
              {
                step: "02",
                title: { en: "Upload Knowledge", ta: "ஆவணங்களை ஏற்றுதல்" },
                desc: {
                  en: "Drop PDFs, documents, or code into Storage to build your RAG index.",
                  ta: "உங்கள் ஆவணங்களை பதிவேற்றி AI தேடலுக்கான அறிவுத்தளத்தை உருவாக்கவும்.",
                },
                icon: "📁",
                color: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
              },
              {
                step: "03",
                title: { en: "Chat with Agents", ta: "AI-யுடன் உரையாடுதல்" },
                desc: {
                  en: "Ask questions, write code, and synthesize data with GPT-4o & Claude.",
                  ta: "GPT-4o மற்றும் Claude மூலம் உங்கள் ஆவணங்களிலிருந்து பதில்களைப் பெறவும்.",
                },
                icon: "🤖",
                color: "border-purple-500/30 bg-purple-500/10 text-purple-400",
              },
              {
                step: "04",
                title: { en: "Automate Pipelines", ta: "பணிப்பாய்வை இயக்குதல்" },
                desc: {
                  en: "Connect triggers & webhooks in Workflow Canvas for autonomous tasks.",
                  ta: "Workflow Canvas மூலம் வணிகப் பணிகளை முழுமையாக தானியக்கமாக்கவும்.",
                },
                icon: "⚡",
                color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5 transition-all hover:border-brand-500/40 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-xl border text-sm font-bold ${item.color}`}>
                    {item.icon}
                  </span>
                  <span className="font-mono text-xs font-bold text-dark-500">STEP {item.step}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{item.title[lang]}</h4>
                <p className="text-xs text-dark-300 leading-relaxed">{item.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Interactive Feature Explorer ─── */}
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30 ring-1 ring-brand-400"
                    : "border border-white/10 bg-dark-800/60 text-dark-300 hover:bg-dark-700 hover:text-white"
                }`}
              >
                {cat.label[lang]}
              </button>
            ))}
          </div>

          {/* Master Two-Column Guide Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Feature Selector Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              {filteredGuides.map((guide) => {
                const isSelected = guide.id === activeTabId;
                return (
                  <button
                    key={guide.id}
                    type="button"
                    onClick={() => setActiveTabId(guide.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 relative ${
                      isSelected
                        ? "border-brand-500 bg-brand-500/10 ring-1 ring-brand-500/40 shadow-xl shadow-brand-600/10"
                        : "border-white/[0.06] bg-dark-800/40 hover:bg-dark-800/80 hover:border-white/15"
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dark-700/80 text-2xl border border-white/10 shadow-sm">
                      {guide.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded-full bg-brand-500/20 text-brand-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          {guide.badge[lang]}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate">{guide.title[lang]}</h4>
                      <p className="text-xs text-dark-300 line-clamp-2 mt-0.5 leading-relaxed">
                        {guide.subtitle[lang]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Deep-Dive Feature Explanation (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl border border-brand-500/20 bg-gradient-to-br from-dark-800/90 to-dark-900/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-2xl shadow-lg shadow-brand-600/30">
                    {activeGuide.icon}
                  </div>
                  <div>
                    <span className="rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {activeGuide.badge[lang]}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-white mt-1">
                      {activeGuide.title[lang]}
                    </h3>
                  </div>
                </div>

                <Link
                  href={activeGuide.targetRoute}
                  className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-brand-600/25 transition-all hover:scale-105 active:scale-95"
                >
                  <span>{activeGuide.actionText[lang]}</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Detailed Overview */}
              <div className="space-y-6">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">
                    {lang === "en" ? "How It Works" : "செயல்முறை விளக்கம்"}
                  </h5>
                  <p className="text-sm text-dark-200 leading-relaxed">
                    {activeGuide.overview[lang]}
                  </p>
                </div>

                {/* Step-by-Step Instructions */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-dark-400 mb-3">
                    {lang === "en" ? "Step-by-Step Instructions" : "படிப்படியான வழிகாட்டி"}
                  </h5>
                  <div className="space-y-2.5">
                    {activeGuide.steps[lang].map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-dark-900/50 p-3.5 transition-colors hover:border-white/10"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-brand-400 font-mono text-xs font-bold border border-brand-500/30">
                          {idx + 1}
                        </span>
                        <p className="text-xs md:text-sm text-dark-200 leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Tip Box */}
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-start gap-3 text-xs text-emerald-300">
                  <span className="text-base">💡</span>
                  <div>
                    <span className="font-bold uppercase tracking-wide mr-1.5">
                      {lang === "en" ? "Pro Tip:" : "சிறப்பு குறிப்பு:"}
                    </span>
                    <span>{activeGuide.proTip[lang]}</span>
                  </div>
                </div>

                {/* Mobile Direct Action Button */}
                <div className="pt-2 sm:hidden">
                  <Link
                    href={activeGuide.targetRoute}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-brand-600/25 transition-all"
                  >
                    <span>{activeGuide.actionText[lang]}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
