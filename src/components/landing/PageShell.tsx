import Link from "next/link";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileStickyCTA } from "./MobileStickyCTA";

export function PageShell({
  navLabel,
  title,
  children,
}: {
  navLabel: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="themed-page">
        <div className="wrap page-breadcrumb">
          <nav aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{navLabel}</span>
          </nav>
          <h1 className="sr-only">{title ?? navLabel}</h1>
        </div>
        {children}
      </main>
      <Footer />
      <MobileStickyCTA />
    </>
  );
}
