import Link from "next/link";
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
          <Link className="btn btn-primary" href="/book-demo">
            Go live now
          </Link>
          <Link className="btn btn-ghost" href="/loss-calculator">
            {isCold ? "Calculate my gap →" : "Find my gap in 30 seconds →"}
          </Link>
        </div>
      </div>
    </section>
  );
}
