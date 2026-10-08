import { getDisqualificationMessage } from '@/lib/demo-booking';

export function DemoEligibilityNotice({ monthlyOrders, storePlatform }: { monthlyOrders: string; storePlatform: string }) {
  const reason = getDisqualificationMessage({ monthlyOrders, storePlatform });
  return <div className="demo-eligibility">
    <p>Live demos: Shopify or WooCommerce stores with 500+ monthly orders.</p>
    {reason && <p role="status">{storePlatform === 'other' ? 'This platform is not supported. Choose Shopify or WooCommerce to book a demo.' : 'Under 500 orders? Request an onboarding call below to explore WhatsApp recovery.'}</p>}
  </div>;
}
