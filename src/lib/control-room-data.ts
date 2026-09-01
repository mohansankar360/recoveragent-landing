export type ModuleId = "cod" | "abandoned" | "ndr";

export type StageTone = "neutral" | "queue" | "warn" | "alert" | "success" | "loss";

/** Mask middle 6 digits of a 10-digit Indian mobile number. */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const local =
    digits.startsWith("91") && digits.length >= 12 ? digits.slice(2, 12) : digits.slice(-10);
  if (local.length !== 10) return phone;
  return `+91 ${local.slice(0, 2)}******${local.slice(8)}`;
}

export interface FunnelStage {
  id: string;
  label: string;
  count: number;
  pct: string;
  tone: StageTone;
  breakdown?: { label: string; count: number }[];
}

export interface DemoOrder {
  id: string;
  stageId: string;
  name: string;
  phone: string;
  orderId: string;
  product: string;
  amount: number;
  status: string;
  statusTone: StageTone;
  meta?: string;
}

export interface ControlModule {
  id: ModuleId;
  tab: string;
  title: string;
  subtitle: string;
  stages: FunnelStage[];
  orders: DemoOrder[];
}

export const CONTROL_MODULES: ControlModule[] = [
  {
    id: "cod",
    tab: "COD confirmation",
    title: "Stop junk before it ships",
    subtitle: "Tap a funnel stage to drill into live orders.",
    stages: [
      { id: "total", label: "Total COD orders", count: 1960, pct: "100%", tone: "neutral" },
      {
        id: "queue",
        label: "In queue",
        count: 118,
        pct: "6%",
        tone: "queue",
        breakdown: [
          { label: "In queue", count: 83 },
          { label: "Quiet hours", count: 35 },
          { label: "Pending wallet", count: 0 },
        ],
      },
      { id: "no-answer", label: "Call not connected", count: 39, pct: "2%", tone: "warn" },
      {
        id: "intervention",
        label: "Intervention required",
        count: 98,
        pct: "5%",
        tone: "alert",
        breakdown: [
          { label: "Escalation", count: 73 },
          { label: "Call back", count: 0 },
          { label: "Duplicate order", count: 25 },
        ],
      },
      { id: "verified", label: "Verified", count: 1646, pct: "84%", tone: "success" },
      { id: "not-verified", label: "Not verified", count: 59, pct: "3%", tone: "loss" },
    ],
    orders: [
      {
        id: "cod-1",
        stageId: "intervention",
        name: "Deepu Ojha",
        phone: "+91 98765 43210",
        orderId: "#10042",
        product: "Men's cotton checkered boxer shorts · M",
        amount: 648,
        status: "Escalation",
        statusTone: "alert",
        meta: "Customer wants to change address",
      },
      {
        id: "cod-5",
        stageId: "intervention",
        name: "Arjun Malhotra",
        phone: "+91 98187 33492",
        orderId: "#10055",
        product: "Slim-fit chinos · Beige · 32",
        amount: 1299,
        status: "Duplicate order",
        statusTone: "alert",
        meta: "Second COD from same number in 48 hr",
      },
      {
        id: "cod-2",
        stageId: "verified",
        name: "Yogesh Nair",
        phone: "+91 98450 22118",
        orderId: "#10038",
        product: "Oversized tee · Black · L",
        amount: 899,
        status: "Verified",
        statusTone: "success",
        meta: "Voice confirmed · Hindi",
      },
      {
        id: "cod-6",
        stageId: "verified",
        name: "Meera Pillai",
        phone: "+91 98471 88203",
        orderId: "#10061",
        product: "Cotton kurta · White · M",
        amount: 1149,
        status: "Verified",
        statusTone: "success",
        meta: "Voice confirmed · Malayalam",
      },
      {
        id: "cod-3",
        stageId: "queue",
        name: "Priya Sharma",
        phone: "+91 98102 88441",
        orderId: "#10051",
        product: "Linen co-ord set · S",
        amount: 1499,
        status: "In queue",
        statusTone: "queue",
        meta: "Call fires in 12 sec",
      },
      {
        id: "cod-7",
        stageId: "queue",
        name: "Vikram Desai",
        phone: "+91 98233 44107",
        orderId: "#10063",
        product: "Graphic hoodie · Grey · XL",
        amount: 1699,
        status: "In queue",
        statusTone: "queue",
        meta: "Quiet hours · fires at 9 am",
      },
      {
        id: "cod-4",
        stageId: "no-answer",
        name: "Sanjay Mehta",
        phone: "+91 98200 11903",
        orderId: "#10029",
        product: "Running shorts · Navy · M",
        amount: 749,
        status: "No answer",
        statusTone: "warn",
        meta: "2 attempts · Retry scheduled",
      },
      {
        id: "cod-8",
        stageId: "no-answer",
        name: "Fatima Sheikh",
        phone: "+91 98920 77341",
        orderId: "#10047",
        product: "Palazzo set · Maroon · L",
        amount: 899,
        status: "No answer",
        statusTone: "warn",
        meta: "1 attempt · Retry in 2 hr",
      },
      {
        id: "cod-9",
        stageId: "not-verified",
        name: "Karan Bhatia",
        phone: "+91 98105 66218",
        orderId: "#10071",
        product: "Performance polo · Navy · L",
        amount: 1099,
        status: "Not verified",
        statusTone: "loss",
        meta: "Customer declined on call · Order on hold",
      },
      {
        id: "cod-10",
        stageId: "not-verified",
        name: "Pooja Kulkarni",
        phone: "+91 98220 11847",
        orderId: "#10068",
        product: "Printed maxi dress · Teal · M",
        amount: 1399,
        status: "Not verified",
        statusTone: "loss",
        meta: "3 attempts · No confirmation · RTO hold applied",
      },
    ],
  },
  {
    id: "abandoned",
    tab: "Abandoned checkout",
    title: "Catch revenue before it walks out",
    subtitle: "Same control room. Different leak in the funnel.",
    stages: [
      { id: "total", label: "Total abandoned", count: 840, pct: "100%", tone: "neutral" },
      {
        id: "queue",
        label: "In queue",
        count: 84,
        pct: "10%",
        tone: "queue",
        breakdown: [
          { label: "In queue", count: 77 },
          { label: "Filtered out", count: 0 },
          { label: "Pending wallet", count: 7 },
        ],
      },
      { id: "no-answer", label: "Call not connected", count: 8, pct: "1%", tone: "warn" },
      {
        id: "intervention",
        label: "Intervention required",
        count: 6,
        pct: "1%",
        tone: "alert",
        breakdown: [
          { label: "Escalation", count: 4 },
          { label: "Call back", count: 2 },
        ],
      },
      { id: "link-sent", label: "Link sent", count: 34, pct: "4%", tone: "queue" },
      { id: "recovered", label: "Recovered", count: 134, pct: "16%", tone: "success" },
    ],
    orders: [
      {
        id: "ab-1",
        stageId: "recovered",
        name: "Ananya Reddy",
        phone: "+91 99088 44102",
        orderId: "Checkout #8821",
        product: "Summer dress · Floral · M",
        amount: 1299,
        status: "Recovered",
        statusTone: "success",
        meta: "Completed checkout after voice follow-up",
      },
      {
        id: "ab-4",
        stageId: "recovered",
        name: "Siddharth Rao",
        phone: "+91 98450 99218",
        orderId: "Checkout #8819",
        product: "Linen shirt · Sky · L",
        amount: 1499,
        status: "Recovered",
        statusTone: "success",
        meta: "Prepaid conversion · voice nudge",
      },
      {
        id: "ab-2",
        stageId: "queue",
        name: "Rahul Verma",
        phone: "+91 98111 22009",
        orderId: "Checkout #8814",
        product: "Sneakers · White · 42",
        amount: 2199,
        status: "In queue",
        statusTone: "queue",
        meta: "Voice call in 8 min",
      },
      {
        id: "ab-5",
        stageId: "queue",
        name: "Divya Menon",
        phone: "+91 98470 33102",
        orderId: "Checkout #8826",
        product: "Wrap dress · Rust · S",
        amount: 1899,
        status: "In queue",
        statusTone: "queue",
        meta: "Call fires in 4 min",
      },
      {
        id: "ab-3",
        stageId: "link-sent",
        name: "Kavya Iyer",
        phone: "+91 98440 77102",
        orderId: "Checkout #8802",
        product: "Kurta set · Indigo · L",
        amount: 1599,
        status: "Link sent",
        statusTone: "queue",
        meta: "Prepaid link opened · not paid yet",
      },
      {
        id: "ab-6",
        stageId: "link-sent",
        name: "Harsh Patel",
        phone: "+91 98251 44018",
        orderId: "Checkout #8809",
        product: "Polo tee · Navy · M",
        amount: 999,
        status: "Link sent",
        statusTone: "queue",
        meta: "Link sent · not opened yet",
      },
      {
        id: "ab-7",
        stageId: "no-answer",
        name: "Nisha Chopra",
        phone: "+91 98712 88403",
        orderId: "Checkout #8834",
        product: "Wide-leg trousers · Black · 28",
        amount: 1799,
        status: "No answer",
        statusTone: "warn",
        meta: "2 attempts · WhatsApp nudge sent",
      },
      {
        id: "ab-8",
        stageId: "no-answer",
        name: "Amit Joshi",
        phone: "+91 98190 55217",
        orderId: "Checkout #8831",
        product: "Casual blazer · Charcoal · M",
        amount: 2499,
        status: "No answer",
        statusTone: "warn",
        meta: "1 attempt · Retry in 45 min",
      },
      {
        id: "ab-9",
        stageId: "intervention",
        name: "Tanvi Saxena",
        phone: "+91 98108 77462",
        orderId: "Checkout #8842",
        product: "Embroidered kurta · Ivory · M",
        amount: 1699,
        status: "Escalation",
        statusTone: "alert",
        meta: "Customer wants to make bulk purchase",
      },
      {
        id: "ab-10",
        stageId: "intervention",
        name: "Rakesh Nambiar",
        phone: "+91 98460 33109",
        orderId: "Checkout #8838",
        product: "Leather belt · Brown · 34",
        amount: 899,
        status: "Call back",
        statusTone: "alert",
        meta: "Requested callback after 6 pm · Malayalam",
      },
    ],
  },
  {
    id: "ndr",
    tab: "NDR & RTO",
    title: "Kill RTO before reverse logistics bills you",
    subtitle: "Diagnose last-mile leakage. Re-attempt same day.",
    stages: [
      { id: "shipped", label: "Order shipped", count: 2660, pct: "—", tone: "success" },
      { id: "ndr", label: "NDR status", count: 392, pct: "100%", tone: "warn" },
      {
        id: "queue",
        label: "In queue",
        count: 47,
        pct: "12%",
        tone: "queue",
        breakdown: [
          { label: "In queue", count: 47 },
          { label: "Quiet hours", count: 0 },
        ],
      },
      { id: "no-answer", label: "Call not connected", count: 157, pct: "40%", tone: "warn" },
      { id: "intervention", label: "Intervention required", count: 18, pct: "5%", tone: "alert" },
      { id: "reattempt", label: "Reattempt requested", count: 188, pct: "48%", tone: "success" },
    ],
    orders: [
      {
        id: "ndr-1",
        stageId: "no-answer",
        name: "Rathika Vijayakumar",
        phone: "+91 98403 55102",
        orderId: "#9556",
        product: "Men's cotton checkered boxer shorts · L",
        amount: 599,
        status: "Consignee unavailable",
        statusTone: "warn",
        meta: "AWB BLDT123456789 · Call not connected",
      },
      {
        id: "ndr-4",
        stageId: "no-answer",
        name: "Manish Agarwal",
        phone: "+91 98731 22094",
        orderId: "#9544",
        product: "Denim jacket · Blue · L",
        amount: 2199,
        status: "Consignee unavailable",
        statusTone: "warn",
        meta: "AWB BLDT987654321 · 2 attempts",
      },
      {
        id: "ndr-2",
        stageId: "reattempt",
        name: "Imran Khan",
        phone: "+91 98770 44118",
        orderId: "#9512",
        product: "Cargo joggers · Olive · M",
        amount: 899,
        status: "Reattempt scheduled",
        statusTone: "success",
        meta: "Tomorrow 4–7 pm · written to Shopify",
      },
      {
        id: "ndr-5",
        stageId: "reattempt",
        name: "Lakshmi Narayan",
        phone: "+91 98412 88307",
        orderId: "#9501",
        product: "Silk saree blouse · Gold · M",
        amount: 799,
        status: "Reattempt scheduled",
        statusTone: "success",
        meta: "Friday 11–2 pm · Tamil call done",
      },
      {
        id: "ndr-3",
        stageId: "queue",
        name: "Neha Gupta",
        phone: "+91 98102 99341",
        orderId: "#9488",
        product: "Sports bra · Black · S",
        amount: 699,
        status: "In queue",
        statusTone: "queue",
        meta: "NDR received 14 min ago",
      },
      {
        id: "ndr-6",
        stageId: "queue",
        name: "Rohit Banerjee",
        phone: "+91 98311 77402",
        orderId: "#9475",
        product: "Track pants · Charcoal · M",
        amount: 849,
        status: "In queue",
        statusTone: "queue",
        meta: "NDR received 6 min ago",
      },
      {
        id: "ndr-7",
        stageId: "intervention",
        name: "Sunita Devi",
        phone: "+91 98765 90214",
        orderId: "#9462",
        product: "Anarkali set · Wine · L",
        amount: 1899,
        status: "Escalation",
        statusTone: "alert",
        meta: "Payment issue",
      },
      {
        id: "ndr-8",
        stageId: "intervention",
        name: "Gaurav Mishra",
        phone: "+91 98202 66138",
        orderId: "#9458",
        product: "Formal shirt · White · 40",
        amount: 1199,
        status: "Escalation",
        statusTone: "alert",
        meta: "Refused delivery · Wants cancellation before RTO",
      },
    ],
  },
];

export const AUTOMATION_STEPS = [
  { label: "Shopify order", detail: "Webhook fires" },
  { label: "Voice call", detail: "< 30 sec" },
  { label: "Shopify tag", detail: "Verified / RTO hold" },
];

export const VISIBLE_ORDER_CARDS = 2;
