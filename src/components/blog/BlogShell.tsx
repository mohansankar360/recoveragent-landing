import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { MobileStickyCTA } from "@/components/landing/MobileStickyCTA";

export function BlogShell({
  crumbs,
  children,
}: {
  crumbs: { href?: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>
        <div className="wrap" style={{ paddingTop: "1.25rem", paddingBottom: "0.5rem" }}>
          <nav aria-label="Breadcrumb" className="mono" style={{ fontSize: 12, opacity: 0.72 }}>
            {crumbs.map((crumb, index) => (
              <span key={crumb.label}>
                {index > 0 && <span aria-hidden="true"> / </span>}
                {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
              </span>
            ))}
          </nav>
        </div>
        {children}
      </main>
      <Footer />
      <MobileStickyCTA />
    </>
  );
}
