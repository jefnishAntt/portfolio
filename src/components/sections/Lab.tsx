import { ArrowUpRight, FlaskConical, Github } from "lucide-react";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import EmptyState from "@/components/ui/EmptyState";
import ExternalLink from "@/components/ui/ExternalLink";
import { BadgeList } from "@/components/ui/Badge";
import { EARLIER_BUILDS, LAB_EXPERIMENTS, type LabProject } from "@/data/lab";

function ProjectCard({ project }: { project: LabProject }) {
  const links = [
    project.github && { href: project.github, label: "GitHub", icon: Github },
    project.demo && { href: project.demo, label: "Demo", icon: ArrowUpRight },
  ].filter(Boolean) as { href: string; label: string; icon: typeof Github }[];

  return (
    <Card as="article" padding="sm" className="flex flex-col">
      <h4 className="font-semibold tracking-tight text-fg">{project.title}</h4>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>
      <BadgeList items={project.tags} label="Tags" className="mt-4" />
      {links.length > 0 && (
        <div className="mt-4 flex gap-4 border-t border-line pt-4">
          {links.map(({ href, label, icon: Icon }) => (
            <ExternalLink
              key={label}
              href={href}
              aria-label={`${project.title} on ${label}`}
              className="-my-2 inline-flex min-h-9 items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-accent"
            >
              <Icon className="size-3.5" aria-hidden /> {label}
            </ExternalLink>
          ))}
        </div>
      )}
    </Card>
  );
}

export default function Lab() {
  return (
    <Section id="lab" label="03 / lab" title="Experiments" intro="Where the roadmap turns into things that run.">
      {LAB_EXPERIMENTS.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {LAB_EXPERIMENTS.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      ) : (
        <EmptyState icon={FlaskConical} title="Experiments loading…" text="First project coming soon." />
      )}

      {EARLIER_BUILDS.length > 0 && (
        <div className="mt-14">
          <Eyebrow as="h3" className="mb-4">
            Earlier builds
          </Eyebrow>
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
