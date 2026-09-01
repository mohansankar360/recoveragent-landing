"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/AnimatedCounter";
import { trackEvent } from "@/lib/analytics";

const languages = ["English", "Tamil", "Hindi", "Telugu", "Kannada", "Malayalam"];

const callScript = [
  { speaker: "RecoverAgent AI", text: "Hi Arun, we're calling regarding your COD order of ₹1,899.", isAI: true },
  { speaker: "Customer", text: "Yes, I placed the order.", isAI: false },
  { speaker: "RecoverAgent AI", text: "Great. Shall I confirm the order for delivery?", isAI: true },
  { speaker: "Customer", text: "Can you deliver it Saturday?", isAI: false },
  { speaker: "RecoverAgent AI", text: "Yes. I've noted your preferred delivery day.", isAI: true },
];

export function AIVoiceDemo() {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [activeLang, setActiveLang] = useState("Hindi");

  const playDemo = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    setIsComplete(false);
    setVisibleMessages(0);
    trackEvent("ai_demo_played");
    callScript.forEach((_, i) => {
      setTimeout(() => {
        setVisibleMessages(i + 1);
        if (i === callScript.length - 1) {
          setTimeout(() => { setIsComplete(true); setIsPlaying(false); }, 800);
        }
      }, (i + 1) * 1400);
    });
  }, [isPlaying]);

  const reset = () => {
    setVisibleMessages(0);
    setIsComplete(false);
    setIsPlaying(false);
  };

  return (
    <section className="section-padding border-y border-line bg-canvas-panel">
      <div className="container-narrow">
        <FadeIn>
          <h2 className="text-left text-3xl font-bold tracking-tighter text-ink sm:text-4xl">
            Your customers don&apos;t need another form.
          </h2>
          <p className="mt-3 text-lg text-ink-muted">They can just talk.</p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mx-auto mt-12 max-w-lg lg:mx-0">
            <div className="product-shell overflow-hidden">
              <div className="border-b border-zinc-800 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">RecoverAgent AI</p>
                    <p className="font-mono text-xs text-zinc-500">
                      {isPlaying && !isComplete ? "Calling customer..." : isComplete ? "Call completed" : "Ready to call"}
                    </p>
                  </div>
                  {isPlaying && !isComplete && (
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="h-3 w-3 rounded-full bg-emerald-500" />
                  )}
                </div>
              </div>

              <div className="min-h-[280px] space-y-3 p-5">
                <AnimatePresence>
                  {callScript.slice(0, visibleMessages).map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.isAI ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[85%] rounded-xl px-4 py-3 ${msg.isAI ? "rounded-tl-sm bg-zinc-800" : "rounded-tr-sm bg-zinc-700"}`}>
                        <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">{msg.speaker}</p>
                        <p className="text-sm text-zinc-200">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isComplete && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-ops-confirm/30 bg-ops-confirm-bg/10 py-3 text-center text-sm font-medium text-ops-confirm">
                    Order confirmed
                  </motion.div>
                )}
              </div>

              <div className="border-t border-zinc-800 px-5 py-4">
                {!isPlaying && visibleMessages === 0 && (
                  <button onClick={playDemo} className="w-full rounded-full bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-dark">Play Conversation</button>
                )}
                {isComplete && (
                  <button onClick={reset} className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300">Replay</button>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    activeLang === lang ? "bg-ink text-white" : "border border-line bg-canvas-panel text-ink-muted hover:text-ink"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <p className="mt-3 font-mono text-xs text-ink-faint">Multi-language support for Indian customers</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
