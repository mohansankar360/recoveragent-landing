import { PLAN_FEATURES } from './pricing-plans';

export interface PricingTier {
  id: "starter" | "growth" | "scale";
  name: string;
  base: number;
  includedCalls: number;
  overagePerOrder: number;
  recommended?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    base: 2499,
    includedCalls: 300,
    overagePerOrder: 5,
  },
  {
    id: "growth",
    name: "Growth",
    base: 4999,
    includedCalls: 700,
    overagePerOrder: 4.5,
    recommended: true,
  },
  {
    id: "scale",
    name: "Scale",
    base: 9999,
    includedCalls: 1800,
    overagePerOrder: 4,
  },
];

export function calculateTierCost(
  totalCalls: number,
  tier: PricingTier = pickCheapestTier(totalCalls)
): { cost: number; tier: PricingTier; overageCalls: number; baseCost: number; overageCost: number } {
  const overageCalls = Math.max(0, totalCalls - tier.includedCalls);
  const baseCost = tier.base;
  const overageCost = overageCalls * tier.overagePerOrder;
  const cost = baseCost + overageCost;
  return { cost, tier, overageCalls, baseCost, overageCost };
}

export function pickCheapestTier(totalCalls: number, needsCheckout = false): PricingTier {
  const eligible = PRICING_TIERS.filter((tier) => !needsCheckout || PLAN_FEATURES[tier.id].abandonedCheckout);
  return eligible.reduce((best, tier) => {
    const bestCost = calculateTierCost(totalCalls, best).cost;
    const tierCost = calculateTierCost(totalCalls, tier).cost;
    return tierCost < bestCost ? tier : best;
  });
}

export interface CalculatorInputs {
  aov: number;
  cod: number;
  rtoPct: number;
  cart: number;
  rtoCost: number;
  avoidableRtoCost: number;
  contributionMarginPct: number;
  billingBasis: 'order' | 'call';
  callsPerItem: number;
  extraMonthlyCost: number;
  scenarios: RecoveryAssumption[];
}

export interface RecoveryAssumption {
  name: string;
  rtoPreventionPct: number;
  incrementalCheckoutPct: number;
}

export interface RecoveryScenario extends RecoveryAssumption {
  preventedRtos: number;
  rtoSavings: number;
  additionalDeliveredOrders: number;
  recoveredSales: number;
  checkoutContribution: number;
  grossBenefit: number;
  net: number;
}

export interface CalculatorResults {
  rtoOrders: number;
  historicalRtoCost: number;
  checkoutValue: number;
  billedUnits: number;
  tier: PricingTier;
  overageCalls: number;
  baseCost: number;
  overageCost: number;
  cost: number;
  extraMonthlyCost: number;
  totalCost: number;
  zeroUpliftNet: number;
  scenarios: RecoveryScenario[];
}

export function formatInr(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function nonnegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function percentage(value: number): number {
  return Math.min(100, nonnegative(value)) / 100;
}

export interface RecoveryEstimateInputs {
  cod: number;
  rtoPct: number;
  cart: number;
  aov: number;
  forwardCost: number;
  returnCost: number;
  packagingCost: number;
  acquisitionCost?: number;
  extraMonthlyCost: number;
  contributionMarginPct?: number;
  rtoPreventionRange?: readonly [number, number];
  checkoutRecoveryRange?: readonly [number, number];
}

/** Product-stated planning ranges; reductions are relative, not percentage points. */
export const RECOVERY_RANGES = { rto: [20, 40], checkout: [14, 18] } as const;

export function calculateRecoveryEstimate(inputs: RecoveryEstimateInputs) {
  const cod = Math.floor(nonnegative(inputs.cod));
  const cart = Math.floor(nonnegative(inputs.cart));
  const aov = nonnegative(inputs.aov);
  const rtoPct = percentage(inputs.rtoPct) * 100;
  const rtoOrders = cod * rtoPct / 100;
  const costPerRto = nonnegative(inputs.forwardCost) + nonnegative(inputs.returnCost) + nonnegative(inputs.packagingCost);
  const acquisitionCostPerOrder = nonnegative(inputs.acquisitionCost ?? 0);
  const rtoAcquisitionCost = rtoOrders * acquisitionCostPerOrder;
  const billedItems = cod + cart;
  const tier = pickCheapestTier(billedItems, cart > 0);
  const plan = calculateTierCost(billedItems, tier);
  const extraCost = nonnegative(inputs.extraMonthlyCost);
  const margin = inputs.contributionMarginPct === undefined || !Number.isFinite(inputs.contributionMarginPct)
    ? undefined : Math.max(-100, Math.min(100, inputs.contributionMarginPct)) / 100;
  const rtoRange = (inputs.rtoPreventionRange ?? RECOVERY_RANGES.rto).map(value => Math.min(100, nonnegative(value))).sort((a, b) => a - b);
  const checkoutRange = (inputs.checkoutRecoveryRange ?? RECOVERY_RANGES.checkout).map(value => Math.min(100, nonnegative(value))).sort((a, b) => a - b);
  const totalCost = plan.cost + extraCost;
  const breakEvenRtos = costPerRto > 0 ? Math.ceil(totalCost / costPerRto) : undefined;
  const breakEvenRtoReductionPct = rtoOrders > 0 && costPerRto > 0 ? totalCost / (rtoOrders * costPerRto) * 100 : undefined;
  const outcomes = rtoRange.map((reduction, index) => {
    const preventedRtos = rtoOrders * reduction / 100;
    const rtoSavings = preventedRtos * costPerRto;
    const recoveredCheckouts = cart * checkoutRange[index] / 100;
    const recoveredRevenue = recoveredCheckouts * aov;
    return {
      reduction, checkoutRecoveryPct: checkoutRange[index],
      rtoPct: rtoPct * (1 - reduction / 100), remainingRtos: rtoOrders - preventedRtos,
      preventedRtos, rtoSavings, recoveredCheckouts, recoveredRevenue,
      recoveryValue: rtoSavings + recoveredRevenue,
      recoveryAfterFees: rtoSavings + recoveredRevenue - plan.cost - extraCost,
      netContribution: margin === undefined ? undefined : rtoSavings + recoveredRevenue * margin - plan.cost - extraCost,
    };
  });
  return {
    rtoOrders, costPerRto, acquisitionCostPerOrder, rtoAcquisitionCost,
    rtoOperatingCost: rtoOrders * costPerRto,
    rtoCost: rtoOrders * costPerRto + rtoAcquisitionCost,
    rtoRevenueAtRisk: rtoOrders * aov, checkoutValue: cart * aov,
    billedItems, plan, extraCost, totalCost, breakEvenRtos, breakEvenRtoReductionPct, outcomes,
  };
}

export function calculateLoss(inputs: CalculatorInputs): CalculatorResults {
  const aov = nonnegative(inputs.aov);
  const cod = Math.floor(nonnegative(inputs.cod));
  const rtoP = percentage(inputs.rtoPct);
  const cart = Math.floor(nonnegative(inputs.cart));

  const rtoOrders = cod * rtoP;
  // RTO is the final shipped-order loss. NDR is an upstream delivery attempt —
  // orders that fail delivery and return are already counted here, not separately.
  const rtoCost = nonnegative(inputs.rtoCost);
  const avoidableCost = Math.min(rtoCost, nonnegative(inputs.avoidableRtoCost));
  const margin = Number.isFinite(inputs.contributionMarginPct)
    ? Math.max(-100, Math.min(100, inputs.contributionMarginPct)) / 100 : 0;
  const multiplier = inputs.billingBasis === 'call' ? Math.max(1, nonnegative(inputs.callsPerItem)) : 1;
  const billedUnits = Math.ceil((cod + cart) * multiplier);
  const tierChoice = pickCheapestTier(billedUnits, cart > 0);
  const { cost, tier, overageCalls, baseCost, overageCost } = calculateTierCost(billedUnits, tierChoice);
  const extraMonthlyCost = nonnegative(inputs.extraMonthlyCost);
  const totalCost = cost + extraMonthlyCost;
  const scenarios = inputs.scenarios.map((assumption): RecoveryScenario => {
    const preventedRtos = rtoOrders * percentage(assumption.rtoPreventionPct);
    const rtoSavings = preventedRtos * avoidableCost;
    // Lift is measured against the existing process and counts retained deliveries,
    // not calls, confirmations, link clicks, or all orders attributed after contact.
    const additionalDeliveredOrders = cart * percentage(assumption.incrementalCheckoutPct);
    const recoveredSales = additionalDeliveredOrders * aov;
    const checkoutContribution = recoveredSales * margin;
    const grossBenefit = rtoSavings + checkoutContribution;
    return { ...assumption, preventedRtos, rtoSavings, additionalDeliveredOrders,
      recoveredSales, checkoutContribution, grossBenefit, net: grossBenefit - totalCost };
  });

  return {
    rtoOrders,
    historicalRtoCost: rtoOrders * rtoCost,
    checkoutValue: cart * aov,
    billedUnits,
    tier,
    overageCalls,
    baseCost,
    overageCost,
    cost,
    extraMonthlyCost,
    totalCost,
    zeroUpliftNet: -totalCost,
    scenarios,
  };
}
