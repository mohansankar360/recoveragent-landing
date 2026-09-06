import { Reveal } from "@/components/ui/Reveal";
import { RECOVERY_PATHS } from "@/lib/recovery-paths-data";
import { getUseCaseSlugForPath } from "@/lib/site-use-cases";
import { RecoveryPathCard } from "./RecoveryPathCard";

export function RecoveryPaths() {
  return (
    <section className="sec sec-alt" id="leaks">
      <div className="wrap">
        <Reveal className="sec-head recovery-paths-head">
          <div className="eyebrow">Problem → lost revenue → recover it</div>
          <h2>Three places you&apos;re losing money. One AI agent to recover it.</h2>
          <p>
            Recover the orders that slip through the cracks — from checkout to delivery.
          </p>
        </Reveal>

        <Reveal className="recovery-grid">
          {RECOVERY_PATHS.map((path) => (
            <RecoveryPathCard
              key={path.id}
              path={path}
              href={`/${getUseCaseSlugForPath(path.id)}`}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
