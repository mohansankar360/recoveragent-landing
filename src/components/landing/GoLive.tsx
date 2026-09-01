import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
  {
    when: "Day 1",
    title: "Connect your entire commerce stack",
    tags: "Shopify · Checkout · Shipping · WhatsApp",
    body: "We connect the tools you already use so RecoverAgent can trigger the right recovery action at the right stage of the customer journey.",
  },
  {
    when: "Day 2",
    title: "Configure your AI recovery flows",
    body: "We set up your COD confirmation, abandoned checkout and NDR flows around your brand, tone and business rules.",
    note: "Your brand. Your rules. Your recovery strategy.",
  },
  {
    when: "Day 3",
    title: "Go live & recover",
    body: "Your AI agents start engaging eligible customers, while RecoverAgent tracks calls, confirmations, recoveries and revenue from one dashboard.",
    note: "From signup to live recovery in 3 days.",
  },
];

export function GoLive({ compact = false }: { compact?: boolean }) {
  return (
    <section className="sec">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">No integration project. No IT ticket.</div>
          <h2>From signup to live recovery in 3 days.</h2>
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
