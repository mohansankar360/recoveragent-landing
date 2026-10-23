"use client";

import { FormEvent, useState } from "react";
import { BookingPicker } from "@/components/calendar/BookingPicker";
import type { DemoFormData } from "@/lib/demo-booking";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChartBar,
  EnvelopeSimple,
  Globe,
  Phone,
  Storefront,
  User,
} from "@phosphor-icons/react";
import { trackEvent } from "@/lib/analytics";
import {
  MONTHLY_ORDERS_OPTIONS,
  STORE_PLATFORM_OPTIONS,
  UNSUPPORTED_PLATFORM_MESSAGE,
} from "@/lib/demo-booking";
import { saveDemoBookingSession } from '@/lib/demo-booking-session';
import { getDisqualificationMessage, getStoreUrlValidationError, normalizeStoreUrl, qualifiesForDemoCalendar } from '@/lib/demo-booking';
import { generateMetaEventId } from "@/lib/meta-pixel";
import { appleFade, appleSpring } from "@/lib/motion";

interface LeadFormData {
  name: string;
  whatsapp: string;
  email: string;
  monthlyOrders: string;
  storePlatform: string;
  storeUrl: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Shown on the trial form to stores below 500 orders a month.
const TRIAL_LOW_VOLUME_MESSAGE =
  "The 14-day free trial is for stores doing 500+ orders a month. We can still help you reduce RTO with our WhatsApp service — our team will call you soon.";

function validateField(
  field: keyof LeadFormData,
  value: string,
  collectStoreUrl: boolean
): string | undefined {
  const trimmed = value.trim();

  switch (field) {
    case "name":
      if (!trimmed) return "Name is required";
      return undefined;
    case "whatsapp":
      if (!trimmed) return "WhatsApp number is required";
      if (!/^[6-9]\d{9}$/.test(trimmed.replace(/\D/g, ""))) {
        return "Enter a valid 10-digit mobile number";
      }
      return undefined;
    case "email":
      if (!trimmed) return "Email is required";
      if (!EMAIL_PATTERN.test(trimmed)) return "Enter a valid email address";
      return undefined;
    case "monthlyOrders":
      if (!trimmed) return "Select your monthly order volume";
      return undefined;
    case "storePlatform":
      if (!trimmed) return "Select your store platform";
      return undefined;
    case "storeUrl":
      return collectStoreUrl ? getStoreUrlValidationError(value) : undefined;
    default:
      return undefined;
  }
}

function validateAll(form: LeadFormData, collectStoreUrl: boolean): Partial<LeadFormData> {
  const next: Partial<LeadFormData> = {};
  (Object.keys(form) as (keyof LeadFormData)[]).forEach((field) => {
    const error = validateField(field, form[field], collectStoreUrl);
    if (error) next[field] = error;
  });
  return next;
}

export function LeadCaptureForm({ mode = "demo" }: { mode?: "demo" | "trial" }) {
  const isTrial = mode === "trial";
  const [form, setForm] = useState<LeadFormData>({
    name: "",
    whatsapp: "",
    email: "",
    monthlyOrders: "",
    storePlatform: "",
    storeUrl: "",
  });
  const [errors, setErrors] = useState<Partial<LeadFormData>>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof LeadFormData, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarPrefill, setCalendarPrefill] = useState<DemoFormData | null>(null);
  const [isUnsupportedPlatform, setIsUnsupportedPlatform] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [onboardingRequested, setOnboardingRequested] = useState(false);

  const handleChange = (field: keyof LeadFormData, value: string) => {
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent("lead_form_started");
    }

    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field] || touched[field]) {
      const error = validateField(field, value, isTrial);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof LeadFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field], isTrial);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting || calendarPrefill) return;

    const nextErrors = validateAll(form, isTrial);
    setErrors(nextErrors);
    setTouched(
      (Object.keys(form) as (keyof LeadFormData)[]).reduce(
        (acc, field) => {
          acc[field] = true;
          return acc;
        },
        {} as Partial<Record<keyof LeadFormData, boolean>>
      )
    );

    if (Object.keys(nextErrors).length > 0) return;

    if (form.storePlatform === "other") {
      setIsUnsupportedPlatform(true);
      return;
    }

    setIsSubmitting(true);

    const metaEventId = generateMetaEventId();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.replace(/\D/g, "").slice(0, 10),
      monthlyOrders: form.monthlyOrders,
      storePlatform: form.storePlatform,
      storeUrl: isTrial ? normalizeStoreUrl(form.storeUrl) : 'To be shared on call',
      preferredLanguage: 'english-or-hindi',
    };
    setSubmitError(null);
    try {
      const response = await fetch('/api/demo-lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, metaEventId }) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error ?? 'Could not save your details. Please try again.');
      if (!qualifiesForDemoCalendar(payload)) {
        trackEvent("lead_form_submitted", {
          monthly_orders: form.monthlyOrders,
          store_platform: form.storePlatform,
          qualifies: false,
          event_id: metaEventId,
        });
        setOnboardingRequested(true); setIsSubmitting(false); return;
      }
      saveDemoBookingSession(payload);
      setCalendarPrefill(payload);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not save your details. Please try again.');
      setIsSubmitting(false);
      return;
    }

    trackEvent("lead_form_submitted", {
      monthly_orders: form.monthlyOrders,
      store_platform: form.storePlatform,
      qualifies: true,
      event_id: metaEventId,
    });

    setIsSubmitting(false);



  };

  return (
    <div className="lead-form-card">
      <AnimatePresence mode="wait" initial={false}>
        {onboardingRequested ? <div className="lead-form-success" role="status"><p className="lead-form-success-title">Your onboarding request is received.</p><p>{isTrial ? TRIAL_LOW_VOLUME_MESSAGE : getDisqualificationMessage(form)}</p></div> : isUnsupportedPlatform ? (
          <motion.div
            key="unsupported-platform"
            className="lead-form-success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={appleFade}
            role="status"
            aria-live="polite"
          >
            <p className="lead-form-success-title">This platform is not supported.</p>
            <p className="lead-form-success-copy">{UNSUPPORTED_PLATFORM_MESSAGE}</p>
          </motion.div>
        ) : calendarPrefill ? (
          <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={appleFade}>
            <BookingPicker prefill={calendarPrefill} onEdit={() => setCalendarPrefill(null)} />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={appleFade}
          >
            <div className="lead-form-badge">{isTrial ? "No setup fee" : "Free demo"}</div>
            <div className="lead-form-head">
              <h2>{isTrial ? "Start your 14-day free trial" : "See Recover Agent in Action"}</h2>
              <p>
                {isTrial
                  ? "Share your details, then pick a time for your setup call."
                  : "Share your details, then choose a time for your 30-minute demo."}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="lead-form-fields">
              <IconSelectField
                id="lead-orders"
                label="Monthly orders"
                icon={ChartBar}
                value={form.monthlyOrders}
                error={errors.monthlyOrders}
                onChange={(v) => handleChange("monthlyOrders", v)}
                onBlur={() => handleBlur("monthlyOrders")}
                placeholder="Choose volume"
                options={MONTHLY_ORDERS_OPTIONS.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
              />

              <IconSelectField
                id="lead-platform"
                label="Store platform"
                icon={Storefront}
                value={form.storePlatform}
                error={errors.storePlatform}
                onChange={(v) => handleChange("storePlatform", v)}
                onBlur={() => handleBlur("storePlatform")}
                placeholder="Platform"
                options={STORE_PLATFORM_OPTIONS.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
              />
              {isTrial && (
                <IconField
                  id="lead-store-url"
                  label="Store website"
                  icon={Globe}
                  value={form.storeUrl}
                  error={errors.storeUrl}
                  onChange={(v) => handleChange("storeUrl", v)}
                  onBlur={() => handleBlur("storeUrl")}
                  placeholder="yourstore.com"
                  autoComplete="url"
                  inputMode="url"
                />
              )}
              <IconField
                id="lead-name"
                label="Full name"
                icon={User}
                value={form.name}
                error={errors.name}
                onChange={(v) => handleChange("name", v)}
                onBlur={() => handleBlur("name")}
                placeholder="Your name"
                autoComplete="name"
              />

              <PhoneField
                id="lead-whatsapp"
                label="WhatsApp number"
                value={form.whatsapp}
                error={errors.whatsapp}
                onChange={(v) => handleChange("whatsapp", v)}
                onBlur={() => handleBlur("whatsapp")}
              />

              <IconField
                id="lead-email"
                label="Email"
                icon={EnvelopeSimple}
                value={form.email}
                error={errors.email}
                onChange={(v) => handleChange("email", v)}
                onBlur={() => handleBlur("email")}
                type="email"
                autoComplete="email"
                inputMode="email"
              />

              {submitError && <p role="alert" className="lead-field-msg">{submitError}</p>}
              <button
                type="submit"
                className="btn btn-green lead-form-submit"
                disabled={isSubmitting || !!calendarPrefill || form.storePlatform === 'other'}
              >
                {isSubmitting ? "Saving…" : form.monthlyOrders === '0-500' ? 'Request an onboarding call' : isTrial ? 'Start free trial: choose setup time →' : 'Continue to choose a time →'}
              </button>

              <p className="lead-form-privacy">
                <span aria-hidden>✓</span>
                Your information is safe with us and will only be used to
                {isTrial ? " set up your trial." : " schedule your demo."}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PhoneField({
  id,
  label,
  value,
  error,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  const reduceMotion = useReducedMotion();

  const handleInput = (raw: string) => {
    let digits = raw.replace(/\D/g, "");
    if (digits.startsWith("91") && digits.length > 10) {
      digits = digits.slice(2);
    }
    onChange(digits.slice(0, 10));
  };

  return (
    <div className="lead-field">
      <label htmlFor={id}>{label}</label>
      <div className={`lead-input-wrap${error ? " is-error" : ""}`}>
        <span className="lead-input-icon" aria-hidden>
          <Phone size={18} weight="duotone" />
        </span>
        <div className="lead-phone-input">
          <span className="lead-phone-prefix">+91</span>
          <input
            id={id}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={value}
            onChange={(e) => handleInput(e.target.value)}
            onBlur={onBlur}
            placeholder="98765 43210"
            maxLength={10}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        </div>
      </div>
      <FieldError id={id} error={error} reduceMotion={reduceMotion} />
    </div>
  );
}

function IconField({
  id,
  label,
  icon: Icon,
  value,
  error,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  icon: typeof User;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="lead-field">
      <label htmlFor={id}>{label}</label>
      <div className={`lead-input-wrap${error ? " is-error" : ""}`}>
        <span className="lead-input-icon" aria-hidden>
          <Icon size={18} weight="duotone" />
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      <FieldError id={id} error={error} reduceMotion={reduceMotion} />
    </div>
  );
}

function IconSelectField({
  id,
  label,
  icon: Icon,
  value,
  error,
  onChange,
  onBlur,
  placeholder,
  options,
}: {
  id: string;
  label: string;
  icon: typeof ChartBar;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="lead-field">
      <label htmlFor={id}>{label}</label>
      <div className={`lead-input-wrap${error ? " is-error" : ""}`}>
        <span className="lead-input-icon" aria-hidden>
          <Icon size={18} weight="duotone" />
        </span>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={!value ? "lead-select-placeholder" : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <FieldError id={id} error={error} reduceMotion={reduceMotion} />
    </div>
  );
}

function FieldError({
  id,
  error,
  reduceMotion,
}: {
  id: string;
  error?: string;
  reduceMotion: boolean | null;
}) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          id={`${id}-error`}
          className="lead-field-msg"
          role="alert"
          initial={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
          transition={reduceMotion ? appleFade : appleSpring.ui}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
