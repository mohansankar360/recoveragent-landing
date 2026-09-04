import { Reveal } from "@/components/ui/Reveal";

const VERSUS = [
  {
    dim: true,
    label: "Email reminder",
    stat: "~10%",
    body: "Often buried in inboxes or promotions. Customers may see it much later—or never. It rarely creates the urgency needed to confirm an order or resolve a delivery issue.",
  },
  {
    dim: true,
    label: "WhatsApp",
    stat: "40–50%",
    body: "Much better reach and engagement, but customers can still ignore the message, postpone the action, or forget to respond.",
  },
  {
    dim: false,
    label: "Voice Call + WhatsApp",
    stat: "70–80%",
    body: "A call creates a real-time interaction. The customer can confirm, clarify, reschedule, or take action immediately. WhatsApp then delivers the link, details, or follow-up.",
  },
];

export function CallVersus() {
  return (
    <section className="sec sec-alt" id="call-versus">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">Why calling, and not another WhatsApp?</div>
          <h2 className="vs-headline">
            Because messages can be ignored. Calls demand a response.
          </h2>
        </Reveal>
        <Reveal className="vs">
          {VERSUS.map((card) => (
            <div key={card.label} className={`vscard${card.dim ? " dim" : " win"}`}>
              <div className="h">{card.label}</div>
              <div className="big">{card.stat}</div>
              <p>{card.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
