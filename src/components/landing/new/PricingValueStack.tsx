import { PRICING_TIERS } from "@/lib/calculator";

const GROWTH = PRICING_TIERS.find((tier) => tier.id === "growth")!;

const VALUE_LINES = [
  {
    label: "Manual COD calling team",
    value: "₹40,000",
    suffix: "/mo",
    struck: true,
  },
  {
    label: "WhatsApp-only recovery tool",
    value: "₹8,000",
    suffix: "/mo",
    struck: true,
  },
  {
    label: "Recover Agent · Growth plan",
    value: `₹${GROWTH.base.toLocaleString("en-IN")}`,
    suffix: "/mo",
    highlight: true,
  },
] as const;

interface PricingValueStackProps {
  variant?: "hero" | "section";
}

export function PricingValueStack({ variant = "section" }: PricingValueStackProps) {
  return (
    <div className={`value-receipt${variant === "hero" ? " is-hero" : ""}`}>
      <div className="value-receipt-head">
        <span className="value-receipt-badge">Value stack</span>
        <span className="value-receipt-save value-receipt-save-badge">
          Save ~₹35K/mo vs manual ops
        </span>
      </div>

      <dl className="value-receipt-lines">
        {VALUE_LINES.map((line) => (
          <div
            className={`value-receipt-line${"struck" in line && line.struck ? " is-struck" : ""}${"highlight" in line && line.highlight ? " is-highlight" : ""}`}
            key={line.label}
          >
            <dt>{line.label}</dt>
            <dd>
              <span>{line.value}</span>
              <span className="value-receipt-suffix">{line.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="value-receipt-foot">
        <div>
          <span className="value-receipt-foot-label">Includes on Growth</span>
          <span className="value-receipt-foot-detail">
            {GROWTH.includedCalls.toLocaleString("en-IN")} AI calls · COD + cart · WhatsApp
          </span>
        </div>
        <div className="value-receipt-from">
          From ₹{PRICING_TIERS[0].base.toLocaleString("en-IN")}/mo
        </div>
      </div>
    </div>
  );
}
