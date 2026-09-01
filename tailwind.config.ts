import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Pink = CTA + logo only. Never backgrounds or glows. */
        brand: {
          DEFAULT: "#F855A6",
          dark: "#D93D8E",
        },
        /* Operational semantic palette */
        ops: {
          cod: "#B45309",
          "cod-bg": "#FFFBEB",
          confirm: "#047857",
          "confirm-bg": "#ECFDF5",
          loss: "#B91C1C",
          "loss-bg": "#FEF2F2",
          ndr: "#C2410C",
          "ndr-bg": "#FFF7ED",
        },
        canvas: {
          DEFAULT: "#F8F9FA",
          subtle: "#F1F3F5",
          panel: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#18181B",
          muted: "#52525B",
          faint: "#A1A1AA",
        },
        line: {
          DEFAULT: "#E4E4E7",
          strong: "#D4D4D8",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 2px rgba(24,24,27,0.04), 0 8px 24px rgba(24,24,27,0.06)",
        float: "0 4px 16px rgba(24,24,27,0.08), 0 1px 3px rgba(24,24,27,0.04)",
      },
      borderRadius: {
        panel: "12px",
        shell: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
