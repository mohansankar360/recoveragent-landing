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
        { href: "/blog", label: "Blog" },
        { label: post.title },
      ]}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className="sec">
        <div className="wrap blog-article-wrap">
          <header className="blog-article-head">
            <time className="blog-card-date mono" dateTime={post.publishedAt}>
              {formatBlogDate(post.publishedAt)}
            </time>
            <h1>{post.title}</h1>
            <p className="blog-article-deck">{post.description}</p>
          </header>

          <BlogMarkdown content={post.content} />

          <footer className="blog-article-footer">
            <p>Ready to see this on your store?</p>
            <div className="btns">
              <Link className="btn btn-primary" href="/book-demo">
                Book a demo
              </Link>
              <Link className="btn btn-ghost" href="/loss-calculator">
                Run the loss calculator →
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </BlogShell>
  );
}
