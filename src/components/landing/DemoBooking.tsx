"use client";

import { useState, FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";
import { generateMetaEventId } from "@/lib/meta-pixel";
import { buildDemoBookingUrl, DEMO_LANGUAGE_OPTIONS } from "@/lib/demo-booking";
import { appleFade, appleSpring } from "@/lib/motion";

interface FormData {
  name: string;
  whatsapp: string;
  storeUrl: string;
  monthlyOrders: string;
  preferredLanguage: string;
}

const REDIRECT_DELAY_MS = 320;

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
    case "storeUrl":
      if (!trimmed) return "Store URL is required";
      return undefined;
    case "monthlyOrders":
      if (!trimmed) return "Monthly orders is required";
      return undefined;
    case "preferredLanguage":
      if (!trimmed) return "Select a preferred language";
      return undefined;
    default:
      return undefined;
  }
}

function validateAll(form: FormData, compact: boolean): Partial<FormData> {
  const next: Partial<FormData> = {};
  const fields: (keyof FormData)[] = compact
    ? ["name", "whatsapp", "monthlyOrders"]
    : ["name", "whatsapp", "storeUrl", "monthlyOrders", "preferredLanguage"];
  fields.forEach((field) => {
    const error = validateField(field, form[field]);
    if (error) next[field] = error;
  });
  return next;
}

export function DemoBooking({ compact = false }: { compact?: boolean }) {
  const [form, setForm] = useState<FormData>({
    name: "",
    whatsapp: "",
    storeUrl: "",
    monthlyOrders: "",
    preferredLanguage: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>(
    {}
  );
  const [isRedirecting, setIsRedirecting] = useState(false);
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
    if (isRedirecting || isSubmitting) return;

    const nextErrors = validateAll(form, compact);
    setErrors(nextErrors);
    setTouched(
      compact
        ? { name: true, whatsapp: true, monthlyOrders: true }
        : {
            name: true,
            whatsapp: true,
            storeUrl: true,
            monthlyOrders: true,
            preferredLanguage: true,
          }
    );

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
        calBookingUrl?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Could not save your details");
      }

      trackEvent("demo_form_submitted", {
        monthly_orders: form.monthlyOrders,
        event_id: metaEventId,
      });
      setIsSubmitting(false);
      setIsRedirecting(true);

      window.setTimeout(() => {
        window.location.href = result.calBookingUrl ?? buildDemoBookingUrl(form);
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
              {isRedirecting ? (
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
                    Your name, WhatsApp number, and store details will be prefilled
                    so you can pick a demo slot.
                  </p>
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
                  <h3 className="demo-form-title">Book your demo</h3>
                  <p className="demo-form-note mono">
                    30 minutes · Explore the Recover agent live · No setup fee
                  </p>

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
                    <PhoneField
                      id="demo-whatsapp"
                      label="WhatsApp number"
                      value={form.whatsapp}
                      error={errors.whatsapp}
                      onChange={(v) => handleChange("whatsapp", v)}
                      onBlur={() => handleBlur("whatsapp")}
                    />
                    <Field
                      id="demo-orders"
                      label="Monthly orders"
                      value={form.monthlyOrders}
                      error={errors.monthlyOrders}
                      onChange={(v) => handleChange("monthlyOrders", v)}
                      onBlur={() => handleBlur("monthlyOrders")}
                      placeholder="e.g. 5,000"
                      inputMode="numeric"
                    />
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
                    disabled={isRedirecting || isSubmitting}
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
  options,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
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
        className={error ? "field-error" : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="" disabled>
          Select a language
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
