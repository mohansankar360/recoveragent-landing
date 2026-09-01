# Pricing section — revert to v1

Backups from before the Apple-design v2 update (Aug 2026).

## Quick revert

1. Copy `_backup/PlanComparisonTable.v1.tsx` → `PlanComparisonTable.tsx`
2. Copy `_backup/PlansCTA.v1.tsx` → `PlansCTA.tsx`
3. In `globals.css`, replace the plans block (`.plans-scroll-link` through the `@media (max-width: 720px)` plans rules) with contents of `_backup/plans-section.v1.css`

## What v2 changed

- Header row: "Plan" aligned with tier names (icon spacer + baseline)
- Row labels: text only, no per-row icons
- Per-tier CTAs: primary on Growth, ghost on Starter/Scale
- Mobile: stacked plan cards (no horizontal scroll)
- Press feedback on tier CTAs and mobile cards
- Bottom section: "Calculate my loss" only (Book demo moved into table)
