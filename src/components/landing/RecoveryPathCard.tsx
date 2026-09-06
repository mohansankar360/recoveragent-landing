import Link from "next/link";
import type { RecoveryPath } from "@/lib/recovery-paths-data";

export function RecoveryPathCard({
  path,
  href,
  className = "",
}: {
  path: RecoveryPath;
  href?: string;
  className?: string;
}) {
  const content = (
    <>
      <div className="recovery-path-meta">
        <span className="recovery-path-tag">{path.tag}</span>
        <span className="recovery-path-loss">{path.loss}</span>
      </div>
      <h3 className="recovery-path-headline">{path.headline}</h3>
      <p className="recovery-path-desc">{path.description}</p>
      <div className="recovery-path-recover">
        Recover with AI → <b>{path.recover}</b>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`recovery-path-card ${className}`.trim()}>
        {content}
      </Link>
    );
  }

  return (
    <article className={`recovery-path-card ${className}`.trim()}>{content}</article>
  );
}
