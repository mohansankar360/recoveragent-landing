"use client";

import { FadeIn } from "@/components/ui/AnimatedCounter";
import { SpotlightCard } from "@/components/ui/MotionPrimitives";

const cards = [
  {
    title: "Customers actually answer calls",
    description: "Voice is immediate and conversational. A phone call gets attention that a WhatsApp message often doesn't.",
  },
  {
    title: "AI understands intent",
    description: 'Not just button clicks. When a customer says "I don\'t have the money today. Call me Friday," RecoverAgent understands that as a callback request, not a failed confirmation.',
    example: '"I don\'t have the money today. Call me Friday."',
  },
  {
    title: "Your team handles exceptions",
    description: "AI handles repetitive conversations at scale. Humans step in only for cases that actually need intervention.",
  },
];

export function WhyAIVoice() {
  return (
    <section className="section-padding bg-canvas">
      <div className="container-narrow">
        <FadeIn>
          <h2 className="text-left text-3xl font-bold tracking-tighter text-ink sm:text-4xl">
            Why use an AI voice agent instead of another WhatsApp message?
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {cards.map((card, i) => (
            <FadeIn key={card.title} delay={i * 0.1}>
              <SpotlightCard className="h-full p-6">
                <h3 className="text-lg font-semibold text-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{card.description}</p>
                {card.example && (
                  <blockquote className="mt-4 rounded-lg border border-line bg-canvas-subtle px-4 py-3 text-sm italic text-ink-muted">
                    {card.example}
                  </blockquote>
                )}
              </SpotlightCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
