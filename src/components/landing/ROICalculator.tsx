"use client";

import { useState, useEffect, useRef } from "react";
import { FadeIn } from "@/components/ui/AnimatedCounter";
import {
  calculateRTOLoss,
  formatIndianCurrency,
  formatNumber,
  scrollToSection,
} from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function ROICalculator() {
  const [monthlyOrders, setMonthlyOrders] = useState(5000);
  const [codPercent, setCodPercent] = useState(60);
  const [rtoPercent, setRtoPercent] = useState(15);
  const [averageOrderValue, setAverageOrderValue] = useState(1500);
  const [hasInteracted, setHasInteracted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hasTrackedView = useRef(false);

  const results = calculateRTOLoss({
    monthlyOrders,
    codPercent,
    rtoPercent,
    averageOrderValue,
  });

  useEffect(() => {
    if (hasInteracted && !hasTrackedView.current) {
      trackEvent("calculator_started");
      hasTrackedView.current = true;
    }
  }, [hasInteracted]);

  useEffect(() => {
    if (hasInteracted) {
      trackEvent("calculator_completed", {
        monthly_orders: monthlyOrders,
        cod_percent: codPercent,
        rto_percent: rtoPercent,
        aov: averageOrderValue,
        value_at_risk: results.grossOrderValueAtRisk,
      });
    }
  }, [monthlyOrders, codPercent, rtoPercent, averageOrderValue, hasInteracted, results.grossOrderValueAtRisk]);

  const handleInteraction = () => {
    if (!hasInteracted) setHasInteracted(true);
  };

  const handleCTA = () => {
    trackEvent("calculator_cta_clicked");
    scrollToSection("demo-booking");
  };

  return (
    <section id="calculator" ref={sectionRef} className="section-padding border-y border-line bg-canvas-panel">
      <div className="container-narrow">
        <FadeIn>
          <h2 className="text-left text-3xl font-bold tracking-tighter text-ink sm:text-4xl lg:text-5xl">
            How much are you
            <span className="block text-ink-muted">losing to RTO?</span>
          </h2>
          <p className="mt-4 max-w-lg text-ink-muted">
            Estimate the order value at risk from RTO on your COD orders each month.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-6 ops-panel p-6 sm:p-8">
              <SliderInput
                label="Monthly Orders"
                value={monthlyOrders}
                min={500}
                max={50000}
                step={500}
                display={formatNumber(monthlyOrders)}
                onChange={(v) => {
                  handleInteraction();
                  setMonthlyOrders(v);
                }}
              />
              <SliderInput
                label="COD %"
                value={codPercent}
                min={10}
                max={90}
                step={5}
                display={`${codPercent}%`}
                onChange={(v) => {
                  handleInteraction();
                  setCodPercent(v);
                }}
              />
              <SliderInput
                label="Current RTO %"
                value={rtoPercent}
                min={5}
                max={40}
                step={1}
                display={`${rtoPercent}%`}
                onChange={(v) => {
                  handleInteraction();
                  setRtoPercent(v);
                }}
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-muted">
                  Average Order Value
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint">₹</span>
                  <input
                    type="number"
                    value={averageOrderValue}
                    min={300}
                    max={10000}
                    step={100}
                    onChange={(e) => {
                      handleInteraction();
                      setAverageOrderValue(Number(e.target.value) || 0);
                    }}
                    className="w-full rounded-lg border border-line bg-canvas px-4 py-3 pl-8 text-ink outline-none transition-colors focus:border-ink-faint"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between ops-panel border-ops-loss/20 bg-ops-loss-bg/30 p-6 sm:p-8">
              <div className="space-y-4">
                <ResultRow
                  label="Monthly COD orders"
                  value={formatNumber(results.monthlyCodOrders)}
                />
                <ResultRow
                  label="RTO orders"
                  value={formatNumber(results.rtoOrders)}
                />
                <ResultRow
                  label="Gross order value at risk"
                  value={formatIndianCurrency(results.grossOrderValueAtRisk)}
                  highlight
                />
              </div>

              <div className="mt-8">
                <p className="text-2xl font-bold leading-tight text-ink sm:text-3xl">
                  {formatIndianCurrency(results.grossOrderValueAtRisk)} of order value
                  potentially at risk every month.
                </p>
                <p className="mt-4 text-sm text-ink-muted">
                  This is <strong className="text-ink">order value at risk</strong>, not
                  guaranteed recoverable revenue. RecoverAgent helps you systematically intervene
                  before COD orders become RTO.
                </p>
                <button
                  onClick={handleCTA}
                  className="mt-6 w-full rounded-full bg-brand py-3.5 text-base font-medium text-white transition-all hover:bg-brand-dark active:scale-[0.98] sm:w-auto"
                >
                  See How RecoverAgent Can Recover This
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-ink-muted">{label}</label>
        <span className="font-mono text-sm text-ink">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function ResultRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-line pb-3">
      <span className="text-sm text-ink-muted">{label}</span>
      <span
        className={`font-mono text-sm ${highlight ? "text-lg font-bold text-ops-loss" : "text-ink"}`}
      >
        {value}
      </span>
    </div>
  );
}
