export interface ManifestOrder {
  awb: string;
  place: string;
  amt: number;
  bad: string;
  good: string;
}

export const MANIFEST_ORDERS: ManifestOrder[] = [
  {
    awb: "AWB 3410 9928",
    place: "Ludhiana, Punjab",
    amt: 1499,
    bad: "NOT REACHABLE",
    good: "COD CONFIRMED",
  },
  {
    awb: "AWB 3410 9931",
    place: "Patna, Bihar",
    amt: 2299,
    bad: "RTO INITIATED",
    good: "PAID ONLINE",
  },
  {
    awb: "AWB 3410 9934",
    place: "Guwahati, Assam",
    amt: 899,
    bad: "NDR · ATTEMPT 3",
    good: "RESCHEDULED",
  },
  {
    awb: "CART 88214",
    place: "Coimbatore, TN",
    amt: 3450,
    bad: "CART ABANDONED",
    good: "ORDER PLACED",
  },
  {
    awb: "AWB 3410 9940",
    place: "Indore, MP",
    amt: 1799,
    bad: "WRONG NUMBER",
    good: "ADDRESS FIXED",
  },
];

export const MANIFEST_SUM = MANIFEST_ORDERS.reduce((sum, order) => sum + order.amt, 0);

export const MANIFEST_LANGS = ["Hindi", "Tamil", "Hindi", "Telugu", "Malayalam"];
