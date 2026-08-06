import DeskLampHero from "@/components/noir/desk-lamp-hero";
import DossierReveal from "@/components/noir/dossier-reveal";
import SuspectBoard from "@/components/noir/suspect-board";
import BookingSection from "@/components/noir/booking-section";
import NoirFooter from "@/components/noir/noir-footer";
import MagnifyingCursor from "@/components/noir/magnifying-cursor";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <MagnifyingCursor />
      <DeskLampHero />
      <DossierReveal />
      <SuspectBoard />
      <BookingSection />
      <NoirFooter />
    </div>
  );
}
