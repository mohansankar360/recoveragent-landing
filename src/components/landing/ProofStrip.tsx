import { Reveal } from "@/components/ui/Reveal";

const PROOF_TILES = [
  {
    stat: "70%",
    note: "checkout abandon",
    fix: "voice + WhatsApp in 30 min",
  },
  {
    stat: "₹525",
    note: "average cost per RTO",
    fix: "AI call before label prints",
  },
  {
    stat: "48hrs",
    note: "NDR window before return",
    fix: "same-day re-attempt call",
  },
];

export function ProofStrip() {
  return (
    <section className="sec" id="leaks">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">Three leaks, one gap</div>
          <h2>You paid to acquire the order. Then paid again to ship it back.</h2>
        </Reveal>

        <Reveal className="proof-strip">
          {PROOF_TILES.map((tile) => (
            <div className="proof-tile" key={tile.stat}>
              <div className="proof-stat">{tile.stat}</div>
              <div className="proof-note">{tile.note}</div>
              <div className="proof-fix">
                Fixed by: <b>{tile.fix}</b>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
