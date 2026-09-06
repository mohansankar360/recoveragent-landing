import Link from "next/link";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileStickyCTA } from "./MobileStickyCTA";
import { getRelatedPages } from "@/lib/site-pages";

export function PageShell({
  slug,
  navLabel,
  children,
}: {
  slug: string;
  navLabel: string;
  children: React.ReactNode;
}) {
  const related = getRelatedPages(slug);

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
        <section className="sec sec-alt">
          <div className="wrap">
            <div className="sec-head">
              <div className="eyebrow">Explore Recover Agent</div>
              <h2>More on how we recover lost revenue.</h2>
            </div>
            <div className="recovery-grid">
              {related.map((page) => (
                <Link
                  key={page.slug}
                  href={`/${page.slug}`}
                  className="recovery-path-card"
                  style={{ display: "block", textDecoration: "none" }}
                >
                  <h3 style={{ marginBottom: 8 }}>{page.label}</h3>
                  <p style={{ margin: 0, opacity: 0.82 }}>{page.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCTA />
    </>
  );
}
