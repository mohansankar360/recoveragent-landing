import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

const CASES = [
  {
    category: "D2C Skincare · Mumbai",
    volume: "850 COD orders/mo",
    headline: "RTO dropped from 26% to 13% in 8 weeks.",
    flow: "AI confirms COD before label print · WhatsApp sends prepaid link on hesitation",
    metric: "−50%",
    metricLabel: "RTO rate",
  },
  {
    category: "Fashion · Delhi NCR",
    volume: "1,200 orders/mo · 62% COD",
    headline: "Recovered ₹4.2L/month from abandoned carts alone.",
    flow: "Voice call 20 min after drop-off · payment link on WhatsApp if they answer",
    metric: "18%",
    metricLabel: "cart recovery rate",
  },
  {
    category: "Supplements · Bangalore",
    volume: "400 NDR cases/mo",
    headline: "Same-day NDR calls cut return-to-origin by a third.",
    flow: "NDR trigger → AI call within 4 hours · address correction → re-dispatch",
    metric: "−34%",
    metricLabel: "NDR → RTO conversion",
  },
];

export function CaseStudyCards() {
  return (
    <section className="sec" id="proof">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">Real outcomes</div>
          <h2>What D2C brands see in the first 60 days.</h2>
          <p>Anonymized results from Indian Shopify brands on Recover Agent. Your numbers depend on volume and COD mix.</p>
        </Reveal>

        <Reveal className="case-study-grid">
          {CASES.map((item) => (
            <article className="case-study-card" key={item.category}>
              <div className="case-study-meta">
                <span>{item.category}</span>
                <span>{item.volume}</span>
              </div>
              <h3>{item.headline}</h3>
              <p>{item.flow}</p>
              <div className="case-study-metric">
                <span className="case-study-metric-value">{item.metric}</span>
                <span className="case-study-metric-label">{item.metricLabel}</span>
              </div>
            </article>
          ))}
        </Reveal>

        <Reveal className="case-study-foot">
          <Link className="btn btn-primary" href="/book-demo">
            See if this works for my store →
          </Link>
          <p className="new-trust-line">15-min walkthrough · No pitch deck · Your numbers</p>
        </Reveal>
      </div>
    </section>
  );
}
