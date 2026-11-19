import Section from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import { BadgeList } from "@/components/ui/Badge";
import ExperienceTabs from "@/components/sections/ExperienceTabs";
import { EDUCATION, EXPERIENCE, SKILLS } from "@/config";

export default function About() {
  return (
    <Section id="about" label="01 / about">
      <div className="space-y-4 leading-relaxed text-fg/80">
        <p>
          I&apos;m a developer at <span className="text-fg">Haddy Designs</span>, working across frontend and backend. I
          build web and desktop apps with React, Next.js, TypeScript, Rust and Python, deployed on AWS.
        </p>
        <p>
          I&apos;m also a final-year CSE student at Anna University, and I&apos;m moving toward{" "}
          <span className="text-fg">brain-computer interfaces</span>, computational neuroscience and AI. Outside of work
          I&apos;m into calisthenics, poetry, sci-fi and self-help books.
        </p>
      </div>

      <div className="mt-12">
        <Eyebrow as="h3" className="mb-4">
          Experience
        </Eyebrow>
        <ExperienceTabs jobs={EXPERIENCE} />
      </div>

      <div className="mt-14">
        <Eyebrow as="h3" className="mb-4">
          Toolkit
        </Eyebrow>
        <dl className="space-y-4">
          {SKILLS.map((cat) => (
            <div key={cat.name} className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <dt className="shrink-0 text-sm text-fg sm:w-48">{cat.name}</dt>
              <dd>
                <BadgeList items={cat.items} label={cat.name} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-14">
        <Eyebrow as="h3" className="mb-4">
          Education
        </Eyebrow>
        <ul className="divide-y divide-line border-y border-line">
          {EDUCATION.map((edu) => (
            <li key={edu.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="text-fg">{edu.degree}</p>
                <p className="text-sm text-muted">{edu.institution}</p>
              </div>
              <Eyebrow>{edu.duration}</Eyebrow>
            </li>
          ))}
        </ul>
      </div>

      <figure className="mt-14 border-l-2 border-accent pl-5">
        <blockquote className="text-lg text-fg">&ldquo;Better a fool for five minutes than a fool for life.&rdquo;</blockquote>
        <Eyebrow as="figcaption" className="mt-2">
          a line I try to live by
        </Eyebrow>
      </figure>
    </Section>
  );
}
