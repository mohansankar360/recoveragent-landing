"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";
import { PRICING_TIERS } from "@/lib/calculator";
import { ALL_PLANS_WHATSAPP } from "@/lib/pricing-plans";
import { PlanComparisonTable } from "./PlanComparisonTable";
import { PlansCTA } from "./PlansCTA";

const GROWTH = PRICING_TIERS.find((t) => t.id === "growth")!;

export function PlanHighlight() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="sec sec-alt" id="plans">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">Pricing</div>
          <h2>Most brands start on Growth.</h2>
          <p>COD + cart recovery on one plan. Scale up when NDR volume justifies it.</p>
        </Reveal>

        <Reveal>
          <div className="plan-highlight-card">
            <div className="plan-highlight-badge">Recommended ★</div>
            <h3>{GROWTH.name}</h3>
            <div className="plan-highlight-price">
              ₹{GROWTH.base.toLocaleString("en-IN")}
              <span>/ month</span>
            </div>
            <p className="plan-highlight-meta">
              {GROWTH.includedCalls.toLocaleString("en-IN")} AI voice calls included · +₹
              {GROWTH.overagePerOrder}/order after
            </p>
            <ul className="plan-highlight-list">
              <li>COD confirmation calls</li>
              <li>Abandoned checkout recovery</li>
              <li>Official WhatsApp API</li>
              <li>6 Indian languages</li>
            </ul>
            <a className="btn btn-primary" href="#demo-booking">
              Book a demo
            </a>
          </div>

          <button
            type="button"
            className="plan-highlight-toggle"
            onClick={() => {
              if (!expanded) trackEvent("pricing_viewed");
              setExpanded((v) => !v);
            }}
            aria-expanded={expanded}
          >
            {expanded ? "Hide plan comparison" : "Compare all plans"}
          </button>

          {expanded && (
            <div className="plan-highlight-table">
              <PlanComparisonTable highlightTierId="growth" />
              <PlansCTA />
            </div>
          )}

          {!expanded && (
            <p className="plan-highlight-foot">
              All plans include: {ALL_PLANS_WHATSAPP.slice(0, 3).join(", ")}…
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
