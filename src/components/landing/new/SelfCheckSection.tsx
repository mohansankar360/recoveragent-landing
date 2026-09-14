"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";

const CHECK_ITEMS = [
  {
    id: "cod",
    label: "COD orders ship before we confirm the customer actually wants them",
    detail: "AI calls before dispatch · confirms intent · flags fake orders",
  },
  {
    id: "cart",
    label: "Abandoned checkouts sit in Shopify with no real follow-up",
    detail: "Voice + WhatsApp recovery within 30 minutes of drop-off",
  },
  {
    id: "ndr",
    label: "NDRs expire because nobody calls the customer in time",
    detail: "Same-day re-attempt calls · address correction · reschedule",
  },
  {
    id: "whatsapp",
    label: "WhatsApp-only recovery gets ignored — customers don't reply",
    detail: "Voice creates urgency · WhatsApp delivers the link after",
  },
  {
    id: "team",
    label: "My ops team manually calls COD customers and still misses orders",
    detail: "AI handles volume · team handles exceptions only",
  },
  {
    id: "rto",
    label: "RTO rate hasn't moved despite trying everything",
    detail: "Typical brands see 24% → 11% RTO shift in 60 days",
  },
  {
    id: "languages",
    label: "Customers speak Hindi, Tamil, Telugu — my team can't cover all of them",
    detail: "6 Indian languages · same brand tone on every call",
  },
];

export function SelfCheckSection() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const count = checked.size;
  const message = useMemo(() => {
    if (count === 0) return "Tick what sounds like your store. Takes 10 seconds.";
    if (count <= 2) return "You're leaking revenue in at least one path.";
    if (count <= 4) return "Multiple leaks — each one costs you every day.";
    return "This is exactly what Recover Agent was built for.";
  }, [count]);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (next.size === 1 && !prev.has(id)) {
        trackEvent("calculator_started", { source: "self_check" });
      }
      return next;
    });
  };

  return (
    <section className="sec" id="fit">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">Self-check · 60 seconds</div>
          <h2>Tap what fits. Honest answers.</h2>
          <p>The more you relate, the more Recover Agent was built for your store.</p>
        </Reveal>

        <Reveal>
          <div className="self-check-progress" aria-live="polite">
            <span className="self-check-count">
              {count} of {CHECK_ITEMS.length}
            </span>
            <span>{message}</span>
          </div>

          <ul className="self-check-list">
            {CHECK_ITEMS.map((item) => {
              const isChecked = checked.has(item.id);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`self-check-item${isChecked ? " is-checked" : ""}`}
                    onClick={() => toggle(item.id)}
                    aria-pressed={isChecked}
                  >
                    <span className="self-check-box" aria-hidden>
                      {isChecked && <Check size={14} weight="bold" />}
                    </span>
                    <span className="self-check-copy">
                      <span className="self-check-label">{item.label}</span>
                      {isChecked && (
                        <span className="self-check-detail">{item.detail}</span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {count > 0 && (
            <div className="self-check-cta">
              <Link className="btn btn-primary" href="/new#calc">
                Show me my ₹ gap →
              </Link>
              <p className="new-trust-line">Free calculator · No signup required</p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
