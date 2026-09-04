"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Calculator,
  CalendarBlank,
  ChartBar,
  ChartLineUp,
  Clock,
  Package,
  ShoppingCart,
  TrendDown,
} from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";
import {
  calculateLoss,
  deriveAbandonedCheckouts,
  formatInr,
} from "@/lib/calculator";
import { scrollToSection } from "@/lib/utils";

const PLAN_FEATURES = [
  "COD verification",
  "NDR re-attempts",
  "Cart recovery",
  "WhatsApp API",
];

function parseField(value: string): number {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }

    let raf = 0;
    const duration = 1000;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);

  return value;
}

export function LossCalculator({ showInlineDemoCta = false }: { showInlineDemoCta?: boolean }) {
  const [aov, setAov] = useState(1500);
  const [cod, setCod] = useState("");
  const [rtoPct, setRtoPct] = useState(0);
  const [cart, setCart] = useState("");
  const [cartManual, setCartManual] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [netPulseKey, setNetPulseKey] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  const scrollToResultsRef = useRef(false);

  const codNum = parseField(cod);
  const cartNum = parseField(cart);

  const invalidateResults = () => setShowResults(false);

  const handleCodChange = (value: string) => {
    if (value !== "" && !/^\d+$/.test(value)) return;
    invalidateResults();
    setCod(value);
    if (!cartManual) {
      const codValue = parseField(value);
      setCart(codValue === 0 ? "" : String(deriveAbandonedCheckouts(codValue)));
    }
  };

  const handleCartChange = (value: string) => {
    if (value !== "" && !/^\d+$/.test(value)) return;
    invalidateResults();
    setCartManual(true);
    setCart(value);
  };

  const handleCalculate = () => {
    if (codNum <= 0) return;
    scrollToResultsRef.current = true;
    setShowResults(true);
    setNetPulseKey((key) => key + 1);
  };

  useEffect(() => {
    if (!showResults || !scrollToResultsRef.current) return;
    scrollToResultsRef.current = false;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!resultsRef.current) return;

    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    });
  }, [showResults]);

  const result = useMemo(
    () => calculateLoss({ aov, cod: codNum, rtoPct, cart: cartNum }),
    [aov, codNum, rtoPct, cartNum]
  );

  const hasInput = codNum > 0;
  const displayResults = showResults && hasInput;
  const netAbs = Math.abs(result.net);
  const animatedNet = useCountUp(netAbs, displayResults);

  const lossRows = [
    {
      id: "rto",
      icon: Package,
      label: "RTO",
      count: `${Math.round(result.rtoOrders).toLocaleString("en-IN")} orders returned`,
      amount: result.rtoLoss,
      note: "Includes orders that failed delivery and came back",
    },
    {
      id: "cart",
      icon: ShoppingCart,
      label: "Abandoned carts",
      count: `${cartNum.toLocaleString("en-IN")} checkouts`,
      amount: result.cartLoss,
      note: "Revenue never collected at checkout",
    },
  ];

  return (
    <section className="sec" id="calc">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">Your number, not a benchmark</div>
          <h2>See what you&apos;re losing every month.</h2>
        </Reveal>

        <Reveal className="calc">
          <div className="calc-in">
            <div className="calc-in-head">
              <Calculator size={18} weight="bold" aria-hidden />
              <div>
                <strong>Your store numbers</strong>
                <span>Adjust sliders or type exact values</span>
              </div>
            </div>

            <div className="calc-in-body">
              <div className="numfield">
                <label htmlFor="cod">COD orders shipped / month</label>
                <input
                  type="number"
                  id="cod"
                  inputMode="numeric"
                  value={cod}
                  min={0}
                  placeholder="e.g. 1500"
                  onChange={(e) => handleCodChange(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="rtopct">
                  RTO rate <span className="val">{rtoPct}%</span>
                </label>
                <input
                  type="range"
                  id="rtopct"
                  min={0}
                  max={60}
                  step={1}
                  value={rtoPct}
                  onChange={(e) => {
                    invalidateResults();
                    setRtoPct(+e.target.value);
                  }}
                />
              </div>

              <div className="field">
                <label htmlFor="aov">
                  Avg. order value <span className="val">{formatInr(aov)}</span>
                </label>
                <input
                  type="range"
                  id="aov"
                  min={400}
                  max={6000}
                  step={50}
                  value={aov}
                  onChange={(e) => {
                    invalidateResults();
                    setAov(+e.target.value);
                  }}
                />
              </div>

              <div className="numfield">
                <label htmlFor="cart">Abandoned checkouts / month</label>
                <div className="numfield-input-wrap">
                  <input
                    type="number"
                    id="cart"
                    inputMode="numeric"
                    value={cart}
                    min={0}
                    placeholder={cartManual ? "e.g. 900" : ""}
                    onChange={(e) => handleCartChange(e.target.value)}
                  />
                  {!cartManual && cart !== "" ? (
                    <span className="numfield-approx">approx</span>
                  ) : null}
                </div>
              </div>

              <p className="calc-field-hint calc-in-span">
                Failed deliveries that eventually return are counted in RTO — not separately.
              </p>

              <button
                type="button"
                className="btn btn-primary calc-submit"
                onClick={handleCalculate}
                disabled={!hasInput}
              >
                Calculate my loss
              </button>
            </div>

            <details className="assump calc-in-foot">
              <summary>How this is calculated</summary>
              <p>
                Shipped-order loss uses ~₹525 per RTO (forward + reverse freight, packaging,
                and ad spend). Abandoned cart loss uses your AOV. Recovery ranges from 150+
                brands: 20–40% fewer RTOs via pre-dispatch verification, 10–15% cart recovery.
                NDR re-attempts help before an order becomes RTO — they&apos;re not double-counted
                as a separate loss line.
              </p>
            </details>
          </div>

          <div className="calc-out" id="calc-results" ref={resultsRef}>
            {!displayResults ? (
              <div className="calc-out-empty">
                <TrendDown size={32} weight="duotone" aria-hidden />
                <p>
                  {hasInput
                    ? "Click Calculate my loss to see your monthly numbers."
                    : "Enter COD orders, then click Calculate my loss."}
                </p>
              </div>
            ) : (
              <div className="calc-out-body">
                <div className="calc-out-board">
                  <div className="calc-out-hero">
                    <div className="calc-out-hero-top">
                      <span className="out-label">Estimated monthly loss</span>
                      <TrendDown size={20} weight="bold" aria-hidden />
                    </div>
                    <div className="big-loss">{formatInr(result.totalLoss)}</div>
                    <p className="calc-out-hero-note">
                      Revenue lost to RTO returns and abandoned checkouts
                    </p>
                  </div>

                  <div className="calc-out-panel">
                    <p className="calc-out-panel-title">Where it comes from</p>
                    <ul className="calc-loss-rows">
                      {lossRows.map((row) => {
                        const Icon = row.icon;
                        return (
                          <li className="calc-loss-row" key={row.id}>
                            <span className="calc-loss-icon" aria-hidden>
                              <Icon size={16} weight="bold" />
                            </span>
                            <div className="calc-loss-copy">
                              <strong>{row.label}</strong>
                              <span>{row.count}</span>
                              <span className="calc-loss-note">{row.note}</span>
                            </div>
                            <span className="calc-loss-amt">{formatInr(row.amount)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="calc-out-panel">
                    <p className="calc-out-panel-title">What you can recover</p>
                    <div className="calc-stat-card">
                      <span className="calc-stat-kicker">Typical range</span>
                      <div className="calc-stat-range">
                        {formatInr(result.recLo)} – {formatInr(result.recHi)}
                      </div>
                      <div className="rangebar">
                        <div
                          className="rangefill"
                          style={{ width: `${result.fillPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="calc-stat-card calc-stat-card-gain">
                      <span className="calc-stat-kicker">Recover Agent estimate</span>
                      <div className="calc-stat-gain">+{formatInr(result.recMid)}</div>
                    </div>
                  </div>

                  <div className="calc-out-outcome">
                    <div className="calc-plan-strip">
                      <div className="calc-plan-top">
                        <details className="plandetail">
                          <summary>
                            <span className="calc-plan-summary-label">
                              Best fit — {result.tier.name}
                            </span>
                            <span className="calc-plan-cost">−{formatInr(result.cost)}/mo</span>
                            <span className="expandhint">why ▾</span>
                          </summary>
                          <p className="plancontext">
                            Lowest-cost tier for {result.totalCalls.toLocaleString("en-IN")} AI
                            voice calls/month (COD verify + cart recovery).
                          </p>
                          <div className="planbreak">
                            <div className="pb">
                              <span>
                                {result.tier.name} base —{" "}
                                {result.tier.includedCalls.toLocaleString("en-IN")} calls included
                              </span>
                              <span>{formatInr(result.baseCost)}</span>
                            </div>
                            {result.overageCalls > 0 ? (
                              <div className="pb">
                                <span>
                                  Extra usage — {result.overageCalls.toLocaleString("en-IN")} extra
                                  calls × ₹{result.tier.overagePerOrder}
                                </span>
                                <span>{formatInr(result.overageCost)}</span>
                              </div>
                            ) : (
                              <div className="pb">
                                <span>All calls covered in included volume</span>
                                <span>₹0</span>
                              </div>
                            )}
                          </div>
                        </details>
                        <button
                          type="button"
                          className="calc-plan-link"
                          onClick={() => {
                            trackEvent("pricing_viewed", { source: "calculator" });
                            scrollToSection("plans");
                          }}
                        >
                          Compare plans
                        </button>
                      </div>
                      <ul className="calc-plan-pills">
                        {PLAN_FEATURES.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div key={netPulseKey} className="calc-net-box is-highlight">
                      <span className="calc-net-icon" aria-hidden>
                        <ChartLineUp size={22} weight="bold" />
                      </span>
                      <div className="calc-net-content">
                        <span className="out-label">Extra revenue you keep</span>
                        <div className="calc-net-val is-live">
                          {result.net >= 0 ? "+" : "–"}
                          {formatInr(animatedNet)}
                          <span>/ mo</span>
                        </div>
                        <p className="calc-net-math" aria-label="Net calculation">
                          {formatInr(result.recMid)} recovered — {formatInr(result.cost)} plan ={" "}
                          <strong>
                            {formatInr(Math.abs(result.net))} you keep
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="calc-cta">
                  <a className="btn btn-green calc-cta-btn" href="#demo-booking">
                    <CalendarBlank size={22} weight="regular" aria-hidden />
                    <span className="calc-cta-copy">
                      <span className="calc-cta-title">See how much more you can keep →</span>
                      <span className="calc-cta-sub">
                        Book a 30-min demo to see real impact
                      </span>
                    </span>
                  </a>
                  <ul className="calc-trust-badges" aria-label="Why book a demo">
                    <li>
                      <Clock size={16} weight="regular" aria-hidden />
                      30 min
                    </li>
                    <li>
                      <ChartBar size={16} weight="regular" aria-hidden />
                      Data-backed projection
                    </li>
                  </ul>
                </div>

                {showInlineDemoCta && displayResults && (
                  <a className="calc-inline-link" href="#demo-booking">
                    Or book with these numbers prefilled →
                  </a>
                )}
              </div>
            )}
          </div>
        </Reveal>
      </div>

    </section>
  );
}
