'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Brain, Lightning, Package, PhoneCall, Storefront, Truck } from '@phosphor-icons/react';
import type { RecoveryPath } from '@/lib/recovery-paths-data';
import {
  CallShowcase,
  CaseStudySection,
  FinalSection,
  PageHero,
  StorySection,
  TrialButton,
  TrialSiteFrame,
  useTrial,
  type ScenarioKey,
} from './TrialHomepage';
import styles from './TrialHomepage.module.css';

/** Every sub page: shared header and footer, a dark page header, the page body, then the trial sign-up. */
export function SubPage({ crumbs, eyebrow, title, description, showCtas, finalFirst = false, children }: { crumbs: Array<{ href?: string; label: string }>; eyebrow?: string; title: string; description?: string; showCtas?: boolean; finalFirst?: boolean; children: React.ReactNode }) {
  return <TrialSiteFrame>
    <PageHero crumbs={crumbs} eyebrow={eyebrow} title={title} description={description} showCtas={showCtas} />
    {finalFirst && <FinalSection />}
    {children}
    {!finalFirst && <FinalSection />}
  </TrialSiteFrame>;
}

const scenarioByPath: Record<RecoveryPath['id'], ScenarioKey> = { cod: 'cod', abandoned: 'checkout', ndr: 'ndr' };

const useCaseDetails: Record<RecoveryPath['id'], { trigger: string; conversation: string; outcome: string; setup: string; points: string[] }> = {
  cod: {
    trigger: 'A COD order is placed on your store',
    conversation: 'The AI calls the buyer to confirm the order and the address before dispatch.',
    outcome: 'Confirmed orders are tagged Verified in Shopify. Cancellations and exceptions are flagged before you ship.',
    setup: 'Connect your store and agree dispatch cutoffs, quiet hours, retry rules and hold decisions.',
    points: ['Verified only on a clear yes from the buyer', 'Duplicate COD orders caught before dispatch', 'Up to 3 retries, with WhatsApp nudges in between'],
  },
  abandoned: {
    trigger: 'A shopper leaves at checkout with contact details',
    conversation: 'The AI asks what stopped them, answers questions on size, delivery or payment, then sends the checkout link on WhatsApp.',
    outcome: 'Completed orders are tracked so the follow-up stops on its own. Works with Shopify, GoKwik and Fastrr checkouts.',
    setup: 'Choose the delay before the call, any offer you want to mention and how completion is tracked.',
    points: ['Checkout link delivered on WhatsApp', 'Questions answered in the buyer’s language', 'No repeat follow-ups once the order is placed'],
  },
  ndr: {
    trigger: 'A delivery attempt fails',
    conversation: 'The AI asks the buyer what happened: not at home, wrong address or never contacted, and agrees the next step.',
    outcome: 'The reattempt or address fix is recorded for your team. With Delhivery the reattempt request can go out automatically.',
    setup: 'Connect your courier feed (Shiprocket or Delhivery) and set the reattempt window you work with.',
    points: ['Reattempt, reschedule or address fix captured', 'Buyer kept updated on WhatsApp', 'Saves orders before they turn into RTO'],
  },
};

const pathIcon: Record<RecoveryPath['id'], typeof Package> = { cod: Package, abandoned: Storefront, ndr: Truck };

/** Body of the three use-case pages. */
export function UseCaseContent({ path }: { path: RecoveryPath }) {
  const onTrial = useTrial();
  const detail = useCaseDetails[path.id];
  const steps = [
    { label: 'Trigger', text: detail.trigger, icon: pathIcon[path.id] },
    { label: 'Conversation', text: detail.conversation, icon: PhoneCall },
    { label: 'Outcome', text: detail.outcome, icon: Brain },
  ];
  return <>
    <section className={styles.useCaseSection} aria-labelledby="use-case-title">
      <div className={styles.sectionHead}>
        <p className={styles.eyebrow}>{path.tag}</p>
        <h2 id="use-case-title">How it runs, step by step.</h2>
      </div>
      <ol className={styles.useCaseSteps}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          return <motion.li key={step.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: index * 0.1 }}>
            <span className={styles.safetyIcon}><Icon size={22} weight="duotone" aria-hidden="true" /></span>
            <small>{index + 1}. {step.label}</small>
            <p>{step.text}</p>
          </motion.li>;
        })}
      </ol>
      <div className={styles.useCaseBottom}>
        <ul>{detail.points.map((point) => <li key={point}><Lightning size={16} weight="fill" aria-hidden="true" />{point}</li>)}</ul>
        <p><strong>What we set up with you:</strong> {detail.setup}</p>
        <TrialButton onClick={onTrial} source={`use_case_${path.id}`}>Try it free for 14 days</TrialButton>
      </div>
    </section>
    <CallShowcase defaultScenario={scenarioByPath[path.id]} title="Hear this workflow on a real call." />
    {path.id === 'cod' && <CaseStudySection />}
    <StorySection defaultScenario={scenarioByPath[path.id]} />
  </>;
}

const leakCards = [
  { id: 'cod' as const, title: 'COD orders that come back', text: 'Buyers who never wanted the order, or gave a wrong address. You pay to ship it both ways.', href: '/cod-verification', stat: '1 in 4 COD orders can come back' },
  { id: 'abandoned' as const, title: 'Checkouts left behind', text: 'Shoppers who reached checkout and left over a small doubt about size, delivery or payment.', href: '/abandoned-checkout-recovery', stat: 'Interested buyers, already at checkout' },
  { id: 'ndr' as const, title: 'Failed deliveries', text: 'The courier could not deliver. Without a quick follow-up, the parcel turns into RTO.', href: '/ndr-recovery', stat: 'Saveable before the return window closes' },
];

/** Three leak paths, each linking to its use-case page. */
export function LeakCards() {
  return <section className={styles.useCaseSection} aria-labelledby="leak-title">
    <div className={styles.sectionHead}>
      <p className={styles.eyebrow}>Three leaks, one agent</p>
      <h2 id="leak-title">Where D2C brands lose money every day.</h2>
    </div>
    <div className={styles.leakGrid}>
      {leakCards.map((card, index) => {
        const Icon = pathIcon[card.id];
        return <motion.a key={card.id} href={card.href} className={styles.leakCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: index * 0.1 }}>
          <span className={styles.safetyIcon}><Icon size={22} weight="duotone" aria-hidden="true" /></span>
          <h3>{card.title}</h3>
          <p>{card.text}</p>
          <small>{card.stat}</small>
          <span className={styles.leakLink}>See how we fix it <ArrowRight size={15} weight="bold" aria-hidden="true" /></span>
        </motion.a>;
      })}
    </div>
  </section>;
}
