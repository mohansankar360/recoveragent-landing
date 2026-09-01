"use client";

import { FadeIn } from "@/components/ui/AnimatedCounter";
import { scrollToSection } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const costItems = [
  "Product cost",
  "Forward shipping",
  "Return shipping",
  "Packaging",
  "Handling",
  "Lost opportunity",
];

export function BusinessCase() {
  const handleCTA = () => {
    trackEvent("calculator_cta_clicked", { source: "business_case" });
    scrollToSection("calculator");
  };

  return (
    <section className="section-padding bg-canvas-panel">
      <div className="container-narrow">
        <FadeIn>
          <h2 className="text-left text-3xl font-bold tracking-tighter text-ink sm:text-4xl">
            You&apos;re already paying for every RTO.
          </h2>
          <p className="mt-4 max-w-2xl text-ink-muted">
            Each RTO isn&apos;t just lost revenue. It&apos;s shipping, packaging, handling, and opportunity cost stacked on top.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {costItems.map((item) => (
              <div key={item} className="ops-panel p-4 text-center">
                <p className="text-xs font-medium text-ink-muted">{item}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-12">
            <p className="text-lg font-semibold text-ink">
              RecoverAgent turns recovery from a manual task into a system.
            </p>
            <button
              onClick={handleCTA}
              className="mt-6 rounded-full border border-line bg-canvas-panel px-8 py-3 text-sm font-medium text-ink transition-colors hover:bg-canvas-subtle active:scale-[0.98]"
            >
              Calculate My Potential Savings
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
