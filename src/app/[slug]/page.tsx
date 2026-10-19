import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/landing/PageShell";
import {
  CallShowcase,
  CaseStudySection,
  FaqSection,
  IntegrationStrip,
  LossSection,
  PricingSection,
  ProblemSection,
  SafetySection,
  ShipOrHoldGame,
  StorySection,
  TrialSection,
  WhatsAppSection,
} from "@/components/landing/TrialHomepage";
import { LeakCards, UseCaseContent } from "@/components/landing/TrialSubPages";
import { getAllPublicSlugs, resolvePublicPage } from "@/lib/site-pages";
import type { SiteSectionSlug } from "@/lib/site-sections";
import { getRecoveryPathForUseCase } from "@/lib/site-use-cases";
import { OG_IMAGE, SITE_NAME } from "@/lib/site-metadata";
import { siteUrl } from "@/lib/site-url";

function SectionContent({ slug }: { slug: SiteSectionSlug }) {
  switch (slug) {
    case "where-you-leak":
      return <><LeakCards /><ProblemSection /><ShipOrHoldGame /></>;
    case "loss-calculator":
      return <><LossSection /><CaseStudySection /></>;
    case "control-room":
      return <><CaseStudySection /><WhatsAppSection /><SafetySection /></>;
    case "hear-a-call":
      return <><CallShowcase /><StorySection /></>;
    case "why-calling":
      return <><StorySection /><WhatsAppSection /></>;
    case "plans":
      return <><PricingSection /><TrialSection /><FaqSection /></>;
    case "go-live":
      return <><TrialSection /><IntegrationStrip /><SafetySection /></>;
    case "how-it-works":
      return <><StorySection /><CallShowcase /><SafetySection /></>;
    case "faq":
      return <FaqSection />;
    case "book-demo":
      return <TrialSection />;
  }
}

export function generateStaticParams() {
  return getAllPublicSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolvePublicPage(slug);
  if (!resolved) return {};

  const { page } = resolved;
  const url = `${siteUrl}/${page.slug}`;

  return {
    title: `${page.title} | Recover Agent`,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      type: "website",
      siteName: SITE_NAME,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resolved = resolvePublicPage(slug);
  if (!resolved) notFound();

  const { page } = resolved;

  return (
    <PageShell
      navLabel={page.navLabel}
      title={page.title}
      description={page.description}
      showCtas={page.slug !== "book-demo"}
      finalFirst={page.slug === "book-demo"}
    >
      {resolved.type === "use-case" ? (
        <UseCaseContent path={getRecoveryPathForUseCase(resolved.page)} />
      ) : (
        <SectionContent slug={resolved.page.slug} />
      )}
    </PageShell>
  );
}
