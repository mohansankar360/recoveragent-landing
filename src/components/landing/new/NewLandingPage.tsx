import { CallDemo } from "../CallDemo";
import { CallVersus } from "../CallVersus";
import { ControlRoomDemo } from "../ControlRoomDemo";
import { DemoBooking } from "../DemoBooking";
import { ExitIntent } from "../ExitIntent";
import { FAQ } from "../FAQ";
import { FinalCTA } from "../FinalCTA";
import { Footer } from "../Footer";
import { GoLive } from "../GoLive";
import { LossCalculator } from "../LossCalculator";
import { RecoveryPaths } from "../RecoveryPaths";
import { CaseStudyCards } from "./CaseStudyCards";
import { ConversionCTA } from "./ConversionCTA";
import { ManualVsRecover } from "./ManualVsRecover";
import { NewHero } from "./NewHero";
import { NewMobileStickyCTA } from "./NewMobileStickyCTA";
import { NewNavbar } from "./NewNavbar";
import { NewPlansSection } from "./NewPlansSection";
import { SelfCheckSection } from "./SelfCheckSection";
import { StatsStrip } from "./StatsStrip";

export function NewLandingPage() {
  return (
    <div className="new-landing">
      <NewNavbar />
      <main>
        <NewHero />
        <StatsStrip />
        <RecoveryPaths />
        <SelfCheckSection />
        <LossCalculator />
        <ConversionCTA
          title="Know your gap? See it recover."
          subtitle="Book 15 minutes — we'll walk through your COD volume, RTO rate, and what Recover Agent would do on your store."
          source="post_calculator"
        />
        <ManualVsRecover />
        <ControlRoomDemo />
        <ConversionCTA
          title="See the control room on your data."
          subtitle="One dashboard for COD confirmations, cart recovery, and NDR re-attempts."
          primaryLabel="Book a demo"
          secondaryHref="/new#call"
          secondaryLabel="Hear a call first →"
          source="post_control_room"
          compact
        />
        <CallDemo variant="full" />
        <CallVersus />
        <CaseStudyCards />
        <NewPlansSection />
        <GoLive />
        <FAQ variant="full" />
        <DemoBooking />
        <FinalCTA variant="full" />
      </main>
      <Footer />
      <NewMobileStickyCTA />
      <ExitIntent />
    </div>
  );
}
