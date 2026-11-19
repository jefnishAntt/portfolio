import { existsSync } from "node:fs";
import path from "node:path";
import { FileDown } from "lucide-react";
import Brainwave from "@/components/effects/Brainwave";
import Avatar from "@/components/ui/Avatar";
import Reveal from "@/components/ui/Reveal";
import BrainLauncher from "@/components/brain/BrainLauncher";
import { iconButton, textButton } from "@/components/ui/button-styles";
import { PROFILE, SOCIAL_LINKS } from "@/config";

/** The Résumé button appears only once public/resume.pdf exists (checked when the site is built). */
const RESUME_PATH = "/resume.pdf";
const HAS_RESUME = existsSync(path.join(process.cwd(), "public", "resume.pdf"));

export default function Hero() {
  const initials = PROFILE.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

  return (
    <section id="home" aria-labelledby="home-title" tabIndex={-1} className="relative isolate">
      <div className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2">
        <Brainwave />
      </div>

      {/* The hero fills exactly the first screen (the next section starts below the fold).
          On laptops the profile (left) and the brain (right) sit side by side as one group,
          centred with equal space on both sides. On phones the brain sits on top. */}
      <div className="flex min-h-svh flex-col-reverse items-center justify-center gap-2 pb-10 pt-20 lg:mx-[calc((100%_-_min(64rem,100vw_-_4rem))/2)] lg:flex-row lg:gap-12 lg:pb-12">
        <Reveal className="w-full max-w-xl lg:w-auto">
          {/* Row 1: photo right beside the name. Row 2 onward: the details, full width below. */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Soft halo ring around a framed, black-and-white photo */}
            <div className="shrink-0 rounded-full bg-gradient-to-b from-fg/10 via-fg/5 to-transparent p-1">
              <Avatar
                src={PROFILE.photo}
                name={PROFILE.name}
                initials={initials}
                grayscale
                sizes="(min-width: 1024px) 144px, (min-width: 640px) 128px, 96px"
                className="size-[4.5rem] border-2 shadow-md ring-4 ring-bg min-[390px]:size-[5.25rem] sm:size-[6.5rem] lg:size-[7.25rem]"
              />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-xs text-faint" aria-hidden="true">
                {"// hi, i'm"}
              </p>
              <h1 id="home-title" className="mt-1 text-[2rem] font-bold leading-[1.1] tracking-tight text-fg min-[390px]:text-[2.25rem] sm:text-[2.75rem]">
                {PROFILE.firstName} <span className="text-muted">{PROFILE.lastName}</span>
              </h1>
            </div>
          </div>

          <p className="mt-6 text-[1.0625rem] leading-relaxed text-fg/80">{PROFILE.tagline}</p>
          <p className="mt-2 font-mono text-xs leading-relaxed text-muted">
            <span className="block">Developer @ Haddy Designs</span>
            <span className="block">Final-year CSE, Anna University</span>
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <ul className="flex gap-2" aria-label="Contact links">
              {SOCIAL_LINKS.map(({ name, url, icon: Icon }) => (
                <li key={name}>
                  <a
                    href={url}
                    aria-label={url.startsWith("http") ? `${name} (opens in a new tab)` : name}
                    title={name}
                    {...(url.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                    className={iconButton}
                  >
                    <Icon size={16} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
            {HAS_RESUME && (
              <a href={RESUME_PATH} download className={`${textButton} text-sm`}>
                <FileDown size={15} aria-hidden />
                Résumé
                <span className="sr-only"> (PDF download)</span>
              </a>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="shrink-0">
          <BrainLauncher />
        </Reveal>
      </div>
    </section>
  );
}
