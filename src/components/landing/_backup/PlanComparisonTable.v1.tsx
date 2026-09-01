"use client";

/**
 * Backup — pricing table before Apple-design v2 (Aug 2026).
 * To revert: copy this file to ../PlanComparisonTable.tsx and restore
 * PlansCTA.v1.tsx + plans-section.v1.css in globals.css.
 */
import type { Icon } from "@phosphor-icons/react";
import {
  Bell,
  ChatCircle,
  ChartLineUp,
  Check,
  CurrencyInr,
  Package,
  PaperPlaneTilt,
  Phone,
  Plus,
  Robot,
  RocketLaunch,
  ShoppingCart,
  Truck,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { PRICING_TIERS, type PricingTier } from "@/lib/calculator";
import {
  ALL_PLANS_WHATSAPP,
  PLAN_FEATURE_ROWS,
  PLAN_FEATURES,
  type PlanFeatureKey,
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

const FEATURE_ICONS: Record<PlanFeatureKey, Icon> = {
  codConfirmation: Package,
  abandonedCheckout: ShoppingCart,
  ndrRecovery: Truck,
};

const WHATSAPP_CHIPS: { label: string; icon: Icon }[] = [
  { label: ALL_PLANS_WHATSAPP[0], icon: Bell },
  { label: ALL_PLANS_WHATSAPP[1], icon: Package },
  { label: ALL_PLANS_WHATSAPP[2], icon: ShoppingCart },
  { label: ALL_PLANS_WHATSAPP[3], icon: Robot },
  { label: ALL_PLANS_WHATSAPP[4], icon: ChatCircle },
];

function cellClass(tierId: PricingTier["id"], highlightTierId?: PricingTier["id"]) {
  return highlightTierId === tierId || (highlightTierId === undefined && tierId === "growth")
    ? "is-highlight"
    : "";
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

function RowLabel({ icon: IconComponent, label }: { icon: Icon; label: string }) {
  return (
    <div className="plans-row-label">
      <span className="plans-row-icon" aria-hidden>
        <IconComponent size={16} weight="bold" />
      </span>
      <span>{label}</span>
    </div>
  );
}

export function PlanComparisonTable({
  highlightTierId,
  showAllPlansFooter = true,
}: PlanComparisonTableProps) {
  const activeHighlight = highlightTierId ?? "growth";

  return (
    <div className="plans-compare">
      <div className="plans-card">
        <div className="plans-grid" role="table" aria-label="Plan comparison">
          <div className="plans-grid-row plans-grid-head" role="row">
            <div className="plans-grid-label plans-grid-corner" role="columnheader">
              <span className="plans-corner-label">Plan</span>
            </div>
            {PRICING_TIERS.map((tier) => {
              const meta = TIER_META[tier.id];
              const TierIcon = meta.icon;
              return (
                <div
                  key={tier.id}
                  role="columnheader"
                  className={`plans-tier-head ${cellClass(tier.id, activeHighlight)}`}
                >
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
                </div>
              );
            })}
          </div>

          <div className="plans-grid-row" role="row">
            <div className="plans-grid-label" role="rowheader">
              <RowLabel icon={CurrencyInr} label="Monthly price" />
            </div>
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                role="cell"
                className={`plans-price-cell ${cellClass(tier.id, activeHighlight)}`}
              >
                ₹{tier.base.toLocaleString("en-IN")}
              </div>
            ))}
          </div>

          <div className="plans-grid-row" role="row">
            <div className="plans-grid-label" role="rowheader">
              <RowLabel icon={Phone} label="AI voice calls included" />
            </div>
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                role="cell"
                className={cellClass(tier.id, activeHighlight)}
              >
                {tier.includedCalls.toLocaleString("en-IN")} orders
              </div>
            ))}
          </div>

          <div className="plans-grid-row" role="row">
            <div className="plans-grid-label" role="rowheader">
              <RowLabel icon={Plus} label="Additional order" />
            </div>
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                role="cell"
                className={cellClass(tier.id, activeHighlight)}
              >
                ₹{tier.overagePerOrder}/order
              </div>
            ))}
          </div>

          {PLAN_FEATURE_ROWS.map((row) => {
            const FeatureIcon = FEATURE_ICONS[row.key];
            return (
              <div className="plans-grid-row" role="row" key={row.key}>
                <div className="plans-grid-label" role="rowheader">
                  <RowLabel icon={FeatureIcon} label={row.label} />
                </div>
                {PRICING_TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    role="cell"
                    className={cellClass(tier.id, activeHighlight)}
                  >
                    <FeatureCell included={PLAN_FEATURES[tier.id][row.key]} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {showAllPlansFooter && (
        <div className="plans-all-included">
          <div className="plans-all-included-head">
            <span className="plans-wa-icon" aria-hidden>
              <WhatsappLogo size={22} weight="fill" />
            </span>
            <div>
              <p className="plans-all-included-title">Available in all plans</p>
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
