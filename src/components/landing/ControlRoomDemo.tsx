"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import {
  AUTOMATION_STEPS,
  CONTROL_MODULES,
  maskPhone,
  VISIBLE_ORDER_CARDS,
  type DemoOrder,
  type ModuleId,
  type StageTone,
} from "@/lib/control-room-data";
import { formatInr } from "@/lib/calculator";

function toneClass(tone: StageTone) {
  return `cr-tone-${tone}`;
}

export function ControlRoomDemo() {
  const [moduleId, setModuleId] = useState<ModuleId>("cod");
  const [stageId, setStageId] = useState("intervention");
  const [selectedId, setSelectedId] = useState<string | null>("cod-1");
  const [query, setQuery] = useState("");

  const activeModule = CONTROL_MODULES.find((m) => m.id === moduleId)!;

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    const overviewStages = new Set(["total", "shipped", "ndr"]);
    return activeModule.orders.filter((order) => {
      const stageMatch = overviewStages.has(stageId) || order.stageId === stageId;
      if (!stageMatch) return false;
      if (!q) return true;
      return (
        order.name.toLowerCase().includes(q) ||
        order.orderId.toLowerCase().includes(q) ||
        order.product.toLowerCase().includes(q)
      );
    });
  }, [activeModule, stageId, query]);

  const activeStage = activeModule.stages.find((s) => s.id === stageId);
  const stageOrderCount = activeStage?.count ?? filteredOrders.length;
  const visibleOrders = filteredOrders.slice(0, VISIBLE_ORDER_CARDS);
  const showMore = stageOrderCount > VISIBLE_ORDER_CARDS;

  const selected =
    visibleOrders.find((o) => o.id === selectedId) ??
    filteredOrders.find((o) => o.id === selectedId) ??
    visibleOrders[0] ??
    null;

  const switchModule = (id: ModuleId) => {
    const next = CONTROL_MODULES.find((m) => m.id === id)!;
    setModuleId(id);
    setStageId(id === "ndr" ? "ndr" : id === "abandoned" ? "total" : "intervention");
    setSelectedId(next.orders[0]?.id ?? null);
    setQuery("");
  };

  const pickStage = (id: string) => {
    setStageId(id);
    const overviewStages = new Set(["total", "shipped", "ndr"]);
    const first = overviewStages.has(id)
      ? activeModule.orders[0]
      : activeModule.orders.find((o) => o.stageId === id);
    if (first) setSelectedId(first.id);
  };

  return (
    <section className="sec sec-alt" id="control-room">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">The control room behind the manifest</div>
          <h2>One dashboard for every rupee you&apos;re leaking.</h2>
          <p>
            COD confirmation, abandoned checkout, and NDR re-attempts — same funnel logic
            your ops team would build in spreadsheets, except it runs itself.
          </p>
        </Reveal>

        <Reveal>
          <div className="cr-shell">
            <div className="cr-top">
              <div className="cr-tabs" role="tablist" aria-label="Recovery modules">
                {CONTROL_MODULES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="tab"
                    aria-selected={moduleId === m.id}
                    className={`cr-tab${moduleId === m.id ? " active" : ""}`}
                    onClick={() => switchModule(m.id)}
                  >
                    {m.tab}
                  </button>
                ))}
              </div>
              <div className="cr-titleblock">
                <h3>{activeModule.title}</h3>
                <p>{activeModule.subtitle}</p>
              </div>
            </div>

            <div className="cr-grid">
              <aside className="cr-funnel" aria-label="Recovery funnel">
                <div className="cr-funnel-head">
                  <span className="cr-funnel-label">Funnel</span>
                  <span className="cr-funnel-hint">Tap a stage</span>
                </div>
                <div className="cr-funnel-list">
                  {activeModule.stages.map((stage) => {
                    const total = activeModule.stages[0]?.count || 1;
                    const barWidth = Math.max(8, Math.round((stage.count / total) * 100));
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        className={`cr-stage ${toneClass(stage.tone)}${stageId === stage.id ? " active" : ""}`}
                        onClick={() => pickStage(stage.id)}
                      >
                        <div className="cr-stage-row">
                          <span className="cr-stage-label">{stage.label}</span>
                          <span className="cr-stage-count">{stage.count.toLocaleString("en-IN")}</span>
                          <span className="cr-stage-pct">{stage.pct}</span>
                        </div>
                        <div className="cr-stage-bartrack" aria-hidden>
                          <div className={`cr-stage-bar ${toneClass(stage.tone)}`} style={{ width: `${barWidth}%` }} />
                        </div>
                        {stageId === stage.id && stage.breakdown && (
                          <div className="cr-stage-breakdown">
                            {stage.breakdown.map((row) => (
                              <div key={row.label}>
                                <span>{row.label}</span>
                                <span>{row.count}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </aside>

              <div className="cr-main">
                <div className="cr-toolbar">
                  <div className="cr-toolbar-title">
                    Orders
                    <span className="cr-badge">{stageOrderCount.toLocaleString("en-IN")}</span>
                  </div>
                  <input
                    className="cr-search"
                    type="search"
                    placeholder="Search name, phone, order…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search orders"
                  />
                </div>

                <div className="cr-orders" role="list">
                  {filteredOrders.length === 0 && (
                    <div className="cr-empty">No orders in this stage. Pick another funnel step.</div>
                  )}
                  {visibleOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      active={selected?.id === order.id}
                      onSelect={() => setSelectedId(order.id)}
                    />
                  ))}
                  {showMore && (
                    <div className="cr-show-more" aria-hidden>
                      Show more
                    </div>
                  )}
                </div>

                <div className="cr-flow" aria-label="Automation path">
                  {AUTOMATION_STEPS.map((step, i) => (
                    <div key={step.label} className="cr-flow-step">
                      <span className="cr-flow-dot" />
                      <div>
                        <strong>{step.label}</strong>
                        <span>{step.detail}</span>
                      </div>
                      {i < AUTOMATION_STEPS.length - 1 && <span className="cr-flow-line" aria-hidden />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function OrderCard({
  order,
  active,
  onSelect,
}: {
  order: DemoOrder;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="listitem"
      className={`cr-order${active ? " active" : ""}`}
      onClick={onSelect}
    >
      <div className="cr-order-top">
        <div>
          <strong>{order.name}</strong>
          <span className="cr-order-phone">{maskPhone(order.phone)}</span>
        </div>
        <span className="cr-order-amt">{formatInr(order.amount)}</span>
      </div>
      <div className="cr-order-mid">
        <span className="cr-order-id">{order.orderId}</span>
        <span className={`cr-status ${toneClass(order.statusTone)}`}>{order.status}</span>
      </div>
      <p className="cr-order-product">{order.product}</p>
      {order.meta && <p className="cr-order-meta">{order.meta}</p>}
    </button>
  );
}
