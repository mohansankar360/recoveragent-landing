import { Reveal } from "@/components/ui/Reveal";

const STATS = [
  {
    stat: "70%",
    label: "checkout abandon rate",
    detail: "Most brands never follow up in time",
  },
  {
    stat: "₹525",
    label: "avg cost per RTO",
    detail: "Forward + return shipping + handling",
  },
  {
    stat: "48 hrs",
    label: "NDR window",
    detail: "Miss it and the order ships back",
  },
  {
    stat: "3 days",
    label: "to go live",
    detail: "Shopify connect · flows configured · live",
  },
];

export function StatsStrip() {
  return (
    <section className="new-stats-strip" aria-label="Industry recovery stats">
      <div className="wrap">
        <Reveal className="new-stats-grid">
          {STATS.map((item) => (
            <div className="new-stat-tile" key={item.stat}>
              <div className="new-stat-value">{item.stat}</div>
              <div className="new-stat-label">{item.label}</div>
              <div className="new-stat-detail">{item.detail}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
