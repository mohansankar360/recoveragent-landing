"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MANIFEST_ORDERS,
  MANIFEST_SUM,
  MANIFEST_LANGS,
} from "@/lib/manifest-data";
import { formatInr } from "@/lib/calculator";

type StampState = { cls: string; text: string; show: boolean };

function WaveBars() {
  return (
    <span className="wave">
      {[0, 1, 2, 3, 4].map((i) => (
        <i key={i} />
      ))}
    </span>
  );
}

export function ShippingManifest() {
  const rootRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [mode, setMode] = useState("Unverified");
  const [agentOn, setAgentOn] = useState(false);
  const [agentText, setAgentText] = useState("Recover Agent calling · Hindi");
  const [footLabel, setFootLabel] = useState("Money at risk");
  const [total, setTotal] = useState("₹0");
  const [totalCls, setTotalCls] = useState("total loss");
  const [stamps, setStamps] = useState<StampState[]>(
    MANIFEST_ORDERS.map(() => ({ cls: "wait", text: "PENDING", show: true }))
  );

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const at = useCallback((ms: number, fn: () => void) => {
    timersRef.current.push(setTimeout(fn, ms));
  }, []);

  const setStamp = useCallback((index: number, cls: string, text: string) => {
    setStamps((prev) => {
      const next = [...prev];
      next[index] = { cls, text, show: true };
      return next;
    });
  }, []);

  const countTo = useCallback((to: number, cls: string) => {
    const from = 0;
    const dur = 700;
    const t0 = performance.now();
    setTotalCls("total " + cls);
    const step = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      setTotal(formatInr(from + (to - from) * p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const cycle = useCallback(() => {
    clearTimers();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setStamps(MANIFEST_ORDERS.map(() => ({ cls: "wait", text: "PENDING", show: true })));
    setMode("Unverified");
    setAgentOn(false);
    setTotalCls("total loss");
    setTotal("₹0");
    setFootLabel("Money at risk");

    if (reduce) {
      MANIFEST_ORDERS.forEach((o, i) => setStamp(i, "good", o.good));
      setFootLabel("Recovered today");
      setTotalCls("total gain");
      setTotal(formatInr(MANIFEST_SUM));
      return;
    }

    MANIFEST_ORDERS.forEach((o, i) =>
      at(500 + i * 420, () => setStamp(i, "bad", o.bad))
    );
    at(500 + MANIFEST_ORDERS.length * 420 + 200, () => {
      countTo(MANIFEST_SUM, "loss");
      setMode("Leaking");
    });
    at(3400, () => {
      setAgentOn(true);
      setMode("Agent live");
    });
    MANIFEST_ORDERS.forEach((o, i) =>
      at(3800 + i * 480, () => {
        setAgentText("Recover Agent calling · " + MANIFEST_LANGS[i]);
      })
    );
    MANIFEST_ORDERS.forEach((o, i) =>
      at(4200 + i * 480, () => setStamp(i, "good", o.good))
    );
    at(4200 + MANIFEST_ORDERS.length * 480, () => {
      setAgentOn(false);
      setMode("Recovered");
      setFootLabel("Recovered today");
      countTo(MANIFEST_SUM, "gain");
    });
    at(11500, cycle);
  }, [at, clearTimers, countTo, setStamp]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) cycle();
          else clearTimers();
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [cycle, clearTimers]);

  return (
    <div className="manifest" id="manifest" ref={rootRef}>
      <div className="manifest-top">
        <span>Dispatch manifest · Today</span>
        <span className="live">
          <i className="blip" /> {mode}
        </span>
      </div>
      <div className={`agent-bar${agentOn ? " on" : ""}`}>
        <WaveBars />
        <span>{agentText}</span>
      </div>
      <div className="rows">
        {MANIFEST_ORDERS.map((order, i) => (
          <div className="row" key={order.awb}>
            <div className="row-l">
              <div className="awb">{order.awb}</div>
              <div className="place">{order.place}</div>
            </div>
            <div className="row-r">
              <div className="amt">{formatInr(order.amt)}</div>
              <div className={`stamp ${stamps[i].cls}${stamps[i].show ? " show" : ""}`}>
                {stamps[i].text}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="manifest-foot">
        <span>{footLabel}</span>
        <span className={totalCls}>{total}</span>
      </div>
    </div>
  );
}
