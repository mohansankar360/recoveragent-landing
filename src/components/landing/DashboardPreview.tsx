"use client";

import { useEffect, useRef, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/AnimatedCounter";
import { Phone, WhatsappLogo, Package, ArrowRight, Pulse } from "@phosphor-icons/react";

const metrics = [
  { label: "COD Orders", value: 847, delta: "+12 today" },
  { label: "Confirmed", value: 612, delta: "72.3%" },
  { label: "Prepaid", value: 89, delta: "10.5%" },
  { label: "RTO Prevented", value: 28, delta: "This week" },
];

const queueItems = [
  { id: "a", name: "Priya S.", order: "#GS48291", status: "Calling" },
  { id: "b", name: "Arun K.", order: "#GS48288", status: "Confirmed" },
  { id: "c", name: "Meera R.", order: "#GS48285", status: "WhatsApp" },
  { id: "d", name: "Raj P.", order: "#GS48280", status: "Callback" },
];

const TYPEWRITER_QUERIES = [
  "Confirm COD #GS48291 for Priya",
  "Schedule callback Friday 4pm",
  "Send prepaid link ₹2,499",
];

const streamItems = [
  "NDR follow-up · Vikram T.",
  "Prepaid converted · Sneha M.",
  "Order confirmed · Divya N.",
  "Call connected · Karthik R.",
  "Reattempt scheduled · Ananya P.",
];

const TypewriterQuery = memo(function TypewriterQuery() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = TYPEWRITER_QUERIES[idx];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          if (text.length < full.length) setText(full.slice(0, text.length + 1));
          else setTimeout(() => setDeleting(true), 1400);
        } else {
          if (text.length > 0) setText(text.slice(0, -1));
          else {
            setDeleting(false);
            setIdx((i) => (i + 1) % TYPEWRITER_QUERIES.length);
          }
        }
      },
      deleting ? 28 : 42
    );
    return () => clearTimeout(timeout);
  }, [text, deleting, idx]);

  return (
    <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
      <Pulse size={16} className="shrink-0 text-emerald-400" weight="fill" />
      <span className="font-mono text-xs text-zinc-400">
        {text}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="ml-0.5 inline-block h-3 w-0.5 bg-emerald-400 align-middle"
        />
      </span>
    </div>
  );
});

const LiveQueue = memo(function LiveQueue() {
  const [order, setOrder] = useState(queueItems);

  useEffect(() => {
    const id = setInterval(() => {
      setOrder((prev) => {
        const next = [...prev];
        const first = next.shift();
        if (first) next.push(first);
        return next;
      });
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <ul className="space-y-2">
      <AnimatePresence mode="popLayout">
        {order.slice(0, 3).map((item) => (
          <motion.li
            key={item.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2.5"
          >
            <div>
              <p className="text-xs font-medium text-zinc-200">{item.name}</p>
              <p className="font-mono text-[10px] text-zinc-500">{item.order}</p>
            </div>
            <span className="rounded-md bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
              {item.status}
            </span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
});

const DataStream = memo(function DataStream() {
  const doubled = [...streamItems, ...streamItems];
  return (
    <div className="overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="flex w-max gap-3"
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 font-mono text-[10px] text-zinc-400"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
});

export function DashboardPreview() {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setShowBadge(true), 2200);
    const hide = setTimeout(() => setShowBadge(false), 5200);
    const loop = setInterval(() => {
      setShowBadge(true);
      setTimeout(() => setShowBadge(false), 3000);
    }, 8000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
      clearInterval(loop);
    };
  }, []);

  return (
    <section className="bg-zinc-950 py-24 text-zinc-100">
      <div className="container-wide px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <FadeIn>
            <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
              Operations dashboard
            </p>
            <h2 className="mt-3 text-left text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">
              An operational system,
              <span className="block text-zinc-500">not an AI wrapper.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-400">
              Track every COD order, confirmation, conversion, and recovery from one live dashboard.
            </p>
          </FadeIn>

          <FadeIn delay={0.1} direction="left">
            <div className="hidden justify-end lg:flex">
              <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 font-mono text-xs text-zinc-400">
                <motion.span
                  animate={{ scale: [1, 1.35, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-emerald-500"
                />
                Agent active · 14 calls in queue
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div className="relative mt-12 grid gap-4 lg:grid-cols-12">
            <div className="product-shell relative col-span-12 overflow-hidden p-6 lg:col-span-8 lg:p-8">
              <AnimatePresence>
                {showBadge && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="absolute right-6 top-6 z-20 rounded-full border border-ops-confirm/30 bg-ops-confirm-bg/10 px-3 py-1 font-mono text-[10px] text-ops-confirm"
                  >
                    +3 confirmed in last hour
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="mb-5 font-mono text-xs text-zinc-500">Recovery overview</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {metrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 100, damping: 20 }}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
                  >
                    <p className="text-[10px] text-zinc-500">{m.label}</p>
                    <p className="mt-1 font-mono text-2xl font-semibold tracking-tight">{m.value}</p>
                    <p className="mt-1 font-mono text-[10px] text-zinc-600">{m.delta}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="product-shell col-span-12 p-6 lg:col-span-4 lg:p-8">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-xs text-zinc-500">Live queue</p>
                <Phone size={16} className="text-zinc-400" weight="duotone" />
              </div>
              <LiveQueue />
            </div>

            <div className="product-shell col-span-12 p-6 lg:col-span-5 lg:p-8">
              <p className="mb-4 font-mono text-xs text-zinc-500">Agent command</p>
              <TypewriterQuery />
              <div className="mt-4 flex gap-2">
                {[Phone, WhatsappLogo, Package].map((Icon, i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-500"
                  >
                    <Icon size={16} />
                  </div>
                ))}
                <div className="ml-auto flex items-center gap-1 font-mono text-[10px] text-zinc-600">
                  Processing <ArrowRight size={12} />
                </div>
              </div>
            </div>

            <div className="product-shell col-span-12 overflow-hidden p-6 lg:col-span-7 lg:p-8">
              <p className="mb-4 font-mono text-xs text-zinc-500">Activity stream</p>
              <DataStream />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
