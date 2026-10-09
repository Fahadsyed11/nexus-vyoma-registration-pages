import HeroNavbarTransition from "@/components/hero/HeroNavbarTransition";
import AboutSection from "@/components/about/AboutSection";
import FlagshipEventsSection from "@/components/events/FlagshipEventsSection";
import SponsorsSection from "@/components/sponsors/SponsorsSection";
import RegisterCTASection from "@/components/cta/RegisterCTASection";
import FooterSection from "@/components/footer/FooterSection";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-transparent font-sans text-white selection:bg-[#FF6A00] selection:text-white">
      {/* 01 & 02 — Hero Section with GSAP Waypoint Transition to Fixed Mirror-Glass Navbar */}
      <HeroNavbarTransition />

      <main className="flex-1 flex flex-col w-full z-10">
        {/* 03 — About Nexus Vyoma with Subtle Background Watermark & ScrollReveal */}
        <AboutSection />

        {/* 04 — Flagship Arenas & Competitions (Scroll Expand Card Sequence) */}
        <FlagshipEventsSection />

        {/* 05 — Partners & Sponsors 3D Orbit Carousel */}
        <SponsorsSection />

        {/* 06 — Official Registration Portal CTA */}
        <RegisterCTASection />
      </main>

      {/* 07 — Cinematic Oversized Text-Stroke Footer */}
      <FooterSection />
    </div>
  );
}
