import { Archivo, Geist, Geist_Mono, JetBrains_Mono, Manrope } from "next/font/google";
import { MetaPixelHead } from "@/components/analytics/MetaPixel";
import { MetaPageView } from "@/components/analytics/MetaPageView";
import { faqStructuredData } from "@/lib/faq-data";
import { rootMetadata } from "@/lib/site-metadata";
import {
  organizationStructuredData,
  websiteStructuredData,
} from "@/lib/structured-data";
import "./globals.css";
import "./page-theme.css";

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

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrains.variable} ${manrope.variable} ${geistMono.variable} ${geist.variable}`}
    >
      <head>
        <MetaPixelHead />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData()),
          }}
        />
      </head>
      <body>
        <MetaPageView />
        {children}
      </body>
    </html>
  );
}
