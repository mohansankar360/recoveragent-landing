import type { LandingVariant } from "@/lib/landing-variant";

export function FinalCTA({ variant = "full" }: { variant?: LandingVariant }) {
  const isCold = variant === "cold";
  return (
    <section className="final">
      <div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 18 }}>
          Every day you wait
        </div>
        <h2 className="display">
          Without Recover Agent,
          <br />
          you&apos;re paying for tomorrow&apos;s RTOs today.
        </h2>
        <p>
          COD keeps shipping. Carts go cold. NDRs expire. Go live now — book 30
          minutes free consultation.
        </p>
        <div className="btns">
          <a className="btn btn-primary" href="#demo-booking">
            Go live now
          </a>
          <a className="btn btn-ghost" href="#calc">
            {isCold ? "Calculate my gap →" : "Find my gap in 30 seconds →"}
          </a>
        </div>
      </div>
    </section>
  );
}
