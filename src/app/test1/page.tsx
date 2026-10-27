import type { Metadata } from 'next';
import { TrialHomepage } from '@/components/landing/TrialHomepage';

export const metadata: Metadata = {
  title: 'Hero comparison | RecoverAgent',
  robots: { index: false, follow: false },
};

export default function TestHeroPage() {
  return <TrialHomepage refinedHero />;
}
