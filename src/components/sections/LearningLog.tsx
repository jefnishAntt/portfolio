"use client";
import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import Section from "@/components/ui/Section";
import entries from "@/data/learning-log.json";

const INITIAL = 6;
const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
const fmt = (d: string) => d.replaceAll("-", ".");

export default function LearningLog() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? sorted : sorted.slice(0, INITIAL);
  const hidden = sorted.length - INITIAL;

  return (
    <Section id="log" label="03 / learning log" title="Notes from the path" intro="Small, honest updates. Newest first.">
      <ol id="log-list" className="divide-y divide-line border-y border-line">
        <AnimatePresence initial={false}>
          {visible.map((item) => (
            <m.li
              key={item.date + item.entry}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
                <time dateTime={item.date} className="shrink-0 pt-0.5 font-mono text-xs text-faint sm:w-24">
                  {fmt(item.date)}
                </time>
                <p className="leading-relaxed">{item.entry}</p>
              </div>
            </m.li>
          ))}
        </AnimatePresence>
      </ol>

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls="log-list"
          className="mt-6 min-h-10 rounded-full border border-line bg-surface px-4 py-1.5 font-mono text-xs text-muted transition-colors duration-300 hover:border-line-strong hover:text-accent-ink"
        >
          {expanded ? "Show less" : `Show more (${hidden})`}
        </button>
      )}
    </Section>
  );
}
