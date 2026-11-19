import { ArrowUpRight, PenLine } from "lucide-react";
import Section from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import EmptyState from "@/components/ui/EmptyState";
import ExternalLink from "@/components/ui/ExternalLink";
import { POSTS } from "@/data/writing";

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function Writing() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Section
      id="writing"
      label="04 / writing"
      title="Writing"
      intro="Notes and explainers on what I'm learning, from building software to reading the brain."
    >
      {posts.length === 0 ? (
        <EmptyState icon={PenLine} title="First post coming soon." text="Starting with EEG, explained for web developers." />
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {posts.map((post) => (
            <li key={post.url}>
              <ExternalLink
                href={post.url}
                className="group grid gap-1 py-4 sm:grid-cols-[7rem_1fr_auto] sm:items-baseline sm:gap-6"
              >
                <Eyebrow as="time" dateTime={post.date}>
                  {formatDate(post.date)}
                </Eyebrow>
                <span>
                  <span className="text-fg group-hover:text-accent">{post.title}</span>
                  {post.summary && <span className="mt-0.5 block text-sm text-muted">{post.summary}</span>}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="hidden size-4 text-faint transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-accent sm:block"
                />
              </ExternalLink>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
