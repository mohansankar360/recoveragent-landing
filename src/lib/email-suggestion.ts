// Common misspellings of the inboxes Indian founders use. A wrong domain still
// passes the email pattern, so the calendar invite would silently never arrive.
const DOMAIN_FIXES: Record<string, string> = {
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.om": "gmail.com",
  "gmail.comm": "gmail.com",
  "gmail.in": "gmail.com",
  "gmail.co.in": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmil.com": "gmail.com",
  "gmali.com": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yaho.co.in": "yahoo.co.in",
  "hotmal.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outllok.com": "outlook.com",
  "redifmail.com": "rediffmail.com",
  "rediffmail.co": "rediffmail.com",
  "icloud.co": "icloud.com",
};

/** Returns a corrected address when the domain looks like a typo, else null. */
export function suggestEmailCorrection(email: string): string | null {
  const trimmed = email.trim();
  const at = trimmed.lastIndexOf("@");
  if (at < 1) return null;
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1).toLowerCase();
  if (!domain) return null;

  let fixed = DOMAIN_FIXES[domain];
  if (!fixed && domain.endsWith(".con")) fixed = `${domain.slice(0, -4)}.com`;
  if (fixed) fixed = DOMAIN_FIXES[fixed] ?? fixed;
  return fixed && fixed !== domain ? `${local}@${fixed}` : null;
}
