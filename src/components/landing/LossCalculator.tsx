"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CaretDown, ArrowRight } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/Reveal";
import { calculateRecoveryEstimate, formatInr } from "@/lib/calculator";
import { trackEvent } from "@/lib/analytics";
import styles from "./LossCalculator.module.css";

const emptyFields = { orders: "", codPct: "", rtoPct: "", cart: "", aov: "", forwardCost: "70", returnCost: "70", packagingCost: "30", acquisitionCost: "180", extraMonthlyCost: "0", contributionMarginPct: "30", rtoLow: "20", rtoHigh: "40", checkoutLow: "14", checkoutHigh: "18" };
type FieldKey = keyof typeof emptyFields;
const numeric = (value: string) => Number(value);
const count = (value: number) => value.toLocaleString("en-IN", { maximumFractionDigits: 1 });
const orderCount = (value: number) => value.toLocaleString("en-IN", { maximumFractionDigits: 0 });
const orderRange = (a: number, b: number) => orderCount(a) === orderCount(b) ? orderCount(a) : `${orderCount(Math.min(a, b))}–${orderCount(Math.max(a, b))}`;
const moneyRange = (a: number, b: number) => a === b ? formatInr(a) : `${formatInr(Math.min(a, b))} – ${formatInr(Math.max(a, b))}`;

export function LossCalculator({ comparePlansHref }: { showInlineDemoCta?: boolean; comparePlansHref?: string }) {
  const [fields, setFields] = useState(emptyFields);
  const [calculatedFields, setCalculatedFields] = useState<typeof emptyFields | null>(null);
  const [calculatedEdits, setCalculatedEdits] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [example, setExample] = useState(false);
  const [editedFields, setEditedFields] = useState<Partial<Record<FieldKey, boolean>>>({});
  const costsRef = useRef<HTMLDetailsElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const instanceId = useId();
  const cod = Math.round(numeric(fields.orders) * numeric(fields.codPct) / 100);
  const cart = numeric(fields.cart);
  const validField = (key: FieldKey, min = 0, max = 1000000, integer = false) => fields[key].trim() !== "" && Number.isFinite(numeric(fields[key])) && numeric(fields[key]) >= min && numeric(fields[key]) <= max && (!integer || Number.isInteger(numeric(fields[key])));
  const ready = validField("orders", 1, 1000000, true) && validField("codPct", 0, 100)
    && (fields.cart === "" || validField("cart", 0, 1000000, true))
    && (cart <= 0 || validField("aov", 0.01)) && validField("rtoPct", 0, 100)
    && cod + cart > 0
    && validField("forwardCost") && validField("returnCost") && validField("packagingCost")
    && validField("acquisitionCost") && validField("extraMonthlyCost")
    && (cart === 0 || fields.contributionMarginPct === "" || validField("contributionMarginPct", -100, 100))
    && validField("rtoLow", 0, 100) && validField("rtoHigh", 0, 100) && numeric(fields.rtoLow) <= numeric(fields.rtoHigh)
    && (cart === 0 || (validField("checkoutLow", 0, 100) && validField("checkoutHigh", 0, 100) && numeric(fields.checkoutLow) <= numeric(fields.checkoutHigh)));
  const estimateFields = calculatedFields ?? emptyFields;
  const estimatedCod = Math.round(numeric(estimateFields.orders) * numeric(estimateFields.codPct) / 100);
  const estimatedCart = numeric(estimateFields.cart);
  const billingLabel = "orders";
  const hasChanges = calculatedFields !== null && (Object.keys(fields) as FieldKey[]).some(key => fields[key] !== calculatedFields[key]);
  const result = useMemo(() => calculateRecoveryEstimate({
    cod: estimatedCod, cart: estimatedCart, aov: numeric(estimateFields.aov), rtoPct: numeric(estimateFields.rtoPct),
    forwardCost: numeric(estimateFields.forwardCost), returnCost: numeric(estimateFields.returnCost),
    packagingCost: numeric(estimateFields.packagingCost), acquisitionCost: numeric(estimateFields.acquisitionCost),
    extraMonthlyCost: numeric(estimateFields.extraMonthlyCost),
    contributionMarginPct: estimatedCart === 0 ? 0 : estimateFields.contributionMarginPct === "" ? undefined : numeric(estimateFields.contributionMarginPct),
    rtoPreventionRange: [numeric(estimateFields.rtoLow), numeric(estimateFields.rtoHigh)],
    checkoutRecoveryRange: [numeric(estimateFields.checkoutLow), numeric(estimateFields.checkoutHigh)],
  }), [estimateFields, estimatedCod, estimatedCart]);
  const [low, high] = result.outcomes;
  const hasMargin = low.netContribution !== undefined && high.netContribution !== undefined;
  const minNet = hasMargin ? Math.min(low.netContribution!, high.netContribution!) : undefined;
  const maxNet = hasMargin ? Math.max(low.netContribution!, high.netContribution!) : undefined;
  const hasSampleCosts = (["forwardCost", "returnCost", "packagingCost", "acquisitionCost", ...(estimatedCart > 0 ? ["contributionMarginPct"] : [])] as FieldKey[]).some(key => !calculatedEdits[key]);

  useEffect(() => {
    if (!calculatedFields) return;
    const frame = requestAnimationFrame(() => {
      const results = resultsRef.current;
      if (!results) return;
      results.focus({ preventScroll: true });
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      results.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [calculatedFields]);

  useEffect(() => {
    if (!calculatedFields) return;
    const timer = setTimeout(() => trackEvent("calculator_completed", { source: "recovery_estimate" }), 1000);
    return () => clearTimeout(timer);
  }, [calculatedFields]);

  const field = (key: FieldKey, label: string, hint: string, options: { suffix?: string; max?: number; min?: number; integer?: boolean; optional?: boolean; slider?: boolean } = {}) => {
    const { suffix, max = 1000000, min = 0, integer = false, optional = false, slider = false } = options;
    const id = `${instanceId}-${key}`;
    const invalid = fields[key] !== "" && !(key === "aov" && cart <= 0) && !validField(key, min, max, integer);
    return <div className={`${styles.field} ${slider ? styles.sliderField : ""}`} key={key}>
      <label htmlFor={id}>{label}</label>
      {!slider && <div className={styles.inputWrap}>
        <input id={id} type="number" inputMode={integer ? "numeric" : "decimal"} min={min} max={max} step={integer ? 1 : 0.01}
          placeholder={key === "cart" ? "0" : optional ? "" : "Enter value"} value={fields[key]} aria-describedby={invalid || hint ? `${id}-hint` : undefined} aria-invalid={invalid} required={!optional}
          onChange={(event) => { setExample(false); setEditedFields(old => ({ ...old, [key]: true })); setFields((old) => ({ ...old, [key]: event.target.value })); }} />
        {suffix && <span className={styles.suffix} aria-hidden="true">{suffix}</span>}
      </div>}
      {slider && <>
        <div className={styles.percentInput}><input id={id} aria-label={label} type="number" min="0" max="100" step="0.1" inputMode="decimal" placeholder="0" value={fields[key]} aria-invalid={invalid} aria-describedby={invalid || hint ? `${id}-hint` : undefined} onChange={(event) => { setExample(false); setEditedFields(old => ({ ...old, [key]: true })); setFields(old => ({ ...old, [key]: event.target.value })); }} /><span aria-hidden="true">%</span></div>
        <div className={styles.sliderRow}><input aria-label={`${label} slider`} type="range" min="0" max="100" step="1" value={fields[key] === "" ? 0 : fields[key]} onChange={(event) => { setExample(false); setEditedFields(old => ({ ...old, [key]: true })); setFields(old => ({ ...old, [key]: event.target.value })); }} /></div>
      </>}
      {(invalid || hint) && <small id={`${id}-hint`} className={invalid ? styles.error : undefined}>{invalid ? `Enter ${integer ? "a whole number" : "a number"} between ${min} and ${max.toLocaleString("en-IN")}.` : hint}</small>}
    </div>;
  };

  const row = (label: string, now: string, estimated: string) => <tr key={label}><th scope="row">{label}</th><td>{now}</td><td>{estimated}</td></tr>;
  const calculate = () => { if (ready) { setCalculatedFields({ ...fields }); setCalculatedEdits({ ...editedFields }); } };
  const editCosts = () => {
    const costs = costsRef.current;
    if (!costs) return;
    costs.open = true;
    requestAnimationFrame(() => {
      costs.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      costs.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  };

  return <section className={`sec ${styles.section}`} id="calc"><div className="wrap">
    <Reveal className={`sec-head ${styles.heading}`}><div className="eyebrow">Recovery calculator</div><h2>See what recovery means for your store.</h2><p>Enter one month’s numbers. Compare your costs, savings and estimated benefit.</p></Reveal>
    <Reveal className={styles.layout}>
      <form className={styles.inputs} noValidate onSubmit={(event) => { event.preventDefault(); calculate(); }} aria-label="Your recovery calculator inputs">
        <div className={styles.fields}>
          {field("orders", "Total orders/month", "", { integer: true, min: 1 })}
          {field("cart", "Abandoned checkouts", "", { integer: true, optional: true })}
          {field("codPct", "COD %", "", { suffix: "%", max: 100, slider: true })}
          {field("rtoPct", "RTO %", "", { suffix: "%", max: 100, slider: true })}
          {field("aov", "Average order value", "", { suffix: "₹", min: 0.01, optional: cart <= 0 })}
        </div>
        {validField("orders", 1, 1000000, true) && validField("codPct", 0, 100) && <p className={styles.cohortNote}>Based on approximately <strong>{count(cod)} COD orders</strong> per month.</p>}
        <details className={styles.accordion} ref={costsRef}>
          <summary>Your costs per order<CaretDown size={15} /></summary>
          <div className={styles.accordionBody}><p>Sample costs are prefilled. Replace them with yours.</p><div className={styles.fields}>
            {field("forwardCost", "Outbound shipping", "Courier charge to send one order.", { suffix: "₹" })}
            {field("returnCost", "Return shipping", "Courier charge to bring an RTO back.", { suffix: "₹" })}
            {field("packagingCost", "Lost packaging", "Enter 0 if packaging can be reused.", { suffix: "₹" })}
            {field("acquisitionCost", "Acquisition / ad cost", "Spend per COD order. Already paid; not a saving.", { suffix: "₹" })}
            {field("extraMonthlyCost", "Other recovery costs / month", "Messaging, taxes or fees outside your plan.", { suffix: "₹" })}
            {field("contributionMarginPct", "Contribution margin", "After product and fulfilment costs; before recovery fees. Exclude ads already paid.", { suffix: "%", min: -100, max: 100, optional: true })}
          </div></div>
        </details>
        <button className={styles.calculateButton} type="submit" disabled={!ready}>Calculate<ArrowRight size={16} /></button>
        <div className={styles.inputFooter}><span>{hasChanges ? "Click Calculate to update your results." : example ? "Sample numbers. Replace with yours." : "Enter your numbers, then click Calculate."}</span><div>
          <button type="button" onClick={() => { const sample = { ...emptyFields, orders: "1500", codPct: "60", rtoPct: "25", aov: "1200", cart: "600" }; setExample(true); setEditedFields({}); setCalculatedEdits({}); setFields(sample); setCalculatedFields(sample); }}>Try an example</button>
          <button type="button" onClick={() => { setExample(false); setCalculatedFields(null); setEditedFields({}); setFields(emptyFields); }}>Reset</button>
        </div></div>
      </form>
      <aside ref={resultsRef} tabIndex={-1} className={styles.results} aria-label="Your recovery estimate" id="calc-results">
        {!calculatedFields ? <div className={styles.empty}><span className={styles.emptyEyebrow}>Your monthly estimate</span><h3>A clearer picture of your recovery.</h3><p>{cart > 0 && !validField("aov", 0.01) ? "Enter an average order value to estimate abandoned checkout recovery." : "Enter total orders, COD %, RTO %, then click Calculate."}</p><small>Add an abandoned checkout count to include checkout recovery. AOV is needed when the count is above zero.</small></div> : <>
          {hasChanges && <p className={styles.pendingNote} role="status">Inputs changed. Click Calculate to update this estimate.</p>}
          <div className={styles.summary} aria-live="polite" aria-atomic="true">
            <div className={`${styles.keepCard} ${maxNet !== undefined && maxNet < 0 ? styles.keepNegative : minNet !== undefined && minNet < 0 ? styles.keepMixed : ""}`}>
              <span className={styles.keepLabel}>{maxNet !== undefined && maxNet < 0 ? "Monthly shortfall after fees" : minNet !== undefined && minNet < 0 ? "Monthly impact after fees" : "Potential additional profit"}</span>
              <div className={styles.keepAmount}><strong>{hasMargin ? `${minNet! > 0 ? "+" : ""}${moneyRange(low.netContribution!, high.netContribution!)}` : "Add your margin"}</strong><span>/month</span></div>
              {hasMargin && minNet !== maxNet && <small>Illustrative lower–upper recovery scenario.</small>}
              <small>{hasMargin ? "After recovery fees · before fixed overhead" : "Set your checkout contribution margin under costs."}</small><small>{hasSampleCosts ? "Uses sample costs and recovery assumptions. Edit them below." : "Planning estimate using your costs and recovery assumptions."}</small>
            <dl className={styles.keepBreakdown}>
              {hasMargin && <div><dt>{estimatedCart > 0 ? "RTO savings + checkout profit" : "RTO savings before fees"}</dt><dd>{moneyRange(low.netContribution! + result.totalCost, high.netContribution! + result.totalCost)}</dd></div>}
              <div><dt>Minus {result.extraCost > 0 ? "fees & other recovery costs" : "RecoverAgent fee"}</dt><dd>− {formatInr(result.totalCost)}</dd></div>
            </dl>
            </div>
            <div className={styles.planStrip}>
              <strong>{result.plan.tier.name} plan</strong>
              <span>{formatInr(result.plan.cost)} /month</span>
              <Link href={comparePlansHref ?? "/plans"} onClick={() => trackEvent("pricing_viewed", { source: "calculator" })}>Compare plans</Link>
              <details className={styles.planWhy}>
                <summary>Why this plan? <CaretDown size={12} /></summary>
                <div>
                  <p>Lowest-cost plan for {count(result.billedItems)} {billingLabel}/month. Includes {count(result.plan.tier.includedCalls)} {billingLabel}.</p>
                  <p><span>Plan base</span><strong>{formatInr(result.plan.baseCost)}</strong></p>
                  <p><span>{count(result.plan.overageCalls)} additional {billingLabel} × ₹{result.plan.tier.overagePerOrder}</span><strong>{formatInr(result.plan.cost - result.plan.baseCost)}</strong></p>
                  <p>{estimatedCart > 0 ? "Each COD order or abandoned checkout counts once for billing." : "Each COD order counts once for billing."}</p>
                </div>
              </details>
            </div>
          <div className={`${styles.currentLoss} ${styles.lossHeader}`} aria-live="polite" aria-atomic="true"><span>RTO is costing you</span><strong>{formatInr(result.rtoCost)}<span className={styles.monthUnit}>/month</span></strong><small>{formatInr(result.rtoCost * 12)} a year</small></div>
        <details className={styles.resultBreakdown} open><summary>Compare monthly outcomes<CaretDown size={16} /></summary>
          <div className={styles.comparison}>
            <table><caption className={styles.srOnly}>Monthly outcomes before and with recovery</caption><thead><tr><th scope="col">Per month</th><th scope="col">Now</th><th scope="col">With RecoverAgent</th></tr></thead><tbody>
              {row("COD orders", count(estimatedCod), count(estimatedCod))}
              {row("Returned COD orders", orderCount(result.rtoOrders), orderRange(high.remainingRtos, low.remainingRtos))}
              {row("RTO shipping & packaging", formatInr(result.rtoOperatingCost), moneyRange(result.rtoOperatingCost - high.rtoSavings, result.rtoOperatingCost - low.rtoSavings))}
              {row("RTO acquisition spend", formatInr(result.rtoAcquisitionCost), formatInr(result.rtoAcquisitionCost))}
              {estimatedCart > 0 && row("Extra checkouts recovered", "—", orderRange(low.recoveredCheckouts, high.recoveredCheckouts))}
              {estimatedCart > 0 && row("Extra checkout sales", "—", moneyRange(low.recoveredRevenue, high.recoveredRevenue))}
              {estimatedCart > 0 && hasMargin && row("Profit from recovered checkouts", "—", moneyRange(low.recoveredRevenue * numeric(estimateFields.contributionMarginPct) / 100, high.recoveredRevenue * numeric(estimateFields.contributionMarginPct) / 100))}
              {result.extraCost > 0 && row("Other recovery costs", "—", formatInr(result.extraCost))}
            </tbody></table>
            {estimatedCart > 0 && <p className={styles.tableNote}>{count(estimatedCart)} abandoned checkouts per month. Checkout profit is after product and delivery costs. Before RecoverAgent fees. Checkout opportunity: {formatInr(result.checkoutValue)}.</p>}
          </div>
        </details>
        <details className={`${styles.accordion} ${styles.resultAssumptions}`}>
          <summary>{hasSampleCosts ? "Estimate uses sample costs and recovery assumptions." : "Estimate uses your costs and recovery assumptions."}<CaretDown size={13} /></summary>
          <div className={styles.accordionBody}>
            <div className={styles.presets} aria-label="Recovery assumption presets">
              <button type="button" onClick={() => setFields(old => ({ ...old, rtoLow: "10", rtoHigh: "20", checkoutLow: "3", checkoutHigh: "7" }))}>Conservative</button>
              <button type="button" onClick={() => setFields(old => ({ ...old, rtoLow: "20", rtoHigh: "40", checkoutLow: "14", checkoutHigh: "18" }))}>Illustrative</button>
              <button type="button" onClick={() => setFields(old => ({ ...old, rtoLow: "0", rtoHigh: "0", checkoutLow: "0", checkoutHigh: "0" }))}>No improvement</button>
            </div>
            <div className={styles.fields}>
              {field("rtoLow", "RTO reduction · lower", "Relative reduction in returned orders.", { suffix: "%", max: 100 })}
              {field("rtoHigh", "RTO reduction · upper", "Must be at least the lower estimate.", { suffix: "%", max: 100 })}
              {cart > 0 && field("checkoutLow", "Checkout recovery · lower", "Additional delivered, retained orders.", { suffix: "%", max: 100 })}
              {cart > 0 && field("checkoutHigh", "Checkout recovery · upper", "Must be at least the lower estimate.", { suffix: "%", max: 100 })}
            </div>
            {(numeric(fields.rtoLow) > numeric(fields.rtoHigh) || (cart > 0 && numeric(fields.checkoutLow) > numeric(fields.checkoutHigh))) && <p className={styles.rangeError} role="alert">The upper estimate must be at least the lower estimate.</p>}
            <button className={styles.calculateButton} type="button" disabled={!ready} onClick={calculate}>Recalculate<ArrowRight size={16} /></button>
            <p>Illustrative planning ranges, not guaranteed results. Checkout recovery counts extra delivered, retained orders beyond your existing follow-up.</p>
            <p>Enter the number of abandoned checkouts you can contact in one month, excluding duplicates. Checkout opportunity = abandoned checkouts × average order value.</p>
            <p>RTO savings assume failed orders are stopped before dispatch, avoiding outbound shipping, return shipping and lost packaging. Acquisition spend is included in current loss, but cannot be saved.</p>
            <p>Estimated RTO counts use your current shipment cohort. Pre-dispatch cancellations change the future shipment total, so we don’t forecast a new shipment-based RTO rate.</p>
          </div>
        </details>
            <details className={`${styles.accordion} ${styles.estimateDetails}`}>
              <summary>Estimate details<CaretDown size={15} /></summary>
            <p className={styles.costNote}>{hasSampleCosts ? "Some costs are prefilled. " : "Using your inputs. "}{formatInr(result.costPerRto)} shipping & packaging per RTO; {formatInr(result.acquisitionCostPerOrder)} CAC{estimatedCart > 0 && estimateFields.contributionMarginPct !== "" ? `; ${estimateFields.contributionMarginPct}% checkout margin` : ""}. <button type="button" onClick={editCosts}>Edit costs</button></p>
            <p className={styles.summaryNote}>{estimatedCart === 0 ? "RTO savings minus recovery fees. Before fixed overhead." : hasMargin ? `Uses ${estimateFields.contributionMarginPct}% margin on recovered checkout sales. Before fixed overhead.` : "Recovered sales need a margin to estimate their contribution."}</p>
            {minNet !== undefined && minNet < 0 && <p className={styles.summaryNote}>The lower estimate does not cover recovery fees.</p>}
              <p className={styles.summaryNote}>Using {count(low.reduction)}–{count(high.reduction)}% RTO reduction{estimatedCart > 0 ? ` and ${count(low.checkoutRecoveryPct)}–${count(high.checkoutRecoveryPct)}% checkout recovery` : ""}. Planning estimates, not guarantees. Annual figures assume 12 similar months.</p>
            </details>
          </div>
          <div className={styles.resultFooter}><Link href="/book-demo">Review my numbers in a demo<ArrowRight size={16} /></Link><small>30-minute walkthrough</small></div>
        </>}
      </aside>
    </Reveal>
  </div></section>;
}
