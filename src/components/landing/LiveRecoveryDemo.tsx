"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Phone, CheckCircle } from "@phosphor-icons/react";
import { trackEvent } from "@/lib/analytics";

type DemoStep = "idle" | "calling" | "conversation" | "confirmed";

const conversation = [
  {
    speaker: "AI Agent",
    text: "Hi Priya, this is RecoverAgent calling about your order from XYZ Store. We'd like to confirm your ₹2,499 order. Should we proceed?",
    isAI: true,
  },
  {
    speaker: "Customer",
    text: "Yes, confirm it.",
    isAI: false,
  },
];

export function LiveRecoveryDemo() {
  const [step, setStep] = useState<DemoStep>("idle");
  const [messageIndex, setMessageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const reset = useCallback(() => {
    setStep("idle");
    setMessageIndex(0);
    setIsPlaying(false);
  }, []);

  const playDemo = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    trackEvent("hero_demo_click");
    trackEvent("hero_video_play");
    reset();
    setStep("calling");

    setTimeout(() => {
      setStep("conversation");
      setMessageIndex(0);
    }, 1800);

    setTimeout(() => setMessageIndex(1), 4200);

    setTimeout(() => {
      setStep("confirmed");
      setIsPlaying(false);
    }, 5800);
  }, [isPlaying, reset]);

  return (
    <div className="relative w-full max-w-[420px]">
      <div className="product-shell overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              Live Recovery
            </span>
          </div>
          <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-500">
            SIM
          </span>
        </div>

        <div className="space-y-4 p-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              New COD Order
            </p>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="font-mono text-xs text-zinc-500">#GS48291</p>
                <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-zinc-100">
                  ₹2,499
                </p>
              </div>
              <span className="rounded-md bg-ops-cod-bg px-2.5 py-1 font-mono text-xs font-medium text-ops-cod ring-1 ring-ops-cod/20">
                COD
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-5"
              >
                <p className="text-center text-sm text-zinc-500">
                  Watch RecoverAgent confirm a COD order
                </p>
                <button
                  onClick={playDemo}
                  className="flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark active:scale-[0.98]"
                >
                  <Play size={16} weight="fill" />
                  Play AI Call
                </button>
              </motion.div>
            )}

            {step === "calling" && (
              <motion.div
                key="calling"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                  <Phone size={18} className="text-zinc-300" weight="fill" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">RecoverAgent</p>
                  <p className="text-sm text-zinc-500">Calling customer...</p>
                </div>
              </motion.div>
            )}

            {(step === "conversation" || step === "confirmed") && (
              <motion.div
                key="conversation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {conversation.slice(0, messageIndex + 1).map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.isAI ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-xl px-3.5 py-2.5 ${
                        msg.isAI
                          ? "rounded-tl-sm bg-zinc-800 text-zinc-200"
                          : "rounded-tr-sm bg-zinc-700 text-zinc-100"
                      }`}
                    >
                      <p className="mb-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                        {msg.speaker}
                      </p>
                      <p className="text-[13px] leading-relaxed">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}

                {step === "confirmed" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2 rounded-lg border border-ops-confirm/30 bg-ops-confirm-bg/10 py-3"
                  >
                    <CheckCircle size={18} className="text-ops-confirm" weight="fill" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-ops-confirm">COD Order Confirmed</p>
                      <p className="text-xs text-ops-confirm/80">RTO risk reduced</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step === "confirmed" && (
          <div className="border-t border-zinc-800 px-4 py-2.5">
            <button
              onClick={reset}
              className="w-full text-center text-xs text-zinc-600 transition-colors hover:text-zinc-400"
            >
              Replay simulation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
