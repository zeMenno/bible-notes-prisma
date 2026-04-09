import Link from "next/link";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { AnchorHTMLAttributes } from "react";

import { MdxProse } from "@/components/site/mdx-prose";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { siteName } from "@/lib/site-meta";

function MdxLink({
  href,
  children,
  className,
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href?.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Not found" };
  }
  const { title, description, date } = post.meta;
  return {
    title,
    description,
    openGraph: {
      title: `${title} · ${siteName}`,
      description,
      type: "article",
      publishedTime: date,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.body,
    components: {
      a: MdxLink,
    },
  });

  const formattedDate = new Date(post.meta.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Section className="border-b border-border/50 pt-12 sm:pt-16">
        <PageHero
          kicker={formattedDate}
          title={post.meta.title}
          description={post.meta.description}
        />
      </Section>
      <Section>
        <article className="max-w-3xl">
          <MdxProse>{content}</MdxProse>
        </article>
      </Section>
    </>
  );
}
