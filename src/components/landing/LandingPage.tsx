import type { LandingVariant } from "@/lib/landing-variant";

import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { RecoveryPaths } from "./RecoveryPaths";
import { ControlRoomDemo } from "./ControlRoomDemo";
import { LossCalculator } from "./LossCalculator";
import { PlansSection } from "./PlansSection";
import { CallDemo } from "./CallDemo";
import { CallVersus } from "./CallVersus";
import { GoLive } from "./GoLive";
import { FAQ } from "./FAQ";
import { DemoBooking } from "./DemoBooking";
import { FinalCTA } from "./FinalCTA";
import { Footer } from "./Footer";
import { ExitIntent } from "./ExitIntent";
import { MobileStickyCTA } from "./MobileStickyCTA";
import { VersionSwitcher } from "./VersionSwitcher";

function WarmPage() {
  return (
    <>
      <VersionSwitcher />
      <Navbar variant="warm" />
      <main>
        <Hero variant="warm" />
        <RecoveryPaths />
        <LossCalculator />
        <ControlRoomDemo />
        <CallDemo variant="warm" />
        <PlansSection />
        <GoLive compact />
        <FAQ variant="warm" />
        <DemoBooking />
        <FinalCTA variant="warm" />
      </main>
      <Footer />
      <MobileStickyCTA />
      <ExitIntent />
    </>
  );
}

function ColdPage() {
  return (
    <>
      <VersionSwitcher />
      <Navbar variant="cold" />
      <main>
        <Hero variant="cold" />
        <RecoveryPaths />
        <LossCalculator showInlineDemoCta />
        <ControlRoomDemo />
        <CallDemo variant="full" />
        <PlansSection />
        <GoLive compact />
        <DemoBooking compact />
        <FAQ variant="cold" />
        <FinalCTA variant="cold" />
      </main>
      <Footer />
      <MobileStickyCTA />
      <ExitIntent />
    </>
  );
}

function FullPage() {
  return (
    <>
      <Navbar variant="full" />
      <main>
        <Hero variant="full" />
        <RecoveryPaths />
        <LossCalculator />
        <ControlRoomDemo />
        <CallDemo variant="full" />
        <CallVersus />
        <PlansSection />
        <GoLive />
        <FAQ variant="full" />
        <DemoBooking />
        <FinalCTA variant="full" />
      </main>
      <Footer />
      <MobileStickyCTA />
      <ExitIntent />
    </>
  );
}

export function LandingPage({ variant = "full" }: { variant?: LandingVariant }) {
  if (variant === "warm") return <WarmPage />;
  if (variant === "cold") return <ColdPage />;
  return <FullPage />;
}
