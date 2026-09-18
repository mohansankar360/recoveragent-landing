"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import {
  MONTHLY_ORDERS_OPTIONS,
  STORE_PLATFORM_OPTIONS,
  UNSUPPORTED_PLATFORM_MESSAGE,
} from "@/lib/demo-booking";
import { saveLeadPrefill } from "@/lib/lead-prefill";
import { generateMetaEventId } from "@/lib/meta-pixel";
import { appleFade, appleSpring } from "@/lib/motion";

interface LeadFormData {
  name: string;
  whatsapp: string;
  email: string;
  monthlyOrders: string;
  storePlatform: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REDIRECT_DELAY_MS = 280;

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
    default:
      return undefined;
  }
}

function validateAll(form: LeadFormData): Partial<LeadFormData> {
  const next: Partial<LeadFormData> = {};
  (Object.keys(form) as (keyof LeadFormData)[]).forEach((field) => {
    const error = validateField(field, form[field]);
    if (error) next[field] = error;
  });
  return next;
}

export function LeadCaptureForm() {
  const [form, setForm] = useState<LeadFormData>({
    name: "",
    whatsapp: "",
    email: "",
    monthlyOrders: "",
    storePlatform: "",
  });
  const [errors, setErrors] = useState<Partial<LeadFormData>>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof LeadFormData, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isUnsupportedPlatform, setIsUnsupportedPlatform] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleChange = (field: keyof LeadFormData, value: string) => {
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent("lead_form_started");
    }

    setForm((prev) => ({ ...prev, [field]: value }));

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isRedirecting) return;

    const nextErrors = validateAll(form);
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

    saveLeadPrefill({
      name: form.name.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.replace(/\D/g, "").slice(0, 10),
      monthlyOrders: form.monthlyOrders,
      storePlatform: form.storePlatform,
    });

    trackEvent("lead_form_submitted", {
      monthly_orders: form.monthlyOrders,
      store_platform: form.storePlatform,
      event_id: metaEventId,
    });

    setIsSubmitting(false);
    setIsRedirecting(true);

    window.setTimeout(() => {
      window.location.href = "/#demo-booking";
    }, REDIRECT_DELAY_MS);
  };

  return (
    <div className="lead-capture-shell">
      <div className="lead-capture-card demo-panel">
        <div className="lead-capture-brand">
          <Image
            src="/recover-agent-logo-transparent.png"
            alt="Recover Agent"
            width={160}
            height={40}
            className="lead-capture-logo"
            priority
          />
        </div>

        <div className="lead-capture-head">
          <h1>Get your free Recover Agent demo</h1>
          <p>
            Share a few details and we&apos;ll take you to the site with your
            info ready in the booking form.
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {isUnsupportedPlatform ? (
            <motion.div
              key="unsupported-platform"
              className="demo-success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={appleFade}
              role="status"
              aria-live="polite"
            >
              <p className="demo-success-title">This platform is not supported.</p>
              <p className="demo-success-copy">{UNSUPPORTED_PLATFORM_MESSAGE}</p>
            </motion.div>
          ) : isRedirecting ? (
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
              <p className="demo-success-title">Taking you to Recover Agent…</p>
              <p className="demo-success-copy">
                Your details will already be filled in on the demo form.
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
              <div className="demo-fields">
                <TextField
                  id="lead-name"
                  label="Full name"
                  value={form.name}
                  error={errors.name}
                  onChange={(v) => handleChange("name", v)}
                  onBlur={() => handleBlur("name")}
                  placeholder="Your name"
                  autoComplete="name"
                />

                <TextField
                  id="lead-email"
                  label="Email"
                  value={form.email}
                  error={errors.email}
                  onChange={(v) => handleChange("email", v)}
                  onBlur={() => handleBlur("email")}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                />

                <PhoneField
                  id="lead-whatsapp"
                  label="WhatsApp number"
                  value={form.whatsapp}
                  error={errors.whatsapp}
                  onChange={(v) => handleChange("whatsapp", v)}
                  onBlur={() => handleBlur("whatsapp")}
                />

                <SelectField
                  id="lead-orders"
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
                  id="lead-platform"
                  label="Store platform"
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

              <button
                type="submit"
                className="btn btn-green demo-submit lead-capture-submit"
                disabled={isSubmitting || isRedirecting}
              >
                {isSubmitting ? "Saving…" : "Continue to Recover Agent"}
              </button>

              <p className="lead-capture-privacy">
                By continuing, you agree we may contact you about Recover Agent.
                Your details carry over to the demo form on the next page.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
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

function TextField({
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
