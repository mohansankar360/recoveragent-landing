import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { MetaPixelHead } from "@/components/analytics/MetaPixel";
import { MetaPageView } from "@/components/analytics/MetaPageView";
import { faqStructuredData } from "@/lib/faq-data";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Recover Agent — Ship fewer orders back. Bank more of what you sell.",
  description:
    "AI voice + WhatsApp agent for Indian D2C brands on Shopify. Verify COD before dispatch, re-attempt NDR, recover abandoned checkouts — in your customer's own language.",
  keywords: [
    "RTO reduction",
    "COD verification",
    "COD confirmation",
    "reduce RTO ecommerce",
    "D2C RTO",
    "NDR management",
    "AI voice agent ecommerce",
    "COD to prepaid",
    "Shopify COD India",
  ],
  openGraph: {
    title: "Recover Agent — Ship fewer orders back. Bank more of what you sell.",
    description:
      "AI voice + WhatsApp agent for Indian D2C brands. Verify COD, re-attempt NDR, recover abandoned checkouts.",
    type: "website",
    siteName: "Recover Agent",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recover Agent — Ship fewer orders back.",
    description:
      "AI voice + WhatsApp recovery for Indian D2C brands on Shopify.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrains.variable}`}
    >
      <head>
        <MetaPixelHead />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData()) }}
        />
      </head>
      <body>
        <MetaPageView />
        {children}
      </body>
    </html>
  );
}
