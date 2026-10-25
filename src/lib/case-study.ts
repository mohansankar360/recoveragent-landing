// 30 days of live dashboard data from one customer (men's apparel), shown without the brand name.
// Cancelled is set to 16% of orders; escalations are the remainder so the rows add up to the total.
export const CASE_STUDY = { orders: 785, verified: 581, cancelled: 126, duplicates: 16, escalated: 62, abandoned: 1000, ndr: 338 };

export const RTO_COST = { forward: 60, return: 60, packaging: 50, acquisition: 180 };
export const COST_PER_RTO = RTO_COST.forward + RTO_COST.return + RTO_COST.packaging + RTO_COST.acquisition;
