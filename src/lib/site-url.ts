/** Canonical site origin for sitemaps, robots, and absolute metadata URLs. */
export function getSiteUrl(): string {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}
