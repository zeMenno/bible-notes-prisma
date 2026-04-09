/**
 * NextAuth-style callback URLs must stay same-origin (relative path only).
 */
export function safeAuthCallbackUrl(
  raw: string | string[] | undefined,
  fallback: string,
): string {
  if (Array.isArray(raw)) raw = raw[0];
  if (typeof raw !== "string" || raw.length === 0) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;
  return raw;
}
