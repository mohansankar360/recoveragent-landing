export const faqs = [
  {
    question: "What if the AI annoys my customer and I lose the sale?",
    answer:
      "The call is a quick confirmation with address verification, not a pitch, and it happens once. Buyers in COD markets expect a confirmation call — most brands already do it manually and badly. If a customer says no, that's an order you were going to lose anyway, except now you didn't pay freight both ways to find out.",
  },
  {
    question: "How is this different from the confirmation calls my ops team already makes?",
    answer:
      "Coverage and speed. A two-person team calls maybe 40% of COD orders, mostly the next morning, in one or two languages. Recover Agent calls 100% of them within 30 seconds, in the buyer's language, at 6pm on a Sunday, and writes every outcome back to Shopify without anyone maintaining a sheet.",
  },
  {
    question: "Will I get banned for using WhatsApp this way?",
    answer:
      "No. Everything runs on the official WhatsApp Business API through Meta's approved route with pre-approved templates. Unofficial gateways are what get numbers banned — we don't use them.",
  },
  {
    question: "What happens to my customer data?",
    answer:
      "It stays inside the encrypted pipe between your store, WhatsApp and the voice system. We operate under India's DPDP Act 2023 and GDPR for merchants shipping internationally. Nothing is sold, and nothing trains a shared model.",
  },
  {
    question: "I'm not on Shopify.",
    answer:
      "Recover Agent is currently built for Shopify and WooCommerce only. If your D2C store is built on any different platform, tell us what you're on and we'll tell you honestly whether it's a two-day job or not worth it yet.",
  },
  {
    question: "What if it doesn't move my RTO?",
    answer:
      "Then you'll know in about three weeks, because the dashboard reports against your own pre-signup baseline rather than an industry average. No annual contract to unwind.",
  },
  {
    question: "Which brands does this not work for?",
    answer:
      "If you're fully prepaid, under 500 orders a month, or your RTO is already in single digits, the maths probably doesn't clear the subscription. We'd rather say that on the call than sell you a plan you'll cancel.",
  },
];

export function faqStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
