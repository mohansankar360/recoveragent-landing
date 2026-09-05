"use client";

import { useState, FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";
import { generateMetaEventId } from "@/lib/meta-pixel";
import {
  DEMO_LANGUAGE_OPTIONS,
  getDisqualificationMessage,
  MONTHLY_ORDERS_OPTIONS,
  qualifiesForDemoCalendar,
  STORE_PLATFORM_OPTIONS,
} from "@/lib/demo-booking";
import { saveDemoBookingSession } from "@/lib/demo-booking-session";
import { appleFade, appleSpring } from "@/lib/motion";

interface FormData {
  name: string;
  whatsapp: string;
  email: string;
  storeUrl: string;
  storePlatform: string;
  monthlyOrders: string;
  preferredLanguage: string;
}

const REDIRECT_DELAY_MS = 320;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field: keyof FormData, value: string): string | undefined {
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
    case "storeUrl":
      if (!trimmed) return "Store URL is required";
      return undefined;
    case "storePlatform":
      if (!trimmed) return "Select your store platform";
      return undefined;
    case "monthlyOrders":
      if (!trimmed) return "Select your monthly order volume";
      return undefined;
    case "preferredLanguage":
      if (!trimmed) return "Select a preferred language";
      return undefined;
    default:
      return undefined;
  }
}

function getValidatedFields(compact: boolean): (keyof FormData)[] {
  return compact
    ? ["name", "whatsapp", "email", "monthlyOrders", "storePlatform"]
    : [
        "name",
        "whatsapp",
        "email",
        "monthlyOrders",
        "storePlatform",
        "storeUrl",
        "preferredLanguage",
      ];
}

function validateAll(form: FormData, compact: boolean): Partial<FormData> {
  const next: Partial<FormData> = {};
  getValidatedFields(compact).forEach((field) => {
    const error = validateField(field, form[field]);
    if (error) next[field] = error;
  });
  return next;
}

function buildTouchedState(compact: boolean): Partial<Record<keyof FormData, boolean>> {
  return getValidatedFields(compact).reduce(
    (acc, field) => {
      acc[field] = true;
      return acc;
    },
    {} as Partial<Record<keyof FormData, boolean>>
  );
}

export function DemoBooking({ compact = false }: { compact?: boolean }) {
  const [form, setForm] = useState<FormData>({
    name: "",
    whatsapp: "",
    email: "",
    storeUrl: "",
    storePlatform: "",
    monthlyOrders: "",
    preferredLanguage: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>(
    {}
  );
  const [submitOutcome, setSubmitOutcome] = useState<
    null | "redirecting" | "disqualified"
  >(null);
  const [disqualificationMessage, setDisqualificationMessage] = useState<
    string | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent("demo_form_started");
    }

    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field] || touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitOutcome || isSubmitting) return;

    const nextErrors = validateAll(form, compact);
    setErrors(nextErrors);
    setTouched(buildTouchedState(compact));

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitError(null);
    setIsSubmitting(true);

    const payload = compact
      ? {
          ...form,
          storeUrl: form.storeUrl.trim() || "To be shared on call",
          preferredLanguage: form.preferredLanguage || "english-or-hindi",
        }
      : form;

    const qualifies = qualifiesForDemoCalendar(payload);
    const metaEventId = generateMetaEventId();

    try {
      const response = await fetch("/api/demo-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, metaEventId }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Could not save your details");
      }

      trackEvent("demo_form_submitted", {
        monthly_orders: form.monthlyOrders,
        store_platform: form.storePlatform,
        event_id: metaEventId,
      });

      setIsSubmitting(false);

      if (!qualifies) {
        setDisqualificationMessage(getDisqualificationMessage(payload));
        setSubmitOutcome("disqualified");
        return;
      }

      saveDemoBookingSession(payload);
      setSubmitOutcome("redirecting");

      window.setTimeout(() => {
        window.location.href = "/calendar";
      }, REDIRECT_DELAY_MS);
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not save your details. Please try again."
      );
    }
  };

  return (
    <section className="sec sec-alt" id="demo-booking">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">Live walkthrough</div>
          <h2>See Recover Agent recover an order live.</h2>
          <p>
            Bring your current COD volume and RTO problem. We&apos;ll show you
            exactly where Recover Agent can intervene — on your numbers, not a
            deck.
          </p>
        </Reveal>

        <Reveal>
          <div className="demo-panel">
            <AnimatePresence mode="wait" initial={false}>
              {submitOutcome === "redirecting" ? (
                <motion.div
                  key="redirect"
                  className="demo-success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={appleFade}
                  role="status"
                  aria-live="polite"
                >
                  <p className="demo-success-title">Taking you to the calendar…</p>
                  <p className="demo-success-copy">
                    Your name, email, WhatsApp number, and store details will be
                    prefilled so you can pick a demo slot.
                  </p>
                </motion.div>
              ) : submitOutcome === "disqualified" ? (
                <motion.div
                  key="disqualified"
                  className="demo-success demo-success-muted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={appleFade}
                  role="status"
                  aria-live="polite"
                >
                  <p className="demo-success-title">Thanks — we&apos;ve got your details.</p>
                  <p className="demo-success-copy">{disqualificationMessage}</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={appleFade}
                >
                  <div className="demo-form-head">
                    <h3 className="demo-form-title">Book your demo</h3>
                    <p className="demo-form-note mono">
                      30 minutes · Explore the Recover agent live · No setup fee
                    </p>
                  </div>

                  <div className="demo-fields">
                    <Field
                      id="demo-name"
                      label="Name"
                      value={form.name}
                      error={errors.name}
                      onChange={(v) => handleChange("name", v)}
                      onBlur={() => handleBlur("name")}
                      placeholder="Your name"
                      autoComplete="name"
                    />

                    <div className="demo-contact-row">
                      <PhoneField
                        id="demo-whatsapp"
                        label="WhatsApp number"
                        value={form.whatsapp}
                        error={errors.whatsapp}
                        onChange={(v) => handleChange("whatsapp", v)}
                        onBlur={() => handleBlur("whatsapp")}
                      />
                      <Field
                        id="demo-email"
                        label="Email id"
                        value={form.email}
                        error={errors.email}
                        onChange={(v) => handleChange("email", v)}
                        onBlur={() => handleBlur("email")}
                        placeholder="you@store.com"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                      />
                    </div>

                    <div className="demo-contact-row">
                      <SelectField
                        id="demo-orders"
                        label="Monthly orders"
                        value={form.monthlyOrders}
                        error={errors.monthlyOrders}
                        onChange={(v) => handleChange("monthlyOrders", v)}
                        onBlur={() => handleBlur("monthlyOrders")}
                        placeholder="Select monthly order volume"
                        options={MONTHLY_ORDERS_OPTIONS.map((option) => ({
                          value: option.value,
                          label: option.label,
                        }))}
                      />
                      <SelectField
                        id="demo-platform"
                        label="Which platform your store is in"
                        value={form.storePlatform}
                        error={errors.storePlatform}
                        onChange={(v) => handleChange("storePlatform", v)}
                        onBlur={() => handleBlur("storePlatform")}
                        placeholder="Select your store platform"
                        options={STORE_PLATFORM_OPTIONS.map((option) => ({
                          value: option.value,
                          label: option.label,
                        }))}
                      />
                    </div>

                    {!compact && (
                      <>
                        <Field
                          id="demo-store"
                          label="Store URL"
                          value={form.storeUrl}
                          error={errors.storeUrl}
                          onChange={(v) => handleChange("storeUrl", v)}
                          onBlur={() => handleBlur("storeUrl")}
                          placeholder="yourstore.com or Shopify URL"
                          type="url"
                          autoComplete="url"
                          inputMode="url"
                        />
                        <SelectField
                          id="demo-language"
                          label="Preferred Language for Demo"
                          value={form.preferredLanguage}
                          error={errors.preferredLanguage}
                          onChange={(v) => handleChange("preferredLanguage", v)}
                          onBlur={() => handleBlur("preferredLanguage")}
                          placeholder="Select a language"
                          options={DEMO_LANGUAGE_OPTIONS.map((option) => ({
                            value: option.value,
                            label: option.label,
                          }))}
                        />
                      </>
                    )}
                  </div>

                  {submitError && (
                    <p className="demo-submit-error" role="alert">
                      {submitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="btn btn-green demo-submit"
                    disabled={Boolean(submitOutcome) || isSubmitting}
                  >
                    {isSubmitting ? "Saving your details…" : "Book my demo"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
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
    <div className="numfield demo-field">
      <label htmlFor={id}>{label}</label>
      <div className={`phone-input${error ? " field-error" : ""}`}>
        <span className="phone-prefix" aria-hidden="true">
          +91
        </span>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={value}
          onChange={(e) => handleInput(e.target.value)}
          onBlur={onBlur}
          placeholder="9876543210"
          maxLength={10}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="field-msg"
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
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  error,
  onChange,
  onBlur,
  placeholder,
  options,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="numfield demo-field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={[
          !value ? "demo-select-placeholder" : "",
          error ? "field-error" : "",
        ]
          .filter(Boolean)
          .join(" ") || undefined}
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
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="field-msg"
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
    </div>
  );
}

function Field({
  id,
  label,
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
    <div className="numfield demo-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={error ? "field-error" : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="field-msg"
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
    </div>
  );
}
