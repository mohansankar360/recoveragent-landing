export const PER_RTO = 525;
export const RTO_CUT: [number, number] = [0.2, 0.4];
export const CART_CUT: [number, number] = [0.1, 0.15];

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

export function pickCheapestTier(totalCalls: number): PricingTier {
  return PRICING_TIERS.reduce((best, tier) => {
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
}

export interface CalculatorResults {
  rtoOrders: number;
  rtoLoss: number;
  cartLoss: number;
  totalLoss: number;
  recLo: number;
  recHi: number;
  recMid: number;
  rtoRecMid: number;
  cartRecMid: number;
  totalCalls: number;
  tier: PricingTier;
  overageCalls: number;
  baseCost: number;
  overageCost: number;
  cost: number;
  net: number;
  fillPct: number;
}

export function formatInr(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

/** Abandoned checkouts ≈ 60% of monthly COD volume (typical D2C checkout:ship ratio). */
export const CART_FROM_COD_RATIO = 0.6;

export function deriveAbandonedCheckouts(cod: number): number {
  return Math.round(Math.max(0, cod) * CART_FROM_COD_RATIO);
}

export function calculateLoss(inputs: CalculatorInputs): CalculatorResults {
  const aov = Math.max(0, inputs.aov);
  const cod = Math.max(0, inputs.cod);
  const rtoP = Math.min(100, Math.max(0, inputs.rtoPct)) / 100;
  const cart = Math.max(0, inputs.cart);

  const rtoOrders = cod * rtoP;
  // RTO is the final shipped-order loss. NDR is an upstream delivery attempt —
  // orders that fail delivery and return are already counted here, not separately.
  const rtoLoss = rtoOrders * PER_RTO;
  const cartLoss = cart * aov;
  const totalLoss = rtoLoss + cartLoss;

  const recLo =
    rtoOrders * RTO_CUT[0] * PER_RTO + cart * CART_CUT[0] * aov;
  const recHi =
    rtoOrders * RTO_CUT[1] * PER_RTO + cart * CART_CUT[1] * aov;
  const recMid = (recLo + recHi) / 2;

  const rtoRecMid = rtoOrders * ((RTO_CUT[0] + RTO_CUT[1]) / 2) * PER_RTO;
  const cartRecMid = cart * ((CART_CUT[0] + CART_CUT[1]) / 2) * aov;

  const totalCalls = cod + cart;
  const { cost, tier, overageCalls, baseCost, overageCost } = calculateTierCost(totalCalls);
  const net = recMid - cost;
  const fillPct = totalLoss > 0 ? Math.min(100, (recHi / totalLoss) * 100) : 0;

  return {
    rtoOrders,
    rtoLoss,
    cartLoss,
    totalLoss,
    recLo,
    recHi,
    recMid,
    rtoRecMid,
    cartRecMid,
    totalCalls,
    tier,
    overageCalls,
    baseCost,
    overageCost,
    cost,
    net,
    fillPct,
  };
}
