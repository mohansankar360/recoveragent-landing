import type { Metadata } from "next";
import Link from "next/link";
import { BlogShell } from "@/components/blog/BlogShell";
import { OG_IMAGE, SITE_NAME } from "@/lib/site-metadata";
import { formatBlogDate, getAllBlogPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: `Blog — ${SITE_NAME}`,
  description:
    "Guides on RTO reduction, COD verification, NDR recovery, and ecommerce automation for Indian D2C brands on Shopify and WooCommerce.",
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: `Blog — ${SITE_NAME}`,
    description:
      "Guides on RTO reduction, COD verification, and delivery recovery for Indian D2C ecommerce.",
    url: `${siteUrl}/blog`,
    type: "website",
    siteName: SITE_NAME,
    images: [OG_IMAGE],
  },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <BlogShell crumbs={[{ href: "/", label: "Home" }, { label: "Blog" }]}>
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <div className="eyebrow">Resources</div>
            <h1>RTO, COD &amp; recovery guides</h1>
            <p>
              Practical notes for Indian D2C operators on Shopify and WooCommerce — from
              pre-dispatch COD confirmation to NDR follow-up.
            </p>
          </div>

          <div className="blog-index">
            {posts.map((post) => (
              <article key={post.slug} className="blog-card">
                <time className="blog-card-date mono" dateTime={post.publishedAt}>
                  {formatBlogDate(post.publishedAt)}
                </time>
                <h2 className="blog-card-title">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="blog-card-desc">{post.description}</p>
                <Link href={`/blog/${post.slug}`} className="blog-card-link">
                  Read guide →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </BlogShell>
  );
}
