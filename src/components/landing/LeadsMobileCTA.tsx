"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { trackEvent } from "@/lib/analytics";
import styles from "./LeadsMobileCTA.module.css";

export function LeadsMobileCTA({ label = "Request a call" }: { label?: string }) {
  const [visible, setVisible] = useState(false);
  const [reviewsVisible, setReviewsVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById("book");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom < 0);
    }, { threshold: 0 });
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = ["examples-title", "leads-results-title"]
      .map((id) => document.getElementById(id)?.closest("section"))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);
    const visibleSections = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? visibleSections.add(entry.target) : visibleSections.delete(entry.target));
      setReviewsVisible(visibleSections.size > 0);
    }, { threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const show = visible && !reviewsVisible;

  return <div className={styles.bar} data-visible={show || undefined}>
    <a href="#book" tabIndex={show ? 0 : -1} onClick={() => trackEvent("sticky_cta_clicked", { source: "leads_mobile" })}>
      {label} <ArrowRight size={17} aria-hidden />
    </a>
  </div>;
}
