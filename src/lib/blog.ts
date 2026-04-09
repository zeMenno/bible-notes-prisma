import fs from "fs";
import path from "path";

import matter from "gray-matter";

const blogDir = path.join(process.cwd(), "content", "blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

function parseMeta(
  slug: string,
  data: Record<string, unknown>,
): BlogPostMeta | null {
  const title = data.title;
  const description = data.description;
  const date = data.date;
  if (typeof title !== "string" || typeof description !== "string") {
    return null;
  }
  if (typeof date !== "string" && !(date instanceof Date)) {
    return null;
  }
  const dateStr = date instanceof Date ? date.toISOString().slice(0, 10) : date;
  return { slug, title, description, date: dateStr };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(blogDir)) {
    return [];
  }
  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/u, ""));
}

export function getPostBySlug(slug: string): {
  meta: BlogPostMeta;
  body: string;
} | null {
  const full = path.join(blogDir, `${slug}.mdx`);
  if (!fs.existsSync(full)) {
    return null;
  }
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);
  const meta = parseMeta(slug, data as Record<string, unknown>);
  if (!meta) {
    return null;
  }
  return { meta, body: content };
}

export function getAllPosts(): BlogPostMeta[] {
  return getAllSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => p != null)
    .map((p) => p.meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
