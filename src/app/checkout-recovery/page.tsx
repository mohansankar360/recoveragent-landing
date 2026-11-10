import type { Metadata } from 'next';
import { TrialHomepage } from '@/components/landing/TrialHomepage';

export const metadata: Metadata = {
  title: 'Abandoned checkout recovery | RecoverAgent',
  robots: { index: false, follow: false },
};

export default function CheckoutRecoveryPage() {
  return <TrialHomepage refinedHero checkoutHook />;
}
