import { Reveal } from "@/components/ui/Reveal";
import { COLD_FAQ_QUESTIONS, type LandingVariant } from "@/lib/landing-variant";
import { faqs } from "@/lib/faq-data";

function truncateAnswer(text: string, maxSentences = 2): string {
  const parts = text.match(/[^.!?]+[.!?]+/g);
  if (!parts || parts.length <= maxSentences) return text;
  return parts.slice(0, maxSentences).join(" ").trim();
}

export function FAQ({ variant = "full" }: { variant?: LandingVariant }) {
  const items =
    variant === "cold"
      ? faqs.filter((faq) => COLD_FAQ_QUESTIONS.has(faq.question))
      : faqs;

  return (
    <section className="sec">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">Before you book</div>
          <h2>The things founders actually ask us.</h2>
        </Reveal>
        <Reveal className="faq">
          {items.map((faq) => (
            <details className="q" key={faq.question}>
              <summary>{faq.question}</summary>
              <p>
                {variant === "warm" ? truncateAnswer(faq.answer) : faq.answer}
              </p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
