import { Reveal } from "@/components/ui/Reveal";

const LEAKS = [
  {
    stage: "Stage 01 · Checkout",
    title: "The cart nobody chased",
    body: "They picked the size, entered the pincode, and got distracted. An email lands in Promotions three hours later. Nobody calls.",
    stat: "70%",
    statNote:
      "of Indian shoppers abandon at checkout. Roughly 1 in 4 will finish if you reach them inside 30 minutes.",
    fix: "voice + WhatsApp nudge inside 30 min",
  },
  {
    stage: "Stage 02 · Before dispatch",
    title: "The COD nobody verified",
    body: "Wrong number, prank order, someone who forgot they ordered. You find out eleven days later when the parcel comes home.",
    stat: "₹525",
    statNote:
      "average cost of one RTO — forward freight, reverse freight, packaging and the ad spend that bought the order.",
    fix: "AI call before the label prints",
  },
  {
    stage: "Stage 03 · Last mile",
    title: "The NDR nobody re-attempted",
    body: '"Customer not available." Three strikes and the courier sends it back. Your ops person sees the NDR sheet on Monday.',
    stat: "48hrs",
    statNote:
      "is all you get. After the third failed attempt the order is gone and reverse logistics starts billing you.",
    fix: "same-day reschedule call",
  },
];

export function ThreeLeaks({ compressed = false }: { compressed?: boolean }) {
  return (
    <section className="sec" id="leaks">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">One order, three places it dies</div>
          <h2>You paid to acquire the order. Then paid again to ship it back.</h2>
          {!compressed && (
            <p>
              None of these look like an emergency on their own. Together they&apos;re
              25–35% of everything you dispatch — and every rupee of it is margin you
              already spent to earn.
            </p>
          )}
        </Reveal>

        <Reveal className="journey">
          {LEAKS.map((leak) => (
            <div className="leak" key={leak.stage}>
              <div className="leak-stage">{leak.stage}</div>
              <h3>{leak.title}</h3>
              {!compressed && <p>{leak.body}</p>}
              <div className="leak-num">
                {leak.stat}
                <small>{compressed ? leak.fix : leak.statNote}</small>
              </div>
              <div className="leak-fix">
                Fixed by: <b>{leak.fix}</b>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
