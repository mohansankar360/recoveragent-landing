"use client";

import { SpeakerHigh } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { HERO_CALL_FLOWS } from "@/lib/recovery-paths-data";

const ROTATE_MS = 6000;
const FLOW_COUNT = HERO_CALL_FLOWS.length;

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
  const [flowIndex, setFlowIndex] = useState(0);
  const [contentKey, setContentKey] = useState(0);
  const flowIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flow = HERO_CALL_FLOWS[flowIndex];

  const goToFlow = (index: number) => {
    flowIndexRef.current = index;
    setFlowIndex(index);
    setContentKey((k) => k + 1);
  };

  const scheduleNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const next = (flowIndexRef.current + 1) % FLOW_COUNT;
      goToFlow(next);
      scheduleNext();
    }, ROTATE_MS);
  };

  useEffect(() => {
    scheduleNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectFlow = (index: number) => {
    goToFlow(index);
    scheduleNext();
  };

  return (
    <div
      className="call-card call-card--visible"
      id="hero-call"
      aria-label={`AI voice agent demo: ${flow.label}`}
    >
      <div className="call-card-top">
        <span className="call-card-top-label">AI Voice Agent</span>
        <div className="call-card-top-wave" aria-hidden>
          <SpeakerHigh size={16} weight="fill" />
          <Waveform />
        </div>
        <span className="live">
          <i className="blip" aria-hidden />
          Live
        </span>
      </div>

      <div className="call-card-flows" role="tablist" aria-label="Recovery paths">
        {HERO_CALL_FLOWS.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={i === flowIndex}
            className={`call-card-flow${i === flowIndex ? " active" : ""}`}
            onClick={() => selectFlow(i)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="call-card-body">
        <div className="call-card-content" key={contentKey}>
          <div className="call-card-meta">
            <span className="call-card-tag">{flow.tag}</span>
            <span className="call-card-loss">{flow.loss}</span>
          </div>

          <h3 className="call-card-headline">{flow.headline}</h3>
          <p className="call-card-desc">{flow.description}</p>

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

          <div className="call-card-recover">
            Recover with AI → <b>{flow.recover}</b>
          </div>
        </div>
      </div>

      <div className="call-card-foot" key={`foot-${contentKey}`}>
        <span>{flow.saved}</span>
      </div>
    </div>
  );
}
