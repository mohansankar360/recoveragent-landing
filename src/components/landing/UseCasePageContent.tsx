import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import type { RecoveryPath } from "@/lib/recovery-paths-data";
import type { CallJourneyId } from "@/lib/call-scripts";
import { CallDemo } from "./CallDemo";

const JOURNEY_BY_PATH: Record<RecoveryPath["id"], CallJourneyId> = {
  cod: "cod",
  abandoned: "abandoned",
  ndr: "ndr",
};

const DETAILS = {
  cod: { trigger: 'COD order placed', action: 'Confirm purchase intent and address before dispatch.', outcome: 'Send confirmed orders to fulfilment review; flag cancellations and exceptions.', requirement: 'Connect your store and agree dispatch cutoffs, retry rules and hold decisions.' },
  abandoned: { trigger: 'Contactable checkout abandoned', action: 'Answer questions, then send the checkout link on WhatsApp.', outcome: 'Track completed orders and stop duplicate follow-up.', requirement: 'Use checkouts with contact details and configure the delay, offers and completion tracking.' },
  ndr: { trigger: 'Failed delivery reported', action: 'Ask the buyer about availability, address issues or a reattempt.', outcome: 'Record the requested next step for your team or connected courier workflow.', requirement: 'Available actions depend on your shipping integration and the courier’s reattempt window.' },
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
            <div className="use-case-outcomes"><article><small>Trigger</small><h3>{DETAILS[path.id].trigger}</h3></article><article><small>Conversation</small><h3>{DETAILS[path.id].action}</h3></article><article><small>Operational outcome</small><h3>{DETAILS[path.id].outcome}</h3></article></div><p className="use-case-requirement">{DETAILS[path.id].requirement}</p>
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
