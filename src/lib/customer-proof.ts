export type CustomerLogo = { name: string; src: string; width: number; height: number };

export type CustomerQuote = {
  quote: string;
  name: string;
  role: string;
  brand: string;
  /** Short, verifiable result such as "RTO 29% → 16% in 6 weeks". */
  metric?: string;
  photo?: string;
};

// Add real customers only, with their written permission.
// The logo strip and the quotes section stay hidden while these lists are empty.
export const CUSTOMER_LOGOS: CustomerLogo[] = [];

export const CUSTOMER_QUOTES: CustomerQuote[] = [];
