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
      <main className="themed-page">
        <div className="wrap page-breadcrumb">
          <nav aria-label="Breadcrumb">
            {crumbs.map((crumb, index) => (
              <span key={crumb.label}>
                {index > 0 && <span aria-hidden="true"> / </span>}
                {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
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
