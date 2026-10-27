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
import { ConversionHomepage } from "./ConversionHomepage";
import { TrialHomepage } from "./TrialHomepage";

function WarmPage() {
  return (
    <>
      <VersionSwitcher />
      <Navbar />
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
      <Navbar />
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
  return <TrialHomepage refinedHero />;
}

export function LandingPage({ variant = "full" }: { variant?: LandingVariant | "classic" }) {
  if (variant === "warm") return <WarmPage />;
  if (variant === "cold") return <ColdPage />;
  if (variant === "classic") return <ConversionHomepage />;
  return <FullPage />;
}
