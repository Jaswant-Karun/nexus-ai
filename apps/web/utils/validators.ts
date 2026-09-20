/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Password strength: returns score 0–4 and an array of failed requirements.
 */
export function checkPassword(password: string): { score: number; issues: string[] } {
  const issues: string[] = [];
  if (password.length < 8)      issues.push("At least 8 characters");
  if (!/[A-Z]/.test(password))  issues.push("One uppercase letter");
  if (!/[a-z]/.test(password))  issues.push("One lowercase letter");
  if (!/\d/.test(password))     issues.push("One number");
  if (!/[^A-Za-z0-9]/.test(password)) issues.push("One special character");
  return { score: 5 - issues.length, issues };
}

/**
 * URL validation (http / https)
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Check that a string is a valid UUID v4
 */
export function isUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Required string validation
 */
export function isRequired(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined;
}

/**
 * Validate a file size against a max (in MB)
 */
export function isFileSizeValid(fileSizeBytes: number, maxMB: number): boolean {
  return fileSizeBytes <= maxMB * 1024 * 1024;
}

/**
 * Validate a file MIME type against an allowed list
 */
export function isFileTypeAllowed(mimeType: string, allowedTypes: readonly string[]): boolean {
  return (allowedTypes as string[]).includes(mimeType);
}

/**
 * Sanitise a string for safe display (escape < > & " ')
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
