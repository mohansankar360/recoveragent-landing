import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CallDemo } from "@/components/landing/CallDemo";
import { CallVersus } from "@/components/landing/CallVersus";
import { ControlRoomDemo } from "@/components/landing/ControlRoomDemo";
import { DemoBooking } from "@/components/landing/DemoBooking";
import { FAQ } from "@/components/landing/FAQ";
import { GoLive } from "@/components/landing/GoLive";
import { LossCalculator } from "@/components/landing/LossCalculator";
import { PageShell } from "@/components/landing/PageShell";
import { PlansSection } from "@/components/landing/PlansSection";
import { RecoveryJourney } from "@/components/landing/RecoveryJourney";
import { RecoveryPaths } from "@/components/landing/RecoveryPaths";
import { UseCasePageContent } from "@/components/landing/UseCasePageContent";
import { getAllPublicSlugs, resolvePublicPage } from "@/lib/site-pages";
import type { SiteSectionSlug } from "@/lib/site-sections";
import { getRecoveryPathForUseCase } from "@/lib/site-use-cases";
import { OG_IMAGE, SITE_NAME } from "@/lib/site-metadata";
import { siteUrl } from "@/lib/site-url";

function SectionContent({ slug }: { slug: SiteSectionSlug }) {
  switch (slug) {
    case "where-you-leak":
      return <RecoveryPaths />;
    case "loss-calculator":
      return <LossCalculator />;
    case "control-room":
      return <ControlRoomDemo />;
    case "hear-a-call":
      return <CallDemo />;
    case "why-calling":
      return <CallVersus />;
    case "plans":
      return <PlansSection />;
    case "go-live":
      return <GoLive />;
    case "how-it-works":
      return <RecoveryJourney />;
    case "faq":
      return <FAQ />;
    case "book-demo":
      return <DemoBooking />;
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
    <PageShell navLabel={page.navLabel}>
      {resolved.type === "use-case" ? (
        <UseCasePageContent path={getRecoveryPathForUseCase(resolved.page)} />
      ) : (
        <SectionContent slug={resolved.page.slug} />
      )}
    </PageShell>
  );
}
