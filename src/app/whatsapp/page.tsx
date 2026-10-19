import type { Metadata } from "next";
import { WhatsAppLanding } from "@/components/whatsapp/WhatsAppLanding";

const title = "WhatsApp for D2C Brands — 14 Days Free, then ₹999/month | Recover Agent";
const description = "Recover carts, confirm COD orders, send order updates and sell inside the chat. Shared inbox, flows, AI replies, payment links and WhatsApp Coexistence. Free for 14 days, then ₹999/month.";

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
