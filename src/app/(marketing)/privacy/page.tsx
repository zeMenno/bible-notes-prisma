import type { Metadata } from "next";

import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { siteName } from "@/lib/site-meta";

const title = "Privacy Policy";

export const metadata: Metadata = {
  title,
  description: `How ${siteName} handles account data, notes, cookies, and third party services.`,
};

export default function PrivacyPage() {
  return (
    <>
      <Section className="border-b border-border/50 pt-12 sm:pt-16">
        <PageHero
          kicker="Legal"
          title={title}
          description="Last updated April 9, 2026. This is a plain language summary of what the current codebase collects and why."
        />
      </Section>

      <Section bordered>
        <div className="max-w-3xl space-y-6 text-muted-foreground [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_strong]:text-foreground">
          <section className="space-y-3">
            <h2>Who we are</h2>
            <p>
              {siteName} is a web application that stores your study notes in a
              Postgres database you configure for your deployment (for example through
              Supabase). The operator of each deployment is responsible for answering
              privacy questions for that instance. This document describes the data the
              software is designed to process.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Account information</h2>
            <p>
              When you register we store your email address, a salted password hash,
              and related NextAuth adapter rows needed for credentials sign in. We do
              not store your password in plain text.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Notes content</h2>
            <p>
              Each note stores a title and JSON document from the Tiptap editor. That
              JSON can include passage text you inserted, your own writing, formatting,
              and metadata such as Bible references attached to passage blocks.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Cookies and sessions</h2>
            <p>
              NextAuth sets secure cookies so your session can persist. Supabase client
              middleware in this repo may refresh related cookies when configured.
              Decline cookies by not signing in, understanding that authentication will
              not work without them.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Third parties</h2>
            <p>
              The Bible insert experience calls YouVersion Platform APIs from the
              browser when you use that feature, subject to YouVersion terms and your
              app key configuration. We do not send your full note contents to
              YouVersion as part of routine saving; inserts happen when you trigger
              the picker.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Your choices</h2>
            <p>
              Delete notes you no longer want from the notes list. For account deletion
              or data export, the deployment operator must provide a process if one is
              not yet exposed in the product UI.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Contact</h2>
            <p>
              For privacy requests for a specific deployment, contact the administrator
              who gave you access to that environment.
            </p>
          </section>
        </div>
      </Section>
    </>
  );
}
