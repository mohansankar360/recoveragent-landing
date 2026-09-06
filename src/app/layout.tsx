import { Archivo, JetBrains_Mono } from "next/font/google";
import { MetaPixelHead } from "@/components/analytics/MetaPixel";
import { MetaPageView } from "@/components/analytics/MetaPageView";
import { faqStructuredData } from "@/lib/faq-data";
import { rootMetadata } from "@/lib/site-metadata";
import {
  organizationStructuredData,
  websiteStructuredData,
} from "@/lib/structured-data";
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

export const metadata = rootMetadata;

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
