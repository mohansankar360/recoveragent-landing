import type { RecoveryPath } from "@/lib/recovery-paths-data";

export function RecoveryPathCard({
  path,
  className = "",
}: {
  path: RecoveryPath;
  className?: string;
}) {
  return (
    <article className={`recovery-path-card ${className}`.trim()}>
      <div className="recovery-path-meta">
        <span className="recovery-path-tag">{path.tag}</span>
        <span className="recovery-path-loss">{path.loss}</span>
      </div>
      <h3 className="recovery-path-headline">{path.headline}</h3>
      <p className="recovery-path-desc">{path.description}</p>
      <div className="recovery-path-recover">
        Recover with AI → <b>{path.recover}</b>
      </div>
    </article>
  );
}
