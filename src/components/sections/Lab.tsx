import { ArrowUpRight, FlaskConical, Github } from "lucide-react";
import Section from "@/components/ui/Section";
import { EARLIER_BUILDS, LAB_EXPERIMENTS, type LabProject } from "@/data/lab";

function ProjectCard({ project }: { project: LabProject }) {
  const links = [
    project.github && { href: project.github, label: "GitHub", icon: Github },
    project.demo && { href: project.demo, label: "Demo", icon: ArrowUpRight },
  ].filter(Boolean) as { href: string; label: string; icon: typeof Github }[];

  return (
    <article className="flex flex-col rounded-xl border border-line bg-surface p-5 transition-colors duration-300 hover:border-line-strong hover:bg-surface-hover">
      <h4 className="font-medium text-fg">{project.title}</h4>
      <p className="mt-2 flex-1 text-sm leading-relaxed">{project.description}</p>
      <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-accent-ink" aria-label="Tags">
        {project.tags.map((tag) => (
          <li key={tag}>#{tag}</li>
        ))}
      </ul>
      {links.length > 0 && (
        <div className="mt-4 flex gap-4 border-t border-line pt-4">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on ${label}`}
              className="-my-2 inline-flex min-h-9 items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-accent-ink"
            >
              <Icon size={13} aria-hidden /> {label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

export default function Lab() {
  return (
    <Section
      id="lab"
      label="04 / lab"
      title="Experiments"
      intro="Where the roadmap turns into things that run."
    >
      {LAB_EXPERIMENTS.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {LAB_EXPERIMENTS.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-line-strong px-6 py-14 text-center">
          <FlaskConical size={22} className="text-accent-ink" aria-hidden />
          <p className="mt-4 font-mono text-sm text-fg">Experiments loading…</p>
          <p className="mt-1 text-sm">First project coming soon.</p>
        </div>
      )}

      {EARLIER_BUILDS.length > 0 && (
        <div className="mt-14">
          <h3 className="mb-4 font-mono text-xs text-faint">Earlier builds</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {EARLIER_BUILDS.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
