import Link from "next/link";
import type { Metadata } from "next";

import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { getAllPosts } from "@/lib/blog";
import { siteDescription, siteName } from "@/lib/site-meta";

const title = "Blog";

export const metadata: Metadata = {
  title,
  description: `Practical articles for using ${siteName}. ${siteDescription}`,
  openGraph: {
    title: `${title} · ${siteName}`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · ${siteName}`,
    description: siteDescription,
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <Section className="pt-12 sm:pt-16">
        <PageHero
          kicker="Blog"
          title="Write with Scripture in view"
          description="Short guides tied to real features: accounts, the editor, passage inserts, and how autosave behaves."
        />
      </Section>
      <Section>
        <ul className="space-y-12">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-border/40 pb-12 last:border-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-2 inline-block font-heading text-xl font-semibold tracking-tight text-foreground transition-colors hover:text-primary sm:text-2xl"
              >
                {post.title}
              </Link>
              <p className="mt-3 max-w-2xl text-muted-foreground">{post.description}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
              >
                Read article
                <span aria-hidden className="ml-1">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
