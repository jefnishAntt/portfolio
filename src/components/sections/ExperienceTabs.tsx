"use client";
import { useId, useState } from "react";
import Eyebrow from "@/components/ui/Eyebrow";
import type { Experience } from "@/types";

/**
 * Experience as tabs, one per company (like the Gazi Jarin site), placed in a column on the left
 * with a bar on the right edge of the active company, then the role, dates and bullet points.
 */
export default function ExperienceTabs({ jobs }: { jobs: Experience[] }) {
  const [active, setActive] = useState(0);
  const uid = useId();
  const job = jobs[active];

  return (
    <div className="flex items-start">
      <div role="tablist" aria-label="Companies" aria-orientation="vertical" className="flex w-32 shrink-0 flex-col items-stretch border-r border-line sm:w-44">
        {jobs.map((j, i) => {
          const selected = i === active;
          return (
            <button
              key={j.id}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const next = (i + (e.key === "ArrowDown" ? 1 : -1) + jobs.length) % jobs.length;
                  setActive(next);
                }
              }}
              className={`relative -mr-px whitespace-nowrap py-2 pl-2 pr-4 text-left text-sm transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-ink ${
                selected ? "text-fg" : "text-muted"
              }`}
            >
              {j.company}
              <span
                aria-hidden="true"
                className={`absolute inset-y-0 -right-px w-0.5 bg-accent-ink transition-opacity ${selected ? "opacity-100" : "opacity-0"}`}
              />
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${active}`} className="min-w-0 flex-1 pl-6 sm:pl-8">
        <h3 className="text-lg font-semibold tracking-tight text-fg">
          {job.role} <span className="text-accent-ink">@ {job.company}</span>
        </h3>
        <Eyebrow className="mt-1">
          {job.duration}
          {job.location && <> · {job.location}</>}
        </Eyebrow>
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted">
          {job.points.map((point) => (
            <li key={point} className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-accent-ink">
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
