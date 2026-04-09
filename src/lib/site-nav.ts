export const featureNavLinks = [
  {
    href: "/features/scripture-in-notes",
    label: "Scripture in notes",
    description: "Insert passages with stable reference metadata.",
  },
  {
    href: "/features/rich-text-editor",
    label: "Rich text editor",
    description: "Headings, lists, highlights, links, and more.",
  },
  {
    href: "/features/notes-and-accounts",
    label: "Notes and accounts",
    description: "Sign in, autosave, and manage your notes.",
  },
] as const;

export const footerNavColumns = [
  {
    title: "Product",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/blog", label: "Blog" },
      ...featureNavLinks.map(({ href, label }) => ({ href, label })),
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
] as const;
