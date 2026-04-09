import type { Metadata } from "next";

import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { siteName } from "@/lib/site-meta";

const title = "Terms of Service";

export const metadata: Metadata = {
  title,
  description: `Terms for using ${siteName} as offered by your deployment operator.`,
};

export default function TermsPage() {
  return (
    <>
      <Section className="pt-12 sm:pt-16">
        <PageHero
          kicker="Legal"
          title={title}
          description="Last updated April 9, 2026. Please read these terms before relying on the service in production."
        />
      </Section>

      <Section>
        <div className="max-w-3xl space-y-6 text-muted-foreground [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_strong]:text-foreground">
          <section className="space-y-3">
            <h2>Agreement</h2>
            <p>
              By creating an account or using {siteName}, you agree to these terms with
              the person or organization operating the deployment you access.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Service</h2>
            <p>
              The product is provided as is for note taking with optional Bible passage
              retrieval. Features may change as the software evolves. The operator may
              suspend access for maintenance, abuse, or legal reasons.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Acceptable use</h2>
            <p>
              Do not attempt to break authentication, read other users data, overload
              infrastructure, or use the service for unlawful content. Passage text
              inserted through YouVersion remains subject to YouVersion Platform
              requirements and the translation licenses you select in the picker.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Your content</h2>
            <p>
              You keep ownership of notes you write. You grant the operator a limited
              license to host and back up that content so the service can function.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Disclaimer</h2>
            <p>
              Study tools are not a substitute for pastoral care, medical advice, or
              professional counseling. The software does not guarantee accuracy of
              imported Scripture or third party APIs.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, the operator is not liable for
              indirect or consequential damages arising from use of the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2>Contact</h2>
            <p>
              Direct legal or billing questions to the administrator of the instance
              you use.
            </p>
          </section>
        </div>
      </Section>
    </>
  );
}
