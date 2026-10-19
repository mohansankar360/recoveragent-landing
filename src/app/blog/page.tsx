import type { Metadata } from "next";
import Link from "next/link";
import { BlogShell } from "@/components/blog/BlogShell";
import { OG_IMAGE, SITE_NAME } from "@/lib/site-metadata";
import { formatBlogDate, getAllBlogPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/site-url";
import styles from "@/components/landing/TrialHomepage.module.css";

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
    <BlogShell
      crumbs={[{ href: "/", label: "Home" }, { label: "Guides" }]}
      eyebrow="Guides"
      title="RTO, COD and recovery guides"
      description="Practical notes for Indian D2C founders and ops teams on Shopify and WooCommerce, from COD confirmation before dispatch to failed delivery follow-up."
    >
      <section className={styles.blogSection}>
        <div className={styles.blogGrid}>
          {posts.map((post) => (
            <article key={post.slug} className={styles.blogCard}>
              <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.description}</p>
              <Link href={`/blog/${post.slug}`} className={styles.leakLink}>
                Read guide →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </BlogShell>
  );
}
