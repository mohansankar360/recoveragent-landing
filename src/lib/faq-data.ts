export const faqs = [
  {
    question: 'How is pricing calculated?',
    answer: 'Plans are priced per order, with an included monthly allowance and an additional-order rate. Each COD order or abandoned checkout counts once in the estimate. Use the calculator to compare the plan base and overage for your volume; confirm messaging charges, taxes and retry terms in your demo.',
  },
  {
    question: 'Who can book a live demo?',
    answer: 'Live demos are for Shopify or WooCommerce stores doing 500 or more orders per month. Smaller stores can request an onboarding call to explore WhatsApp recovery.',
  },
  {
    question: 'What happens when a call is unanswered?',
    answer: 'An unanswered call is recorded as unreachable. Set retry timing, WhatsApp follow-up and review rules during implementation. An unanswered call alone does not establish that an order is fake; your team controls fulfilment decisions.',
  },
  {
    question: 'What does my team need to prepare?',
    answer: 'Bring monthly order volume, COD share, RTO rate and the commerce and shipping tools you use. We map your dispatch cutoffs, language, brand policies and exception handling before testing your first workflow.',
  },
  {
    question: "Is Recover Agent just an AI calling tool?",
    answer:
      "No. Voice is the conversation layer. Recover Agent also queues ecommerce events, turns calls into clear dispositions, coordinates WhatsApp follow-up, and gives operators one place to review the outcome and next step.",
  },
  {
    question: "What happens when the customer asks something unexpected?",
    answer:
      "The agent can use configured product, order, and policy context. Questions or exceptions that should not be handled automatically can be marked for intervention or human review.",
  },
  {
    question: "Does my team need to listen to every call?",
    answer:
      "No. Calls produce a visible outcome with the recording and history available when your team wants to inspect the detail.",
  },
  {
    question: "Can it speak Indian languages?",
    answer:
      "The voice platform supports multiple Indian-language configurations and code-mixed conversations. The right language and voice setup is selected during implementation.",
  },
  {
    question: "Does Recover Agent work with Shopify and WooCommerce?",
    answer:
      "Yes. Both are present in the product. The exact actions available depend on the store, courier, payment, and workflow connections configured for the merchant account.",
  },
  {
    question: "How quickly can we start?",
    answer:
      "Implementation depends on the store and workflow complexity. The demo is used to map recovery journeys, integrations, and a rollout plan before a go-live commitment is made.",
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
