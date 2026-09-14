import { NewLandingPage } from "@/components/landing/new/NewLandingPage";
import { DEFAULT_DESCRIPTION, OG_IMAGE, SITE_NAME } from "@/lib/site-metadata";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Stop losing orders to RTO, carts & NDR`,
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: `${siteUrl}/new`,
  },
  openGraph: {
    title: `${SITE_NAME} — Ship fewer orders back. Bank more of what you sell.`,
    description: DEFAULT_DESCRIPTION,
    url: `${siteUrl}/new`,
    siteName: SITE_NAME,
    images: [OG_IMAGE],
  },
};

export default function NewPage() {
  return <NewLandingPage />;
}
