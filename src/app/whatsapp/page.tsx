import type { Metadata } from "next";
import { WhatsAppLanding } from "@/components/whatsapp/WhatsAppLanding";

const title = "WhatsApp for D2C Brands — All Features at ₹999/month | Recover Agent";
const description = "Broadcast campaigns, recover abandoned checkouts, send order updates and manage customer conversations. All Recover Agent WhatsApp features for ₹999/month.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/whatsapp" },
  keywords: ["WhatsApp API for D2C", "WhatsApp marketing India", "WhatsApp Shopify", "WhatsApp WooCommerce", "WhatsApp abandoned cart recovery"],
  openGraph: { title, description, url: "/whatsapp", type: "website", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

export default function WhatsAppPage() {
  return <WhatsAppLanding />;
}
