/** Apple-style motion presets (WWDC *Designing Fluid Interfaces*) */

export const appleSpring = {
  /** Critically damped — default UI, no overshoot */
  ui: { type: "spring" as const, bounce: 0, duration: 0.4 },
  /** Sheets / drawers — slight bounce when gesture carried momentum */
  sheet: { type: "spring" as const, bounce: 0.2, duration: 0.3 },
  /** Flick / throw handoff */
  momentum: { type: "spring" as const, bounce: 0.2, duration: 0.4 },
} as const;

export const appleFade = {
  duration: 0.2,
  ease: "easeOut" as const,
};

/** Pointer-follow springs (magnetic buttons, etc.) */
export const applePointerSpring = {
  bounce: 0,
  duration: 0.4,
};
