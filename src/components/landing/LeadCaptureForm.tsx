"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { ShopifyLogo, WooCommerceLogo } from "@/components/landing/PlatformLogos";
import { BookingPicker } from "@/components/calendar/BookingPicker";
import type { DemoFormData } from "@/lib/demo-booking";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
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
import { clearSavedLeadDetails, readSavedLeadDetails, saveDemoBookingSession, saveLeadDetails } from '@/lib/demo-booking-session';
import { getDisqualificationMessage, getStoreUrlValidationError, normalizeStoreUrl, parseIndianMobileInput, qualifiesForDemoCalendar } from '@/lib/demo-booking';
import { suggestEmailCorrection } from "@/lib/email-suggestion";
import { generateMetaEventId, getMetaBrowserIds } from "@/lib/meta-pixel";
import { identifyClarityLead } from "@/lib/clarity";
import { getEngagementSnapshot } from "@/lib/visitor-engagement";
import { appleFade, appleSpring } from "@/lib/motion";

interface LeadFormData {
  name: string;
  whatsapp: string;
  email: string;
  monthlyOrders: string;
  storePlatform: string;
  storeUrl: string;
}

const EMPTY_FORM: LeadFormData = {
  name: "",
  whatsapp: "",
  email: "",
  monthlyOrders: "",
  storePlatform: "",
  storeUrl: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Shown on the trial form to stores below 500 orders a month.
const TRIAL_LOW_VOLUME_MESSAGE =
  "The 14-day free trial is for stores doing 500+ orders a month. We can still help you reduce RTO with our WhatsApp service — our team will call you soon.";

function validateField(
  field: keyof LeadFormData,
  value: string
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
      return getStoreUrlValidationError(value);
    default:
      return undefined;
  }
}

// Step 1 is saved to the CRM on its own, so a visitor who drops off on step 2
// can still be followed up. Step 2 then completes the same contact.
const STEP_ONE_FIELDS: (keyof LeadFormData)[] = ["name", "whatsapp", "storeUrl"];

function validateAll(
  form: LeadFormData,
  fields = Object.keys(form) as (keyof LeadFormData)[]
): Partial<LeadFormData> {
  const next: Partial<LeadFormData> = {};
  fields.forEach((field) => {
    const error = validateField(field, form[field]);
    if (error) next[field] = error;
  });
  return next;
}

export function LeadCaptureForm({ mode = "demo", idPrefix = "lead" }: { mode?: "demo" | "trial"; idPrefix?: string }) {
  const isTrial = mode === "trial";
  const [form, setForm] = useState<LeadFormData>(EMPTY_FORM);
  const [verifiedUrl, setVerifiedUrl] = useState("");
  const [platformCheck, setPlatformCheck] = useState<"idle" | "checking" | "unknown">("idle");
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
  const [step, setStep] = useState<1 | 2>(1);
  // True when the fields were filled from details this browser saved on an earlier visit.
  const [restored, setRestored] = useState(false);
  // Step 1 values last sent to the CRM, so Back → Next without edits doesn't resend.
  const savedStepOne = useRef<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);

  useEffect(() => {
    if (!pendingFocus.current) return;
    const node = cardRef.current?.querySelector<HTMLElement>(`#${pendingFocus.current}`);
    if (node) {
      node.focus();
      pendingFocus.current = null;
    }
  }, [step, errors]);

  // Read after mount: storage isn't available during server rendering.
  useEffect(() => {
    const saved = readSavedLeadDetails();
    if (!saved) return;
    setForm((prev) => ({ ...prev, ...saved }));
    setRestored(true);
  }, []);

  useEffect(() => {
    const url = form.storeUrl.trim();
    setVerifiedUrl("");
    setForm((prev) => prev.storePlatform ? { ...prev, storePlatform: "" } : prev);
    if (!url || getStoreUrlValidationError(url) || url.toLowerCase() === "to be shared on call") {
      setPlatformCheck("idle");
      return;
    }
    const controller = new AbortController();
    setPlatformCheck("checking");
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("https://huyoveugeexdhyqhawvq.supabase.co/functions/v1/detect-store-platform", {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1eW92ZXVnZWV4ZGh5cWhhd3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NjUyMDMsImV4cCI6MjA4ODA0MTIwM30.NDbox6KeRJ9FG_TGc6f5yjolaqh51KClrXlP6afFByg", Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1eW92ZXVnZWV4ZGh5cWhhd3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NjUyMDMsImV4cCI6MjA4ODA0MTIwM30.NDbox6KeRJ9FG_TGc6f5yjolaqh51KClrXlP6afFByg" },
          body: JSON.stringify({ url: normalizeStoreUrl(url) }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Platform check failed");
        const result = await response.json();
        if (controller.signal.aborted) return;
        if ((result.platform === "shopify" || result.platform === "woocommerce")) {
          setForm((prev) => ({ ...prev, storePlatform: result.platform }));
          setErrors((prev) => ({ ...prev, storePlatform: undefined }));
          setVerifiedUrl(url);
          setPlatformCheck("idle");
        } else {
          setPlatformCheck(result.platform === "shopify" || result.platform === "woocommerce" ? "idle" : "unknown");
        }
      } catch {
        if (!controller.signal.aborted) setPlatformCheck("unknown");
      }
    }, 800);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [form.storeUrl]);


  const clearSavedDetails = () => {
    clearSavedLeadDetails();
    setForm(EMPTY_FORM);
    setErrors({});
    setTouched({});
    setRestored(false);
    savedStepOne.current = null;
    pendingFocus.current = `${idPrefix}-name`;
  };

  const focusFirstError = (nextErrors: Partial<LeadFormData>) => {
    const ids: Record<keyof LeadFormData, string> = {
      name: `${idPrefix}-name`, whatsapp: `${idPrefix}-whatsapp`, storeUrl: `${idPrefix}-store-url`,
      monthlyOrders: `${idPrefix}-orders`, storePlatform: `${idPrefix}-platform`, email: `${idPrefix}-email`,
    };
    const first = (Object.keys(ids) as (keyof LeadFormData)[]).find((field) => nextErrors[field]);
    if (first) pendingFocus.current = ids[first];
  };

  const handleChange = (field: keyof LeadFormData, value: string) => {
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent("lead_form_started");
    }

    if (field === "storeUrl") {
      setVerifiedUrl("");
      setForm((prev) => ({ ...prev, storeUrl: value, storePlatform: "" }));
    } else setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field] || touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof LeadFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const emailSuggestion = errors.email ? null : suggestEmailCorrection(form.email);
  const routesToOnboarding = form.monthlyOrders === "0-500";

  const markTouched = (fields: (keyof LeadFormData)[]) =>
    setTouched((prev) => fields.reduce((acc, field) => ({ ...acc, [field]: true }), prev));

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validateAll(form, STEP_ONE_FIELDS);
    if (verifiedUrl !== form.storeUrl.trim() || platformCheck === "checking") nextErrors.storePlatform = platformCheck === "checking" ? "Please wait while we check your store." : "We could not verify this as a Shopify or WooCommerce store. If you are a marketer/agency please enter any of your client's store.";
    setErrors(nextErrors);
    markTouched(STEP_ONE_FIELDS);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    const name = form.name.trim();
    const whatsapp = form.whatsapp.replace(/\D/g, "").slice(0, 10);
    const storeUrl = normalizeStoreUrl(form.storeUrl);
    saveLeadDetails({ name, whatsapp, storeUrl: form.storeUrl });
    const key = `${name}|${whatsapp}|${storeUrl}`;
    if (savedStepOne.current !== key) {
      savedStepOne.current = key;
      trackEvent("lead_form_step1_completed");
      // Fire-and-forget: a CRM hiccup here must never block the visitor from step 2.
      fetch("/api/demo-lead/partial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, whatsapp, storeUrl, engagement: getEngagementSnapshot() }),
        keepalive: true,
      })
        .then((response) => {
          if (!response.ok) savedStepOne.current = null;
        })
        .catch(() => {
          savedStepOne.current = null;
        });
    }
    setSubmitError(null);
    pendingFocus.current = `${idPrefix}-orders`;
    setStep(2);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting || calendarPrefill) return;

    const nextErrors = validateAll(form);
    setErrors(nextErrors);
    markTouched(Object.keys(form) as (keyof LeadFormData)[]);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      if (STEP_ONE_FIELDS.some((field) => nextErrors[field])) setStep(1);
      return;
    }

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
      storeUrl: normalizeStoreUrl(form.storeUrl),
      preferredLanguage: 'english-or-hindi',
    };
    setSubmitError(null);
    try {
      const response = await fetch('/api/demo-lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, metaEventId, ...getMetaBrowserIds(), engagement: getEngagementSnapshot() }) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error ?? 'Could not save your details. Please try again.');
      saveLeadDetails(form);
      identifyClarityLead(result.leadId ?? metaEventId, payload.name);
      if (!qualifiesForDemoCalendar(payload)) {
        trackEvent("lead_form_submitted", {
          monthly_orders: form.monthlyOrders,
          store_platform: payload.storePlatform,
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

  // The success message is much shorter than the form, so the page shrinks
  // when it swaps in. Bring it into view so the user doesn't land below it.
  const revealOutcome = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    node.focus({ preventScroll: true });
    node.scrollIntoView({ block: "center", behavior: "instant" });
  }, []);

  return (
    <div ref={cardRef} className="lead-form-card">
      <AnimatePresence mode="wait" initial={false}>
        {onboardingRequested ? (
          <motion.div
            key="onboarding-requested"
            ref={revealOutcome}
            tabIndex={-1}
            className="lead-form-success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={appleFade}
            role="status"
            aria-live="polite"
          >
            <p className="lead-form-success-title">Your onboarding request is received.</p>
            <p>
              {isTrial
                ? TRIAL_LOW_VOLUME_MESSAGE
                : getDisqualificationMessage({
                    monthlyOrders: form.monthlyOrders,
                    storePlatform: form.storePlatform,
                  })}
            </p>
          </motion.div>
        ) : isUnsupportedPlatform ? (
          <motion.div
            key="unsupported-platform"
            ref={revealOutcome}
            tabIndex={-1}
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
            <div className="lead-form-topline">
              <div className="lead-form-badge">{isTrial ? "No setup fee" : "14-day free trial available"}</div>
              <span className="lead-form-step" aria-live="polite">Step {step} of 2</span>
            </div>
            <div className="lead-form-head">
              <h2>{isTrial ? "Start your 14-day free trial" : "Book a demo"}</h2>
              <p>
                {step === 1
                  ? "Start with your name, WhatsApp number and store."
                  : isTrial
                    ? "A few store details, then pick a time for your setup call."
                    : "A few store details, then choose a time for your 30-minute demo."}
              </p>
            </div>

            {step === 1 ? (
            <form onSubmit={handleNext} noValidate className="lead-form-fields">
              {restored && (
                <div className="lead-form-recap">
                  <span>Welcome back. We’ve filled in your details.</span>
                  <button type="button" className="lead-form-back" onClick={clearSavedDetails}>
                    Not you? Clear
                  </button>
                </div>
              )}
              <IconField
                id={`${idPrefix}-name`}
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
                id={`${idPrefix}-whatsapp`}
                label="WhatsApp number"
                value={form.whatsapp}
                error={errors.whatsapp}
                onChange={(v) => handleChange("whatsapp", v)}
                onBlur={() => handleBlur("whatsapp")}
              />

              <IconField
                id={`${idPrefix}-store-url`}
                label="Store URL"
                icon={Globe}
                value={form.storeUrl}
                error={errors.storeUrl}
                onChange={(v) => handleChange("storeUrl", v)}
                onBlur={() => handleBlur("storeUrl")}
                placeholder="yourstore.com"
                autoComplete="url"
                inputMode="url"
              />

              <div className="lead-field">
                <label htmlFor={`${idPrefix}-platform`}>Store platform</label>
                <div id={`${idPrefix}-platform`} className="lead-platform-options" role="radiogroup" aria-label="Store platform">
                  {STORE_PLATFORM_OPTIONS.map((option) => (
                    <button key={option.value} type="button" role="radio" aria-checked={form.storePlatform === option.value} disabled className={form.storePlatform === option.value ? "is-selected" : undefined}>
                      {option.value === "shopify" ? <ShopifyLogo size={26} /> : option.value === "woocommerce" ? <WooCommerceLogo size={15} /> : <Globe size={22} aria-hidden />}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
                {platformCheck === "checking" ? <p role="status">Checking your store…</p> : verifiedUrl ? <p role="status">Detected a {form.storePlatform === "shopify" ? "Shopify" : "WooCommerce"} store</p> : (platformCheck === "unknown" || errors.storePlatform) ? (
                  <div className="lead-platform-notice" role="status">
                    <span className="lead-platform-notice-icon" aria-hidden="true">!</span>
                    <div><strong>We could not verify this as a Shopify or WooCommerce store.</strong><p>If you are a marketer/agency please enter any of your client&apos;s store.</p></div>
                  </div>
                ) : null}
              </div>

              <button type="submit" className="btn btn-green lead-form-submit">
                Next →
              </button>

              <p className="lead-form-privacy">
                <span aria-hidden>✓</span>
                Your information is safe with us and will only be used to
                {isTrial ? " set up your trial." : " schedule your demo."}
              </p>
            </form>
            ) : (
            <form onSubmit={handleSubmit} noValidate className="lead-form-fields">
              <div className="lead-form-recap">
                <span>
                  {form.name.trim()} · +91 {form.whatsapp} · {form.storeUrl.trim()}
                </span>
                <button type="button" className="lead-form-back" onClick={() => { pendingFocus.current = `${idPrefix}-name`; setStep(1); }}>
                  <ArrowLeft size={14} weight="bold" aria-hidden />
                  Edit
                </button>
              </div>

              <IconSelectField
                id={`${idPrefix}-orders`}
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

              <IconField
                id={`${idPrefix}-email`}
                label="Email"
                icon={EnvelopeSimple}
                value={form.email}
                error={errors.email}
                onChange={(v) => handleChange("email", v)}
                onBlur={() => handleBlur("email")}
                type="email"
                autoComplete="email"
                inputMode="email"
                hint={emailSuggestion && (
                  <>
                    Did you mean{" "}
                    <button type="button" className="lead-field-hint-fix" onClick={() => handleChange("email", emailSuggestion)}>
                      {emailSuggestion}
                    </button>
                    ?
                  </>
                )}
              />

              {submitError && <p role="alert" className="lead-field-msg">{submitError}</p>}
              <button
                type="submit"
                className="btn btn-green lead-form-submit"
                disabled={isSubmitting || !!calendarPrefill || form.storePlatform === 'other'}
              >
                {isSubmitting ? "Saving…" : routesToOnboarding ? 'Request an onboarding call' : isTrial ? 'Start free trial: choose setup time →' : 'Continue to choose a time →'}
              </button>

              <p className="lead-form-privacy">
                <span aria-hidden>✓</span>
                Your information is safe with us and will only be used to
                {isTrial ? " set up your trial." : " schedule your demo."}
              </p>
            </form>
            )}
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

  const handleInput = (raw: string) => onChange(parseIndianMobileInput(raw));

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
  hint,
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
  hint?: React.ReactNode;
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
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />
      </div>
      <FieldError id={id} error={error} reduceMotion={reduceMotion} />
      {!error && hint && (
        <p id={`${id}-hint`} className="lead-field-hint" aria-live="polite">
          {hint}
        </p>
      )}
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
