import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import type { RecoveryPath } from "@/lib/recovery-paths-data";
import type { CallJourneyId } from "@/lib/call-scripts";
import { CallDemo } from "./CallDemo";
import { RecoveryPathCard } from "./RecoveryPathCard";

const JOURNEY_BY_PATH: Record<RecoveryPath["id"], CallJourneyId> = {
  cod: "cod",
  abandoned: "abandoned",
  ndr: "ndr",
};

export function UseCasePageContent({ path }: { path: RecoveryPath }) {
  return (
    <>
      <section className="sec">
        <div className="wrap">
          <Reveal className="sec-head">
            <div className="eyebrow">{path.tag}</div>
            <h2>{path.headline}</h2>
            <p>{path.description}</p>
          </Reveal>
          <Reveal>
            <RecoveryPathCard path={path} />
          </Reveal>
          <Reveal>
            <div className="btns" style={{ marginTop: 24 }}>
              <Link className="btn btn-primary" href="/book-demo">
                Book a demo
              </Link>
              <Link className="btn btn-ghost" href="/how-it-works">
                See how it works →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <CallDemo defaultJourney={JOURNEY_BY_PATH[path.id]} />
    </>
  );
}
