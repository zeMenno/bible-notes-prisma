import type { MetadataRoute } from "next";

import { getAllPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-url";

const staticPaths: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number }[] =
  [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
    { path: "/features/scripture-in-notes", changeFrequency: "monthly", priority: 0.85 },
    { path: "/features/rich-text-editor", changeFrequency: "monthly", priority: 0.85 },
    { path: "/features/notes-and-accounts", changeFrequency: "monthly", priority: 0.85 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.85 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.4 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.4 },
    { path: "/login", changeFrequency: "yearly", priority: 0.3 },
    { path: "/register", changeFrequency: "yearly", priority: 0.5 },
    { path: "/simple", changeFrequency: "monthly", priority: 0.35 },
  ];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl().replace(/\/$/u, "");
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map(
    ({ path, changeFrequency, priority }) => ({
      url: path === "/" ? `${base}/` : `${base}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  const posts = getAllPosts();
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
