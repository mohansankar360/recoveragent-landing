import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import { BlogShell } from "@/components/blog/BlogShell";
import { blogPostingStructuredData } from "@/lib/blog-structured-data";
import {
  formatBlogDate,
  getAllBlogSlugs,
  getBlogPost,
} from "@/lib/blog";
import { OG_IMAGE, SITE_NAME } from "@/lib/site-metadata";
import { siteUrl } from "@/lib/site-url";
import styles from "@/components/landing/TrialHomepage.module.css";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    title: `${post.title} | ${SITE_NAME} Blog`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      siteName: SITE_NAME,
      publishedTime: post.publishedAt,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const structuredData = blogPostingStructuredData(post);

  return (
    <BlogShell
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/blog", label: "Guides" },
        { label: post.title },
      ]}
      eyebrow={formatBlogDate(post.publishedAt)}
      title={post.title}
      description={post.description}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className={styles.blogArticle}>
        <BlogMarkdown content={post.content} />
        <footer className={styles.blogArticleCta}>
          <p>Want to see this on your own orders?</p>
          <div>
            <Link className={styles.trialButton} href="/book-demo">
              Start 14-day free trial →
            </Link>
            <Link className={styles.outlineButton} href="/loss-calculator">
              Check your RTO cost
            </Link>
          </div>
        </footer>
      </article>
    </BlogShell>
  );
}
