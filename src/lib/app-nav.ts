export type AppNavItem = {
  href: string;
  label: string;
  /** Override default active logic (exact path match). */
  isActive?: (pathname: string) => boolean;
  showBetaBadge?: boolean;
};

export const appNavItems: AppNavItem[] = [
  {
    href: "/notes",
    label: "Notes",
    isActive: (p) =>
      p === "/notes" ||
      (p.startsWith("/notes/") && !p.startsWith("/notes/graph")),
  },
  { href: "/dashboard", label: "Dashboard" },
  {
    href: "/notes/graph",
    label: "Note graph",
    showBetaBadge: true,
  },
];

export function isAppNavActive(pathname: string, item: AppNavItem): boolean {
  if (item.isActive) {
    return item.isActive(pathname);
  }
  return pathname === item.href;
}
