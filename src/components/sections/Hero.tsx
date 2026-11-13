import Image from "next/image";
import Brainwave from "@/components/effects/Brainwave";
import BrainLauncher from "@/components/brain/BrainLauncher";
import Reveal from "@/components/ui/Reveal";
import { PROFILE, SOCIAL_LINKS } from "@/config";

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

      <div className="flex min-h-[88svh] flex-col-reverse items-start justify-center gap-6 pb-16 pt-28 md:flex-row md:items-center md:justify-between md:gap-4 md:py-24">
        <Reveal className="w-full max-w-md md:w-auto">
          {PROFILE.openToWork && <StatusTag />}

          <div className="mt-6 flex items-center gap-4 sm:gap-5">
            <Avatar initials={initials} />
            <div>
              <p className="font-mono text-xs text-faint" aria-hidden="true">
                {"// hi, i'm"}
              </p>
              <h1 id="home-title" className="mt-1 text-[2rem] font-bold leading-tight tracking-tight text-fg min-[380px]:text-4xl sm:text-5xl">
                {PROFILE.firstName} <span className="text-muted">{PROFILE.lastName}</span>
              </h1>
            </div>
          </div>
          <p className="mt-5 text-lg leading-relaxed">{PROFILE.tagline}</p>
          <p className="mt-2 font-mono text-xs text-faint">
            Developer @ Haddy Designs · Final-year CSE, Anna University
          </p>

          <ul className="mt-8 flex gap-2" aria-label="Contact links">
            {SOCIAL_LINKS.map(({ name, url, icon: Icon }) => (
              <li key={name}>
                <a
                  href={url}
                  aria-label={url.startsWith("http") ? `${name} (opens in a new tab)` : name}
                  title={name}
                  {...(url.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                  className="grid size-10 place-items-center rounded-full border border-line bg-surface text-muted transition-colors duration-300 hover:border-line-strong hover:text-accent-ink"
                >
                  <Icon size={17} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15} className="shrink-0 self-center">
          <BrainLauncher />
        </Reveal>
      </div>
    </section>
  );
}

/** Initials (or photo) in a clean circle with a faint violet tint. No animation. */
function Avatar({ initials }: { initials: string }) {
  return (
    <div
      className="relative size-14 shrink-0 overflow-hidden rounded-full border border-line-strong bg-surface sm:size-16"
      style={{ backgroundImage: "radial-gradient(circle at 30% 20%, var(--accent-soft), transparent 70%)" }}
    >
      {PROFILE.photo ? (
        <Image src={PROFILE.photo} alt={`Portrait of ${PROFILE.name}`} fill sizes="64px" priority className="object-cover" />
      ) : (
        <div
          role="img"
          aria-label={`${PROFILE.name} (photo placeholder)`}
          className="grid size-full place-items-center text-lg font-semibold tracking-tight text-fg"
        >
          {initials}
        </div>
      )}
    </div>
  );
}

/** "Open to opportunities", written as a line of code to match "// hi, i'm". Links to email. */
function StatusTag() {
  return (
    <a
      href={`mailto:${PROFILE.email}`}
      aria-label="Open to work: email me"
      className="group inline-flex min-h-8 items-center font-mono text-xs text-faint transition-colors duration-300 hover:text-muted"
    >
      <span aria-hidden="true">
        <span className="text-muted">open_to_work</span> = <span className="text-accent-ink">true</span>
      </span>
      <span aria-hidden="true" className="cursor-blink ml-1 inline-block h-3.5 w-[0.5em] bg-accent-ink" />
    </a>
  );
}
