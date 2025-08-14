import HeroSection from "@/components/home/hero";
import Navbar from "@/components/navbar";
import { LetterGlitch } from "@/components/ui/letter-glitch";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <LetterGlitch
        glitchColors={["white", "black", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent"]}
        glitchSpeed={12}
        smooth={true}
        outerVignette={true}
        centerVignette={true}
      />
      <HeroSection />
    </div>
  );
}
