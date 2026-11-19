import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import { regionForSection } from "@/data/section-regions";

export default function Section({
  id,
  label,
  title,
  intro,
  children,
}: {
  id: string;
  label: string;
  title?: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  const region = regionForSection(id);
  return (
    <section id={id} aria-labelledby={title ? `${id}-title` : undefined} aria-label={title ? undefined : label} tabIndex={-1} className="py-16 text-base sm:py-20">
      <Reveal>
        <Eyebrow>
          {label}
          {region && (
            <span title={`${region.name}: ${region.why}`}>
              {" · "}
              <span className="text-accent-ink">{region.name.toLowerCase()}</span>
            </span>
          )}
        </Eyebrow>
        {title && (
          <h2 id={`${id}-title`} className="mt-2 text-[1.375rem] font-semibold leading-snug tracking-tight text-fg">
            {title}
          </h2>
        )}
        {intro && <p className="mt-2 max-w-prose leading-relaxed text-muted">{intro}</p>}
      </Reveal>
      <Reveal delay={0.08} className="mt-8">
        {children}
      </Reveal>
    </section>
  );
}
