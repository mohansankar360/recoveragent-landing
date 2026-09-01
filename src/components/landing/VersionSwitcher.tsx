"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANDING_VARIANTS, type LandingVariant } from "@/lib/landing-variant";

function activeVariant(pathname: string): LandingVariant | null {
  if (pathname === "/cold") return "cold";
  if (pathname === "/warm") return "warm";
  if (pathname === "/full") return "full";
  return null;
}

export function VersionSwitcher() {
  const pathname = usePathname();
  const current = activeVariant(pathname);

  if (!current) return null;

  return (
    <div className="version-switcher" role="navigation" aria-label="Landing page variants">
      <span className="version-switcher-label">Preview:</span>
      {LANDING_VARIANTS.map((variant) => (
        <Link
          key={variant.id}
          href={variant.path}
          className={`version-switcher-link${current === variant.id ? " is-active" : ""}`}
          aria-current={current === variant.id ? "page" : undefined}
        >
          {variant.label}
        </Link>
      ))}
      <Link href="/preview" className="version-switcher-home">
        All versions
      </Link>
    </div>
  );
}
