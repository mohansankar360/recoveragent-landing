import { Reveal } from "@/components/ui/Reveal";

const ROWS = [
  {
    feature: "COD confirmation before dispatch",
    manual: "Team calls manually · misses evening orders",
    generic: "IVR menu · customers hang up",
    recover: "AI voice call in customer's language · 70–80% reach",
    win: true,
  },
  {
    feature: "Abandoned checkout follow-up",
    manual: "Email or WhatsApp · often ignored",
    generic: "Single template blast · no personalization",
    recover: "Voice within 30 min · WhatsApp with payment link after",
    win: true,
  },
  {
    feature: "NDR re-attempt",
    manual: "Ops checks dashboard once a day",
    generic: "Not supported",
    recover: "Same-day call · address fix · re-dispatch trigger",
    win: true,
  },
  {
    feature: "Cost at 700 orders/month",
    manual: "₹40,000+ (2–3 callers + manager)",
    generic: "₹8,000–15,000 (limited channels)",
    recover: "From ₹4,999/mo · 700 calls included",
    win: true,
  },
  {
    feature: "Time to go live",
    manual: "Hire, train, SOPs — weeks",
    generic: "1–2 weeks setup",
    recover: "3 days · Shopify connect · flows configured",
    win: true,
  },
  {
    feature: "Languages covered",
    manual: "Whatever your team speaks",
    generic: "Usually English + Hindi only",
    recover: "6 Indian languages · consistent brand tone",
    win: true,
  },
];

export function ManualVsRecover() {
  return (
    <section className="sec sec-alt" id="compare">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">Side-by-side</div>
          <h2>Manual ops vs generic tools vs Recover Agent.</h2>
          <p>Same orders. Same ad spend. Different recovery rate.</p>
        </Reveal>

        <Reveal className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col">What you need</th>
                <th scope="col">Manual team</th>
                <th scope="col">Generic IVR / WA tool</th>
                <th scope="col" className="is-win">
                  Recover Agent
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.feature}>
                  <th scope="row">{row.feature}</th>
                  <td>{row.manual}</td>
                  <td>{row.generic}</td>
                  <td className="is-win">{row.recover}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="compare-cards">
            {ROWS.map((row) => (
              <article className="compare-card" key={row.feature}>
                <h3>{row.feature}</h3>
                <dl>
                  <div>
                    <dt>Manual team</dt>
                    <dd>{row.manual}</dd>
                  </div>
                  <div>
                    <dt>Generic tool</dt>
                    <dd>{row.generic}</dd>
                  </div>
                  <div className="is-win">
                    <dt>Recover Agent</dt>
                    <dd>{row.recover}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
