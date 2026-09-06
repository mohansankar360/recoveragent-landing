"use client";

import Link from "next/link";
import type { Icon } from "@phosphor-icons/react";
import {
  Bell,
  ChartLineUp,
  Check,
  ChatCircle,
  Package,
  PaperPlaneTilt,
  Robot,
  RocketLaunch,
  ShoppingCart,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { trackEvent } from "@/lib/analytics";
import { PRICING_TIERS, type PricingTier } from "@/lib/calculator";
import {
  ALL_PLANS_WHATSAPP,
  PLAN_FEATURE_ROWS,
  PLAN_FEATURES,
} from "@/lib/pricing-plans";

interface PlanComparisonTableProps {
  highlightTierId?: PricingTier["id"];
  showAllPlansFooter?: boolean;
}

const TIER_META: Record<
  PricingTier["id"],
  { tagline: string; icon: Icon; tone: string }
> = {
  starter: {
    tagline: "Perfect to get started",
    icon: PaperPlaneTilt,
    tone: "starter",
  },
  growth: {
    tagline: "Built for growing brands",
    icon: ChartLineUp,
    tone: "growth",
  },
  scale: {
    tagline: "For high-volume stores",
    icon: RocketLaunch,
    tone: "scale",
  },
};

const WHATSAPP_CHIPS: { label: string; icon: Icon }[] = [
  { label: ALL_PLANS_WHATSAPP[0], icon: Bell },
  { label: ALL_PLANS_WHATSAPP[1], icon: Package },
  { label: ALL_PLANS_WHATSAPP[2], icon: ShoppingCart },
  { label: ALL_PLANS_WHATSAPP[3], icon: Robot },
  { label: ALL_PLANS_WHATSAPP[4], icon: ChatCircle },
];

function isHighlighted(tierId: PricingTier["id"], highlightTierId?: PricingTier["id"]) {
  return (
    highlightTierId === tierId ||
    (highlightTierId === undefined && tierId === "growth")
  );
}

function highlightClass(tierId: PricingTier["id"], highlightTierId?: PricingTier["id"]) {
  return isHighlighted(tierId, highlightTierId) ? "is-highlight" : "";
}

function FeatureCell({ included }: { included: boolean }) {
  return (
    <span
      className={`plans-check ${included ? "is-yes" : "is-no"}`}
      aria-label={included ? "Included" : "Not included"}
    >
      {included ? <Check size={14} weight="bold" /> : "—"}
    </span>
  );
}

function PlanTierCTA({
  tierId,
  recommended,
}: {
  tierId: PricingTier["id"];
  recommended?: boolean;
}) {
  return (
    <Link
      className={`plans-tier-cta btn ${recommended ? "btn-primary" : "btn-ghost plans-tier-cta-muted"}`}
      href="/book-demo"
      onClick={() =>
        trackEvent("sticky_cta_clicked", { source: "pricing", tier: tierId })
      }
    >
      Book a demo
    </Link>
  );
}

function TierHeader({
  tier,
  highlightTierId,
}: {
  tier: PricingTier;
  highlightTierId?: PricingTier["id"];
}) {
  const meta = TIER_META[tier.id];
  const TierIcon = meta.icon;

  return (
    <>
      <span className={`plans-tier-icon plans-tier-icon-${meta.tone}`}>
        <TierIcon size={22} weight="bold" aria-hidden />
      </span>
      <strong className="plans-tier-name">
        {tier.name}
        {tier.recommended && (
          <span className="plans-star" aria-label="Recommended plan">
            ★
          </span>
        )}
      </strong>
      <span className="plans-tier-tag">{meta.tagline}</span>
    </>
  );
}

function MobilePlanCard({
  tier,
  highlightTierId,
}: {
  tier: PricingTier;
  highlightTierId?: PricingTier["id"];
}) {
  const highlighted = isHighlighted(tier.id, highlightTierId);

  return (
    <article
      className={`plans-mobile-card ${highlightClass(tier.id, highlightTierId)}`}
    >
      <header className="plans-mobile-head">
        <TierHeader tier={tier} highlightTierId={highlightTierId} />
      </header>

      <p className="plans-mobile-price">₹{tier.base.toLocaleString("en-IN")}</p>
      <p className="plans-mobile-price-note">per month</p>

      <dl className="plans-mobile-features">
        <div className="plans-mobile-row">
          <dt>AI voice calls</dt>
          <dd>{tier.includedCalls.toLocaleString("en-IN")} orders</dd>
        </div>
        <div className="plans-mobile-row">
          <dt>Additional order</dt>
          <dd>₹{tier.overagePerOrder}/order</dd>
        </div>
        {PLAN_FEATURE_ROWS.map((row) => (
          <div className="plans-mobile-row" key={row.key}>
            <dt>{row.label}</dt>
            <dd>
              <FeatureCell included={PLAN_FEATURES[tier.id][row.key]} />
            </dd>
          </div>
        ))}
      </dl>

      <PlanTierCTA tierId={tier.id} recommended={highlighted} />
    </article>
  );
}

export function PlanComparisonTable({
  highlightTierId,
  showAllPlansFooter = true,
}: PlanComparisonTableProps) {
  const activeHighlight = highlightTierId ?? "growth";

  return (
    <div className="plans-compare">
      <div className="plans-card plans-card-desktop">
        <div className="plans-grid" role="table" aria-label="Plan comparison">
          <div className="plans-grid-row plans-grid-head" role="row">
            <div className="plans-grid-label plans-grid-corner" role="columnheader">
              <span className="plans-corner-spacer" aria-hidden />
              <strong className="plans-corner-name">plan</strong>
            </div>
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                role="columnheader"
                className={`plans-tier-head ${highlightClass(tier.id, activeHighlight)}`}
              >
                <TierHeader tier={tier} highlightTierId={activeHighlight} />
              </div>
            ))}
          </div>

          <div className="plans-grid-row" role="row">
            <div className="plans-grid-label" role="rowheader">
              Monthly price
            </div>
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                role="cell"
                className={`plans-price-cell ${highlightClass(tier.id, activeHighlight)}`}
              >
                ₹{tier.base.toLocaleString("en-IN")}
              </div>
            ))}
          </div>

          <div className="plans-grid-row" role="row">
            <div className="plans-grid-label" role="rowheader">
              AI voice calls included
            </div>
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                role="cell"
                className={highlightClass(tier.id, activeHighlight)}
              >
                {tier.includedCalls.toLocaleString("en-IN")} orders
              </div>
            ))}
          </div>

          <div className="plans-grid-row" role="row">
            <div className="plans-grid-label" role="rowheader">
              Additional order
            </div>
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                role="cell"
                className={highlightClass(tier.id, activeHighlight)}
              >
                ₹{tier.overagePerOrder}/order
              </div>
            ))}
          </div>

          {PLAN_FEATURE_ROWS.map((row) => (
            <div className="plans-grid-row" role="row" key={row.key}>
              <div className="plans-grid-label" role="rowheader">
                {row.label}
              </div>
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  role="cell"
                  className={highlightClass(tier.id, activeHighlight)}
                >
                  <FeatureCell included={PLAN_FEATURES[tier.id][row.key]} />
                </div>
              ))}
            </div>
          ))}

          <div className="plans-grid-row plans-grid-cta-row" role="row">
            <div className="plans-grid-label plans-grid-cta-label" role="rowheader">
              Get started
            </div>
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                role="cell"
                className={`plans-tier-cta-cell ${highlightClass(tier.id, activeHighlight)}`}
              >
                <PlanTierCTA
                  tierId={tier.id}
                  recommended={isHighlighted(tier.id, activeHighlight)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="plans-cards-mobile" aria-label="Plan comparison">
        {PRICING_TIERS.map((tier) => (
          <MobilePlanCard key={tier.id} tier={tier} highlightTierId={activeHighlight} />
        ))}
      </div>

      {showAllPlansFooter && (
        <div className="plans-all-included">
          <div className="plans-all-included-head">
            <span className="plans-wa-icon" aria-hidden>
              <WhatsappLogo size={22} weight="fill" />
            </span>
            <div>
              <p className="plans-all-included-title">WhatsApp available in all plans</p>
              <p className="plans-all-included-lead">
                D2C essential WhatsApp flows on every tier
              </p>
            </div>
          </div>
          <ul className="plans-wa-chips">
            {WHATSAPP_CHIPS.map(({ label, icon: ChipIcon }) => (
              <li key={label}>
                <ChipIcon size={16} weight="bold" aria-hidden />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
