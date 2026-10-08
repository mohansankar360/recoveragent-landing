# Recover Agent page inventory

All active pages use the homepage's off-white surfaces, Geist typography, blue primary actions, and neutral borders. Green indicates successful outcomes in the product preview.

| Page | Route |
| --- | --- |
| Homepage | `/` |
| Recovery paths | `/where-you-leak` |
| Loss calculator | `/loss-calculator` |
| Control room | `/control-room` |
| Call demo | `/hear-a-call` |
| Voice and WhatsApp | `/why-calling` |
| Pricing | `/plans` |
| Onboarding | `/go-live` |
| How it works | `/how-it-works` |
| FAQ | `/faq` |
| Book a demo | `/book-demo` |
| COD verification | `/cod-verification` |
| Abandoned checkout recovery | `/abandoned-checkout-recovery` |
| NDR recovery | `/ndr-recovery` |
| Revenue audit / loss calculator | `/audit` |
| Lead capture | `/lead` |
| Booking calendar | `/calendar` |
| Blog index | `/blog` |
| Reduce RTO on Shopify | `/blog/reduce-rto-shopify-india` |
| NDR recovery playbook | `/blog/ndr-recovery-playbook` |
| COD verification before dispatch | `/blog/cod-verification-before-dispatch` |

There are 18 main pages and 3 blog articles. `/new` redirects to `/`.

Route content is defined in `src/app`, `src/lib/site-sections.ts`, `src/lib/site-use-cases.ts`, and `content/blog`.

Shared theme tokens live in `src/app/globals.css`. Secondary page layouts and treatments live in `src/app/page-theme.css`. The homepage uses the same brand tokens in `src/components/landing/ConversionHomepage.module.css`.
