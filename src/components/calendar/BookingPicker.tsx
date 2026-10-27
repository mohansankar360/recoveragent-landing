"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeWhatsAppNumber, qualifiesForDemoCalendar, type DemoFormData } from "@/lib/demo-booking";
import { clearDemoBookingSession, readDemoBookingSession } from "@/lib/demo-booking-session";
import { bookingDays, BOOKING_TIMES, formatBookingDate, slotStart } from "@/lib/calendar-slots";
import { trackEvent } from "@/lib/analytics";
import { generateMetaEventId } from "@/lib/meta-pixel";
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
        void fetch("/api/demo-scheduled", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ metaEventId: eventId, name: details.name, email: details.email, phone: normalizeWhatsAppNumber(details.whatsapp), startTime: result.start }) }).catch(() => {});
      }
    } catch (err) { setError(err instanceof Error ? err.message : "We couldn’t confirm your booking. Please check your email before trying again."); }
    finally { submitting.current = false; setBusy(false); }
  }
  return <div className={`${styles.card} ${onEdit ? styles.inline : ""}`} aria-busy={loading || busy}>
    {booking ? <div className={styles.success} role="status">
      <span className={styles.check}>✓</span><p className={styles.eyebrow}>{booking.status === "accepted" ? "YOU’RE ALL SET" : "REQUEST RECEIVED"}</p>
      <h2>{booking.status === "accepted" ? "Your discovery call is booked." : "Your call is awaiting confirmation."}</h2>
      <p>{formatBookingDate(booking.start)} IST</p><p>Check <strong>{details?.email}</strong> for your calendar invitation and meeting details.</p>
    </div> : <>
      <p className={styles.eyebrow}>RECOVER AGENT · DISCOVERY CALL</p><h2>Choose your demo time.</h2>
      <p className={styles.muted}>30 minutes · Google Meet<br />All times are in India Standard Time (IST).</p>
      {details === undefined ? <p role="status">Loading your details…</p> : !details || !qualifiesForDemoCalendar(details) ? <div className={styles.notice}><p>Start with your store details so we can prepare for your call.</p><Link href="/book-demo" className={styles.confirm}>Enter demo details →</Link></div> : <>
        <fieldset disabled={busy || loading} className={styles.fieldset}><legend>1. Choose a day</legend><div className={styles.days}>
          {availability.days.map(date => { const value = new Date(`${date}T12:00:00+05:30`); const days = bookingDays(); return <button key={date} type="button" aria-pressed={day === date} onClick={() => { setDay(date); setSelected(""); }}><small>{date === days[0] ? "Today" : date === days[1] ? "Tomorrow" : value.toLocaleDateString("en-IN", { weekday: "short", timeZone: "Asia/Kolkata" })}</small><strong>{value.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })}</strong></button>; })}
        </div></fieldset>
        <fieldset disabled={busy || loading} className={styles.fieldset}><legend>2. Pick a time</legend><div className={styles.times}>
          {BOOKING_TIMES.filter(time => day && availability.slots.includes(slotStart(day, time))).map(time => { const start = slotStart(day, time); return <button key={time} type="button" aria-pressed={selected === start} onClick={() => setSelected(start)}>{time === "12:30" ? "12:30 PM" : "4:00 PM"}<small>Available</small></button>; })}
        </div>{loading && <p className={styles.muted} role="status">Checking available times…</p>}{!loading && !availability.days.length && !error && <p className={styles.muted}>No times are available in the next three days. Please contact us to arrange your call.</p>}</fieldset>
        <div className={styles.summary}><span>Booking for</span><strong>{details.name}</strong><p>{details.email}</p>{selected && <p className={styles.selection}>{formatBookingDate(selected)} IST</p>}
          {onEdit ? <button type="button" className={styles.edit} disabled={busy} onClick={onEdit}>← Edit your details</button> : <Link href="/book-demo">Edit your details</Link>}
        </div>
        <button type="button" className={styles.confirm} disabled={!selected || busy || loading} onClick={() => void confirm()}>{busy ? "Confirming your booking…" : "Confirm discovery call →"}</button>
        <p className={styles.footnote}>Your details will be shared with Cal.com to book your call. You’ll receive a calendar invitation by email.</p>
      </>}
      {error && <div className={styles.error} role="alert"><p>{error}</p><button type="button" disabled={busy || loading} onClick={() => void refresh()}>Reload available times</button></div>}
      <p className={styles.help}>Need a hand? <a href="tel:+919788274333">Call +91 97882 74333</a></p>
    </>}
  </div>;
}
