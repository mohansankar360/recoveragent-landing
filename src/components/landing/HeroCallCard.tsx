"use client";

import { Check, SpeakerHigh } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CallJourneyId } from "@/lib/call-scripts";

const ROTATE_MS = 5000;

type HeroCallFlow = {
  id: CallJourneyId;
  label: string;
  customer: string;
  context: string;
  aiLine: string;
  customerLine: string;
  actions: readonly string[];
  saved: string;
};

const HERO_CALL_FLOWS: HeroCallFlow[] = [
  {
    id: "cod",
    label: "COD confirmation",
    customer: "Rahul",
    context: "COD Order · ₹2,299",
    aiLine: "Hi Rahul, this is regarding your order from…",
    customerLine: "Yes, I'll take the delivery.",
    actions: ["COD confirmed", "Address verified", "WhatsApp confirmation sent"],
    saved: "₹2,299 saved",
  },
  {
    id: "abandoned",
    label: "Abandoned checkout recovery",
    customer: "Priya",
    context: "Cart left · ₹3,450",
    aiLine: "Hi Priya, you left items in your cart 20 minutes ago…",
    customerLine: "Yes, I'll complete the order now.",
    actions: ["Objection handled", "COD option sent", "Checkout link on WhatsApp"],
    saved: "₹3,450 recovered",
  },
  {
    id: "ndr",
    label: "NDR follow-up",
    customer: "Arjun",
    context: "Failed delivery · ₹1,899",
    aiLine: "Hi Arjun, your parcel couldn't be delivered today…",
    customerLine: "Please ask delivery boy to come tomorrow.",
    actions: ["Re-attempt scheduled", "Address confirmed", "WhatsApp confirmation sent"],
    saved: "₹1,899 saved",
  },
];

function Waveform() {
  return (
    <span className="call-card-wave-bars" aria-hidden>
      {Array.from({ length: 18 }, (_, i) => (
        <i key={i} style={{ animationDelay: `${i * 0.07}s` }} />
      ))}
    </span>
  );
}

export function HeroCallCard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [flowIndex, setFlowIndex] = useState(0);
  const [contentKey, setContentKey] = useState(0);
  const flow = HERO_CALL_FLOWS[flowIndex];

  const advanceFlow = useCallback(() => {
    setFlowIndex((i) => (i + 1) % HERO_CALL_FLOWS.length);
    setContentKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const timer = window.setInterval(advanceFlow, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [visible, advanceFlow]);

  return (
    <div
      className={`call-card${visible ? " call-card--visible" : ""}`}
      id="hero-call"
      ref={rootRef}
      aria-label={`AI voice agent demo: ${flow.label}`}
    >
      <div className="call-card-top">
        <span>AI Voice Agent</span>
        <span className="live">
          <i className="blip" aria-hidden />
          Live
        </span>
      </div>

      <div className="call-card-flows" aria-hidden>
        {HERO_CALL_FLOWS.map((item, i) => (
          <span
            key={item.id}
            className={`call-card-flow${i === flowIndex ? " active" : ""}`}
          >
            {item.label}
          </span>
        ))}
      </div>

      <div className="call-card-wave">
        <SpeakerHigh size={18} weight="fill" aria-hidden />
        <Waveform />
      </div>

      <div className="call-card-body">
        <div className="call-card-content" key={contentKey}>
          <div className="call-card-who">
            <strong>Calling {flow.customer}</strong>
            <span>{flow.context}</span>
          </div>

          <div className="call-card-transcript">
            <p className="call-card-line call-card-line--ai">
              &ldquo;{flow.aiLine}&rdquo;
            </p>
            <p className="call-card-line call-card-line--customer">
              <span className="call-card-speaker">Customer:</span>
              &ldquo;{flow.customerLine}&rdquo;
            </p>
          </div>

          <div className="call-card-actions">
            <div className="call-card-actions-label">AI Action</div>
            <ul>
              {flow.actions.map((action, i) => (
                <li
                  key={action}
                  className="call-card-action"
                  style={{ transitionDelay: `${120 + i * 100}ms` }}
                >
                  <Check size={14} weight="bold" aria-hidden />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="call-card-foot" key={`foot-${contentKey}`}>
        <span>{flow.saved}</span>
      </div>
    </div>
  );
}
