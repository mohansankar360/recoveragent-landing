export function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(2)}L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(num));
}

export interface RTOCalculatorInputs {
  monthlyOrders: number;
  codPercent: number;
  rtoPercent: number;
  averageOrderValue: number;
}

export interface RTOCalculatorResults {
  monthlyCodOrders: number;
  rtoOrders: number;
  grossOrderValueAtRisk: number;
}

export function calculateRTOLoss(
  inputs: RTOCalculatorInputs
): RTOCalculatorResults {
  const monthlyCodOrders = Math.round(
    inputs.monthlyOrders * (inputs.codPercent / 100)
  );
  const rtoOrders = Math.round(monthlyCodOrders * (inputs.rtoPercent / 100));
  const grossOrderValueAtRisk = rtoOrders * inputs.averageOrderValue;

  return {
    monthlyCodOrders,
    rtoOrders,
    grossOrderValueAtRisk,
  };
}

export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
