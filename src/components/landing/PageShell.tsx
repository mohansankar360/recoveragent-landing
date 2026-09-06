import Link from "next/link";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileStickyCTA } from "./MobileStickyCTA";

export function PageShell({
  navLabel,
  children,
}: {
  navLabel: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>
        <div className="wrap" style={{ paddingTop: "1.25rem", paddingBottom: "0.5rem" }}>
          <nav aria-label="Breadcrumb" className="mono" style={{ fontSize: 12, opacity: 0.72 }}>
            <Link href="/">Home</Link>
            <span aria-hidden="true"> / </span>
            <span>{navLabel}</span>
          </nav>
        </div>
        {children}
      </main>
      <Footer />
      <MobileStickyCTA />
    </>
  );
}
