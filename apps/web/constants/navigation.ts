export const APP_NAV = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "📊" },
  { id: "agents", label: "AI Agents", href: "/agents", icon: "🤖" },
  { id: "chat", label: "AI Chat", href: "/chat", icon: "💬" },
  { id: "problem-understanding", label: "Problem Understanding", href: "/problem-understanding", icon: "🧭" },
  { id: "workflows", label: "Workflows", href: "/workflows", icon: "⚡" },
  { id: "projects", label: "Projects", href: "/projects", icon: "📁" },
  { id: "workspace", label: "Knowledge Engine", href: "/workspace", icon: "🧠" },
  { id: "storage", label: "Storage", href: "/storage", icon: "☁️" },
  { id: "search", label: "Search", href: "/search", icon: "🔍" },
  { id: "knowledge-graph", label: "Knowledge Graph", href: "/knowledge-graph", icon: "🕸️" },
  { id: "memory", label: "AI Memory", href: "/memory", icon: "🧠" },
  { id: "analytics", label: "Analytics", href: "/analytics", icon: "📈" },
  { id: "reports", label: "Reports", href: "/reports", icon: "📋" },
  { id: "calendar", label: "Calendar", href: "/calendar", icon: "📅" },
  { id: "integrations", label: "Integrations", href: "/integrations", icon: "🔌" },
  { id: "organization", label: "Organization", href: "/organization", icon: "🏢" },
  { id: "developer", label: "Developer", href: "/developer", icon: "💻" },
  { id: "admin", label: "Admin Portal", href: "/admin", icon: "🛡️" },
  { id: "help", label: "Help Center", href: "/help", icon: "❓" },
  { id: "settings", label: "Platform Settings", href: "/settings", icon: "⚙️" },
] as const;

export const BOTTOM_NAV = [
  { id: "profile",    label: "My Profile",        href: "/profile",    icon: "👤" },
  { id: "settings",   label: "Settings",          href: "/settings",   icon: "⚙️" },
] as const;

export const MARKETING_NAV = [
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Docs",     href: "/docs"     },
  { label: "Pricing",  href: "/pricing"  },
] as const;
