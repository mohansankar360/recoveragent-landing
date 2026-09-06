import { LandingPage } from "@/components/landing/LandingPage";
import { homeMetadata } from "@/lib/site-metadata";

export const metadata = homeMetadata;

export default function Home() {
  return <LandingPage variant="full" />;
}
