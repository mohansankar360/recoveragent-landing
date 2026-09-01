import type { PricingTier } from "./calculator";

export type PlanFeatureKey =
  | "codConfirmation"
  | "abandonedCheckout"
  | "ndrRecovery";

export interface PlanFeatureRow {
  label: string;
  key: PlanFeatureKey;
}

export const PLAN_FEATURE_ROWS: PlanFeatureRow[] = [
  { label: "COD Confirmation", key: "codConfirmation" },
  { label: "Abandoned Checkout Recovery", key: "abandonedCheckout" },
  { label: "NDR Recovery", key: "ndrRecovery" },
];

export const PLAN_FEATURES: Record<
  PricingTier["id"],
  Record<PlanFeatureKey, boolean>
> = {
  starter: {
    codConfirmation: true,
    abandonedCheckout: false,
    ndrRecovery: false,
  },
  growth: {
    codConfirmation: true,
    abandonedCheckout: true,
    ndrRecovery: false,
  },
  scale: {
    codConfirmation: true,
    abandonedCheckout: true,
    ndrRecovery: true,
  },
};

export const ALL_PLANS_WHATSAPP = [
  "COD & Prepaid Order Alerts",
  "Order Fulfilled notifications",
  "Abandoned Checkout Recovery",
  "Chatbots",
  "Transactional & customer communication flows",
];
