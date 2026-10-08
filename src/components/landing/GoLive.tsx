import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
  {
    when: "Step 1",
    title: "Connect the relevant commerce tools",
    tags: "Shopify · Checkout · Shipping · WhatsApp",
    body: "Share your store, shipping tools and WhatsApp setup. Together we map the available connections and the events that should start recovery.",
  },
  {
    when: "Step 2",
    title: "Configure your AI recovery flows",
    body: "Share your brand policies, languages, dispatch cutoffs and retry rules. We configure the first recovery workflow and agree what needs your team’s approval.",
    note: "Your brand. Your rules. Your recovery strategy.",
  },
  {
    when: "Step 3",
    title: "Test, review, then expand",
    body: "Review sample calls, recorded outcomes and exception routing with us. Approve the customer experience before expanding coverage and monitor the results in your dashboard.",
    note: "Rollout timing depends on your store and workflow complexity.",
  },
];

export function GoLive({ compact = false }: { compact?: boolean }) {
  return (
    <section className="sec sec-alt" id="go-live">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">A practical implementation path</div>
          <h2>Connect, configure, review, then scale.</h2>
        </Reveal>
        <Reveal className={`steps${compact ? " steps-compact" : ""}`}>
          {STEPS.map((step) => (
            <div className="step" key={step.when}>
              <div className="when">{step.when}</div>
              <h3>{step.title}</h3>
              {"tags" in step && step.tags && (
                <p className="step-tags">{step.tags}</p>
              )}
              {!compact && <p>{step.body}</p>}
              {"note" in step && step.note && (
                <p className="step-note">{step.note}</p>
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
