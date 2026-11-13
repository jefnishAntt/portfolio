import Section from "@/components/ui/Section";
import { EDUCATION, EXPERIENCE, SKILLS } from "@/config";

const Label = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-4 font-mono text-xs text-faint">{children}</h3>
);

export default function About() {
  return (
    <Section id="about" label="01 / about" title="Where the brain meets technology">
      <div className="space-y-5 leading-relaxed">
        <p>
          I&apos;m a developer at <span className="text-fg">Haddy Designs</span>, working across frontend and
          backend: API design, database schema, deployment, and production support. I build web and desktop apps with
          React, Next.js, TypeScript, Rust, and Python, deployed on AWS.
        </p>
        <p>
          I&apos;m also a final-year CSE student at Anna University. I&apos;m moving toward{" "}
          <span className="text-fg">brain-computer interfaces, computational neuroscience, and AI</span>, and learning
          the maths, AI, and neuroscience behind them one step at a time.
        </p>
        <p>Outside of work, I&apos;m into calisthenics, poetry, sci-fi novels, and self-help books.</p>
      </div>

      <div className="mt-14">
        <Label>Experience</Label>
        {EXPERIENCE.map((job) => (
          <article key={job.id} className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h4 className="font-medium text-fg">
                {job.role} <span className="text-muted">· {job.company}</span>
              </h4>
              <p className="font-mono text-xs text-faint">{job.duration}</p>
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed">
              {job.points.map((point, i) => (
                <li key={i} className="relative pl-5">
                  <span className="absolute left-0 top-[0.6em] size-1 rounded-full bg-accent" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-14">
        <Label>Education</Label>
        <ul className="divide-y divide-line border-y border-line">
          {EDUCATION.map((edu) => (
            <li key={edu.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="text-fg">{edu.degree}</p>
                <p className="text-sm">{edu.institution}</p>
              </div>
              <p className="font-mono text-xs text-faint">{edu.duration}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-14">
        <Label>Toolkit</Label>
        <dl className="space-y-4">
          {SKILLS.map((cat) => (
            <div key={cat.name} className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <dt className="shrink-0 text-sm text-fg sm:w-48">{cat.name}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <span key={item} className="rounded-md border border-line px-2 py-0.5 font-mono text-xs">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <figure className="mt-14 border-l-2 border-accent pl-5">
        <blockquote className="text-lg text-fg">&ldquo;Better a fool for five minutes than a fool for life.&rdquo;</blockquote>
        <figcaption className="mt-2 font-mono text-xs text-faint">a line I try to live by</figcaption>
      </figure>
    </Section>
  );
}
