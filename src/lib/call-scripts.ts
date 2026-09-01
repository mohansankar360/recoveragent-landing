export interface CallLine {
  speaker: "agent" | "cust";
  text: string;
  translation?: string;
}

export interface CallScript {
  meta: string;
  result: string;
  durationSec: number;
  audioSrc?: string;
  recordingLanguage: string;
  recordingNote: string;
  agentLanguagesNote: string;
  lines: CallLine[];
}

export const CALL_JOURNEYS = [
  { id: "cod", label: "COD confirmation" },
  { id: "abandoned", label: "Abandoned checkout recover" },
  { id: "ndr", label: "NDR recovery" },
] as const;

export type CallJourneyId = (typeof CALL_JOURNEYS)[number]["id"];

/** Hindi call recordings — one per recovery journey. */
export const CALL_SCRIPTS: Record<CallJourneyId, CallScript> = {
  cod: {
    meta: "Outbound · COD verify · #3410-9928",
    result: "COD CONFIRMED",
    audioSrc: "/audio/COD_hindi.mp4",
    durationSec: 60,
    recordingLanguage: "Hindi",
    recordingNote: "Above recording is in Hindi.",
    agentLanguagesNote:
      "Our AI agent can speak in Tamil, Telugu, Malayalam, Kannada and English",
    lines: [
      {
        speaker: "agent",
        text: "नमस्ते! मैं Recover Agent से बोल रही हूँ। आपने अभी ₹1,499 का COD ऑर्डर किया है — बस कन्फर्म करना था।",
        translation:
          "Hi! Calling from Recover Agent. You placed a ₹1,499 COD order — just confirming it.",
      },
      { speaker: "cust", text: "हाँ हाँ, किया है।", translation: "Yes, I did." },
      {
        speaker: "agent",
        text: "बढ़िया। लुधियाना वाले पते पर कल शाम तक पहुँच जाएगा। ₹1,499 डिलीवरी पर देने होंगे — ठीक है?",
        translation:
          "Great. Reaching your Ludhiana address by tomorrow evening. ₹1,499 on delivery — okay?",
      },
      {
        speaker: "cust",
        text: "ठीक है। अभी ऑनलाइन कर दूँ तो?",
        translation: "Fine. Can I just pay online now?",
      },
      {
        speaker: "agent",
        text: "बिल्कुल, WhatsApp पर लिंक भेज रही हूँ — ₹50 शिपिंग भी बच जाएगी।",
        translation: "Of course — sending a link on WhatsApp. Saves you the ₹50 shipping too.",
      },
    ],
  },
  abandoned: {
    meta: "Outbound · Cart recovery · CART-88214",
    result: "ORDER PLACED",
    audioSrc: "/audio/abandoned_hindi.mp3",
    durationSec: 20,
    recordingLanguage: "Hindi",
    recordingNote: "Above recording is in Hindi.",
    agentLanguagesNote:
      "Our AI agent can speak in Tamil, Telugu, Malayalam, Kannada and English",
    lines: [
      {
        speaker: "agent",
        text: "नमस्ते! Recover Agent से बोल रही हूँ। आपने करीब बीस मिनट पहले ₹3,450 का ऑर्डर कार्ट में छोड़ा था — कुछ मदद चाहिए?",
        translation:
          "Hi from Recover Agent. You left a ₹3,450 order in your cart about twenty minutes ago — anything I can help with?",
      },
      {
        speaker: "cust",
        text: "साइज़ को लेकर कन्फ्यूज़ था।",
        translation: "I wasn't sure about the size.",
      },
      {
        speaker: "agent",
        text: "समझ गई। 7 दिन में फ्री साइज़ एक्सचेंज है — WhatsApp पर फिट चार्ट भेज देती हूँ।",
        translation: "Got it. Free size exchange within 7 days — I'll send the fit chart on WhatsApp.",
      },
      {
        speaker: "cust",
        text: "ठीक है। COD पर मिल सकता है?",
        translation: "Okay. Can I do cash on delivery?",
      },
      {
        speaker: "agent",
        text: "हाँ — या अभी पे करें तो ₹50 शिपिंग बच जाएगी। दोनों ऑप्शन WhatsApp पर भेज रही हूँ।",
        translation: "Yes — or pay now and skip the ₹50 shipping. Sending both options on WhatsApp.",
      },
    ],
  },
  ndr: {
    meta: "Outbound · NDR re-attempt · #3410-9934",
    result: "RESCHEDULED",
    audioSrc: "/audio/NDR_english.mp4",
    durationSec: 63,
    recordingLanguage: "English",
    recordingNote: "Above recording is in English.",
    agentLanguagesNote:
      "Our AI agent can speak in Hindi, Tamil, Telugu, Malayalam, Kannada",
    lines: [
      {
        speaker: "agent",
        text: "नमस्ते! Recover Agent से बोल रही हूँ। आज आपका पार्सल डिलीवर नहीं हो पाया — घर पर कोई नहीं था?",
        translation:
          "Hello from Recover Agent. Your parcel could not be delivered today — no one was home?",
      },
      {
        speaker: "cust",
        text: "हाँ, मैं ऑफिस में था।",
        translation: "Yes, I was at the office.",
      },
      {
        speaker: "agent",
        text: "कोई बात नहीं। कल किस समय सुविधा होगी — सुबह या शाम?",
        translation: "No problem. What time suits tomorrow — morning or evening?",
      },
      {
        speaker: "cust",
        text: "शाम छह बजे के बाद।",
        translation: "Evening, after six.",
      },
      {
        speaker: "agent",
        text: "ठीक है, कल शाम छह बजे के बाद री-अटेम्प्ट लगा देती हूँ। WhatsApp पर कन्फर्मेशन आ जाएगा।",
        translation:
          "Done — rescheduled for after six tomorrow. Confirmation coming on WhatsApp.",
      },
    ],
  },
};

export const AGENT_LANGUAGES =
  "English, Tamil, Telugu, Malayalam, and Kannada";

export interface CallPoint {
  n: string;
  title: string;
  body: string;
}

export const CALL_POINTS_BY_JOURNEY: Record<CallJourneyId, CallPoint[]> = {
  cod: [
    {
      n: "01",
      title: "It talks like the neighbourhood, not the boardroom",
      body: `Recording above is in Hindi. Live agents also speak ${AGENT_LANGUAGES} — the code-mixing your buyers use, not textbook translation.`,
    },
    {
      n: "02",
      title: "It fires before the label prints",
      body: "Order placed at 11:04. Call at 11:04. Confirm or cancel before freight burns both ways on a junk COD.",
    },
    {
      n: "03",
      title: "Every outcome writes back to Shopify",
      body: "COD CONFIRMED, CANCELLED, UNREACHABLE, or converted-to-prepaid — tagged on the order so fulfilment rules hold or ship automatically.",
    },
    {
      n: "04",
      title: "A hang-up is also an answer",
      body: "Numbers that never connect are the cheapest RTO you'll avoid. Those orders get flagged before anyone packs them.",
    },
  ],
  abandoned: [
    {
      n: "01",
      title: "It talks like the neighbourhood, not the boardroom",
      body: `Recording above is in Hindi. Live agents also speak ${AGENT_LANGUAGES} — enough to answer size, COD, and delivery questions on the spot.`,
    },
    {
      n: "02",
      title: "It fires inside 30 minutes, not tomorrow morning",
      body: "Cart abandoned at 6:18 pm. Call at 6:22 pm — while they still remember what they wanted, not after your Promotions email dies.",
    },
    {
      n: "03",
      title: "Every outcome writes back to Shopify",
      body: "ORDER PLACED, prepaid link sent, or marked cold — logged on the checkout so your team stops re-chasing the same cart.",
    },
    {
      n: "04",
      title: "A hang-up is also an answer",
      body: "If they won't pick up twice, stop burning agent time. The cart gets tagged and drops out of your recovery queue.",
    },
  ],
  ndr: [
    {
      n: "01",
      title: "It talks like the neighbourhood, not the boardroom",
      body: `Recording above is in Hindi. Live agents also speak ${AGENT_LANGUAGES} — so re-attempt scheduling doesn't sound like a courier robocall.`,
    },
    {
      n: "02",
      title: "It fires the same day, not on Monday's NDR sheet",
      body: "Courier marks consignee unavailable at 8:50 pm. Call at 8:52 pm — new slot locked before the third attempt triggers RTO.",
    },
    {
      n: "03",
      title: "Every outcome writes back to Shopify",
      body: "RESCHEDULED, REATTEMPT REQUESTED, or RTO HOLD — written to the order so the courier and your ops team see the same plan.",
    },
    {
      n: "04",
      title: "A hang-up is also an answer",
      body: "Two failed delivery calls with no pickup? Flag it early. Cheaper to hold than pay reverse logistics on a dead number.",
    },
  ],
};
