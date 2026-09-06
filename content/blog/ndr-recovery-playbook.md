---
slug: ndr-recovery-playbook
title: NDR recovery playbook for Indian D2C brands
description: What to do when a delivery fails in India — NDR basics, why orders slip into RTO, and how AI voice follow-up helps schedule re-attempts before return.
publishedAt: 2026-01-14
---

A non-delivery report (NDR) is the moment an order is still recoverable — if you reach the customer before the carrier closes the attempt window and initiates return-to-origin.

Most D2C teams treat NDR as a logistics notification. Recovery-focused teams treat it as a customer conversation.

## What NDR means in practice

When a courier cannot deliver, they log a reason: customer unavailable, address issue, refused delivery, or similar. That triggers a countdown. If nobody resolves it, the order becomes RTO and you absorb freight both ways.

## Why NDRs convert to RTO

1. **No one calls the customer** — the status sits in the carrier portal until it expires.
2. **WhatsApp-only follow-up** — read late or ignored.
3. **Wrong language or timing** — the customer misses the attempt window.
4. **No re-attempt scheduled** — ops never captures a new delivery slot.

## A simple NDR recovery workflow

### Step 1 — Detect the failed delivery

Your shipping integration or carrier webhook surfaces the NDR against the order in Shopify or WooCommerce.

### Step 2 — Contact the customer quickly

An AI voice call asks what went wrong: unavailable, wrong address, reschedule, or refuse. Regional languages matter — Recover Agent supports Hindi, Tamil, Telugu, Malayalam, Kannada, and English on calls.

### Step 3 — Capture the outcome

Confirm a re-attempt time, updated address, or cancellation before RTO. Send WhatsApp confirmation with the new slot or next action.

### Step 4 — Write back to the store

Tag the order, update status, and track the recovery in your dashboard — not a separate ops sheet.

See the NDR stage in [how it works](/how-it-works) and the live funnel in [control room](/control-room).

## NDR vs COD verification — different moments

| Moment | Problem | Goal |
| --- | --- | --- |
| Before dispatch | Unwanted or unconfirmed COD | Do not ship junk |
| After failed delivery | Customer unreachable or address issue | Re-attempt before RTO |

Recover Agent handles both paths. Deep dive: [NDR recovery](/ndr-recovery) and [COD verification](/cod-verification).

## What not to promise customers on the call

Keep it operational: delivery timing, address confirmation, re-attempt scheduling. This is not a upsell call — it is a save-the-order call.

## Tracking recovery, not just attempts

Your dashboard should show NDR reason, call outcome, re-attempt booked, and whether RTO was prevented — compared to your pre-signup baseline, not a generic industry benchmark. See the [FAQ](/faq) on how results are measured.

## Fit for your store

NDR recovery matters most when you ship enough volume that failed deliveries are a recurring line item — and when your current process relies on carriers alone. Stores under ~500 orders/month or with negligible NDR volume may not need a dedicated recovery layer yet.

## Next step

Estimate failed-delivery leakage with the [loss calculator](/loss-calculator), listen to an NDR call sample on [hear a call](/hear-a-call), and [book a demo](/book-demo) to walk through the workflow on your numbers.
