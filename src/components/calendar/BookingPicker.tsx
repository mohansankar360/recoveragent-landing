"use client";
import Link from "next/link";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { normalizeWhatsAppNumber, qualifiesForDemoCalendar, type DemoFormData } from "@/lib/demo-booking";
import { clearDemoBookingSession, readDemoBookingSession } from "@/lib/demo-booking-session";
import { formatBookingDate, formatBookingTime, istDate } from "@/lib/calendar-slots";
import { trackEvent } from "@/lib/analytics";
import { generateMetaEventId, getMetaBrowserIds } from "@/lib/meta-pixel";
import { getEngagementSnapshot } from "@/lib/visitor-engagement";
import styles from "./CalendarPageClient.module.css";
type Availability = { days: string[]; slots: string[] };
type Booking = { uid: string; status: string; start: string };
export function BookingPicker({ prefill, onEdit }: { prefill?: DemoFormData | null; onEdit?: () => void }) {
  const [details, setDetails] = useState<DemoFormData | null | undefined>(prefill);
  const [availability, setAvailability] = useState<Availability>({ days: [], slots: [] });
  const [day, setDay] = useState("");
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const submitting = useRef(false);
  // "None of these work?": the visitor types a time and the team confirms it on WhatsApp.
  const [suggesting, setSuggesting] = useState(false);
  const [requestedTime, setRequestedTime] = useState("");
  const [timeRequested, setTimeRequested] = useState("");
  const refresh = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/calendar", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setAvailability(data);
      setDay(current => data.days.includes(current) ? current : data.days[0] ?? "");
      setSelected(current => data.slots.includes(current) ? current : "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try loading available times again.");
      setAvailability({ days: [], slots: [] }); setDay(""); setSelected("");
    } finally { setLoading(false); }
  }, []);
  useEffect(() => {
    setDetails(prefill ?? readDemoBookingSession()); void refresh();
    const timer = window.setInterval(() => { if (!submitting.current) void refresh(); }, 60000);
    return () => window.clearInterval(timer);
  }, [refresh, prefill]);
  async function confirm() {
    if (!details || !selected || submitting.current || booking) return;
    submitting.current = true; setBusy(true); setError("");
    try {
      const response = await fetch("/api/calendar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ details, start: selected, confirmed: true }) });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) { await refresh(); setSelected(""); }
        throw new Error(result.error);
      }
      setBooking(result); clearDemoBookingSession();
      if (result.status === "accepted") {
        const eventId = generateMetaEventId();
        trackEvent("demo_scheduled", { event_id: eventId, start_time: result.start });
        void fetch("/api/demo-scheduled", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ metaEventId: eventId, ...getMetaBrowserIds(), name: details.name, email: details.email, phone: normalizeWhatsAppNumber(details.whatsapp), startTime: result.start }) }).catch(() => {});
      }
    } catch (err) { setError(err instanceof Error ? err.message : "We couldn’t confirm your booking. Please check your email before trying again."); }
    finally { submitting.current = false; setBusy(false); }
  }
  async function requestTime(e: FormEvent) {
    e.preventDefault();
    const time = requestedTime.trim();
    if (!details || submitting.current) return;
    if (time.length < 2) { setError("Please tell us a day and time that suits you."); return; }
    submitting.current = true; setBusy(true); setError("");
    try {
      const response = await fetch("/api/demo-lead/time-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ details, requestedTime: time, engagement: getEngagementSnapshot() }) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error);
      setTimeRequested(time); clearDemoBookingSession(); trackEvent("demo_time_requested");
    } catch (err) { setError(err instanceof Error && err.message ? err.message : "We couldn’t send your request. Please try again or call us."); }
    finally { submitting.current = false; setBusy(false); }
  }
  return <div className={`${styles.card} ${onEdit ? styles.inline : ""}`} aria-busy={loading || busy}>
    {timeRequested && details ? <div className={styles.success} role="status">
      <span className={styles.check}>✓</span><p className={styles.eyebrow}>REQUEST RECEIVED</p>
      <h2>We’ll confirm your time on WhatsApp.</h2>
      <p>You asked for <strong>{timeRequested}</strong>.</p><p>Our team will message you on <strong>+91 {details.whatsapp.replace(/\D/g, "").slice(-10).replace(/(\d{5})(\d{5})/, "$1 $2")}</strong> to lock it in and send your calendar invitation.</p>
    </div> : booking ? <div className={styles.success} role="status">
      <span className={styles.check}>✓</span><p className={styles.eyebrow}>{booking.status === "accepted" ? "YOU’RE ALL SET" : "REQUEST RECEIVED"}</p>
      <h2>{booking.status === "accepted" ? "Your demo is booked." : "Your demo is awaiting confirmation."}</h2>
      <p>{formatBookingDate(booking.start)} IST</p><p>Check <strong>{details?.email}</strong> for your calendar invitation and meeting details.</p>
    </div> : <>
      <p className={styles.eyebrow}>RECOVER AGENT · LIVE DEMO</p><h2>Choose your demo time.</h2>
      <p className={styles.muted}>30 minutes · Google Meet<br />All times are in India Standard Time (IST).</p>
      {details === undefined ? <p role="status">Loading your details…</p> : !details || !qualifiesForDemoCalendar(details) ? <div className={styles.notice}><p>Start with your store details so we can prepare for your call.</p><Link href="/book-demo" className={styles.confirm}>Enter demo details →</Link></div> : <>
        <fieldset disabled={busy || loading} className={styles.fieldset}><legend>1. Choose a day</legend><div className={styles.days}>
          {availability.days.map(date => { const value = new Date(`${date}T12:00:00+05:30`); const today = istDate(new Date()); const tomorrow = istDate(new Date(Date.now() + 86400000)); return <button key={date} type="button" aria-pressed={day === date} onClick={() => { setDay(date); setSelected(""); }}><small>{date === today ? "Today" : date === tomorrow ? "Tomorrow" : value.toLocaleDateString("en-IN", { weekday: "short", timeZone: "Asia/Kolkata" })}</small><strong>{value.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })}</strong></button>; })}
        </div></fieldset>
        <fieldset disabled={busy || loading} className={styles.fieldset}><legend>2. Pick a time</legend><div className={styles.times}>
          {availability.slots.filter(start => day && istDate(new Date(start)) === day).map(start => <button key={start} type="button" aria-pressed={selected === start} onClick={() => setSelected(start)}>{formatBookingTime(start)}</button>)}
        </div>{loading && <p className={styles.muted} role="status">Checking available times…</p>}{!loading && !availability.days.length && !error && <p className={styles.muted}>No times are available in the next few days. Suggest a time below and we’ll arrange your call.</p>}</fieldset>
        {suggesting ? <form className={styles.suggest} onSubmit={e => void requestTime(e)}>
          <label htmlFor="demo-requested-time">When suits you?</label>
          <input id="demo-requested-time" value={requestedTime} maxLength={200} disabled={busy} onChange={e => setRequestedTime(e.target.value)} placeholder="e.g. Saturday 6 PM, or any weekday after 5 PM" autoFocus />
          <p>Our team will confirm it with you on WhatsApp.</p>
          <div><button type="submit" className={styles.confirm} disabled={busy || requestedTime.trim().length < 2}>{busy ? "Sending…" : "Send request"}</button>
          <button type="button" className={styles.edit} disabled={busy} onClick={() => { setSuggesting(false); setError(""); }}>Back to available times</button></div>
        </form> : <button type="button" className={styles.suggestToggle} disabled={busy} onClick={() => { setSuggesting(true); setSelected(""); setError(""); }}>None of these work? <span>Suggest a time →</span></button>}
        <div className={styles.summary}><span>Booking for</span><strong>{details.name}</strong><p>{details.email}</p>{selected && <p className={styles.selection}>{formatBookingDate(selected)} IST</p>}
          {onEdit ? <button type="button" className={styles.edit} disabled={busy} onClick={onEdit}>← Edit your details</button> : <Link href="/book-demo">Edit your details</Link>}
        </div>
        {!suggesting && <><button type="button" className={styles.confirm} disabled={!selected || busy || loading} onClick={() => void confirm()}>{busy ? "Confirming your booking…" : "Confirm demo time →"}</button>
        <p className={styles.footnote}>Your details will be shared with Cal.com to book your call. You’ll receive a calendar invitation by email.</p></>}
      </>}
      {error && <div className={styles.error} role="alert"><p>{error}</p><button type="button" disabled={busy || loading} onClick={() => void refresh()}>Reload available times</button></div>}
      <p className={styles.help}>Need a hand? <a href="tel:+919788274333">Call +91 97882 74333</a></p>
    </>}
  </div>;
}
