import Dock from "@/components/layout/Dock";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
import About from "@/components/sections/About";
import Hero from "@/components/sections/Hero";
import Lab from "@/components/sections/Lab";
import LearningLog from "@/components/sections/LearningLog";
import SkillTree from "@/components/sections/SkillTree";

export default function Portfolio() {
  return (
    <Providers>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:border focus:border-line focus:bg-surface focus:px-3 focus:py-2 focus:text-fg"
      >
        Skip to content
      </a>

      <Dock />

      <main className="mx-auto max-w-[720px] px-4 sm:px-6">
        <Hero />
        <About />
        <SkillTree />
        <LearningLog />
        <Lab />
      </main>

      <Footer />
    </Providers>
  );
}
