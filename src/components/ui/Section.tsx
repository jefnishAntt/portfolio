import Reveal from "./Reveal";

export default function Section({
  id,
  label,
  title,
  intro,
  children,
}: {
  id: string;
  label: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} tabIndex={-1} className="py-20 sm:py-28">
      <Reveal>
        <p className="font-mono text-xs text-faint">{label}</p>
        <h2 id={`${id}-title`} className="mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          {title}
        </h2>
        {intro && <p className="mt-3 max-w-prose leading-relaxed">{intro}</p>}
      </Reveal>
      <Reveal delay={0.08} className="mt-10">
        {children}
      </Reveal>
    </section>
  );
}
