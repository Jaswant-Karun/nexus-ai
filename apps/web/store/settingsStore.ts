/**
 * Settings store — persisted to localStorage via a simple hook.
 */

export interface PlatformSettings {
  // General
  orgName:  string;
  timezone: string;
  language: string;

  // AI Models
  defaultModel:   string;
  fallbackModel:  string;
  temperature:    number;
  maxTokens:      number;

  // Security
  mfaEnabled:     boolean;
  auditLogging:   boolean;
  piiRedaction:   boolean;

  // Appearance
  theme:          "dark" | "light" | "system";
  sidebarMode:    "expanded" | "collapsed" | "auto";
}

export const DEFAULT_SETTINGS: PlatformSettings = {
  orgName:       "Nexus Enterprise",
  timezone:      "UTC+0",
  language:      "English (US)",
  defaultModel:  "gpt-4o",
  fallbackModel: "claude-3-5-sonnet",
  temperature:   0.7,
  maxTokens:     4096,
  mfaEnabled:    true,
  auditLogging:  true,
  piiRedaction:  false,
  theme:         "dark",
  sidebarMode:   "expanded",
};

const STORAGE_KEY = "nexus_platform_settings";

export function loadSettings(): PlatformSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<PlatformSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<PlatformSettings>): PlatformSettings {
  const current = loadSettings();
  const next = { ...current, ...settings };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function resetSettings(): PlatformSettings {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return DEFAULT_SETTINGS;
}
