export const APP_NAV = [
  { id: "dashboard",  label: "Dashboard",        href: "/dashboard",  icon: "📊" },
  { id: "chat",       label: "AI Agent Studio",   href: "/chat",       icon: "🤖" },
  { id: "workflow",   label: "Workflow Builder",  href: "/workflow",   icon: "⚡" },
  { id: "workspace",  label: "Knowledge Engine",  href: "/workspace",  icon: "🧠" },
  { id: "storage",    label: "Storage",           href: "/storage",    icon: "☁️" },
  { id: "analytics",  label: "Analytics",         href: "/analytics",  icon: "📈" },
  { id: "reports",    label: "Reports",           href: "/reports",    icon: "📋" },
  { id: "billing",    label: "Billing",           href: "/billing",    icon: "💳" },
  { id: "settings",   label: "Platform Settings", href: "/settings",   icon: "⚙️" },
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
