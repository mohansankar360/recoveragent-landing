export type RecoveryPath = {
  id: "abandoned" | "cod" | "ndr";
  label: string;
  tag: string;
  headline: string;
  description: string;
  loss: string;
  recover: string;
};

export type HeroCallFlow = RecoveryPath & {
  customer: string;
  context: string;
  aiLine: string;
  customerLine: string;
  saved: string;
};

export const RECOVERY_PATHS: RecoveryPath[] = [
  {
    id: "abandoned",
    label: "Abandoned checkouts",
    tag: "Abandoned checkouts",
    headline: "Recover abandoned checkouts",
    description:
      "Customers who added to cart but never completed payment. Recover them with an AI voice conversation that brings them back to complete their order.",
    loss: "₹3,450 at risk",
    recover: "Checkout recovered",
  },
  {
    id: "cod",
    label: "COD verification",
    tag: "COD verification",
    headline: "Stop risky COD orders",
    description:
      "AI calls customers before shipping, confirms purchase intent and helps prevent fake or unwanted COD orders from becoming RTOs.",
    loss: "₹525 per RTO",
    recover: "Shipment confirmed",
  },
  {
    id: "ndr",
    label: "NDR recovery",
    tag: "NDR recovery",
    headline: "Recover failed deliveries",
    description:
      "When a delivery fails, AI calls the customer, understands the issue and helps get the order successfully delivered instead of returned.",
    loss: "Return imminent",
    recover: "Re-attempt booked",
  },
];

export const HERO_CALL_FLOWS: HeroCallFlow[] = [
  {
    ...RECOVERY_PATHS[0],
    customer: "Priya",
    context: "Cart left · ₹3,450",
    aiLine: "Hi Priya, you left items in your cart 20 minutes ago…",
    customerLine: "Yes, I'll complete the order now.",
    saved: "₹3,450 recovered",
  },
  {
    ...RECOVERY_PATHS[1],
    customer: "Rahul",
    context: "COD Order · ₹2,299",
    aiLine: "Hi Rahul, this is regarding your order from…",
    customerLine: "Yes, I'll take the delivery.",
    saved: "₹2,299 saved",
  },
  {
    ...RECOVERY_PATHS[2],
    customer: "Arjun",
    context: "Failed delivery · ₹1,899",
    aiLine: "Hi Arjun, your parcel couldn't be delivered today…",
    customerLine: "Please ask delivery boy to come tomorrow.",
    saved: "₹1,899 saved",
  },
];
