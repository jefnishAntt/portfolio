import { Check, Lock } from "lucide-react";
import Section from "@/components/ui/Section";
import { SKILL_TREE, type SkillStatus } from "@/data/skill-tree";

const STATUS_LABEL: Record<SkillStatus, string> = {
  completed: "done",
  "in-progress": "learning",
  locked: "locked",
};

function Node({ status }: { status: SkillStatus }) {
  if (status === "completed") {
    return (
      <span
        className="relative z-10 grid size-6 place-items-center rounded-full bg-accent text-white"
        style={{ boxShadow: "0 0 0 4px var(--accent-soft), 0 0 18px var(--accent-glow)" }}
      >
        <Check size={13} strokeWidth={3} aria-hidden />
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="relative z-10 grid size-6 place-items-center rounded-full border-2 border-accent bg-bg">
        <span className="pulse-ring absolute inset-0 rounded-full border border-accent" aria-hidden="true" />
        <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
      </span>
    );
  }
  return (
    <span className="relative z-10 grid size-6 place-items-center rounded-full border border-line-strong bg-bg text-faint">
      <Lock size={11} aria-hidden />
    </span>
  );
}

export default function SkillTree() {
  const done = SKILL_TREE.filter((n) => n.status === "completed").length;
  const pct = Math.round((done / SKILL_TREE.length) * 100);

  return (
    <Section
      id="skills"
      label="02 / skill tree"
      title="The learning roadmap"
      intro="From writing code to reading brain signals. Each node unlocks the next."
    >
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-8">
        <div className="mb-8 flex items-center gap-4">
          <div
            className="h-1 flex-1 overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-valuenow={done}
            aria-valuemin={0}
            aria-valuemax={SKILL_TREE.length}
            aria-label="Roadmap progress"
          >
            <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
          <p className="font-mono text-xs text-faint">
            {done}/{SKILL_TREE.length} complete
          </p>
        </div>

        <ol>
          {SKILL_TREE.map((node, i) => {
            const isLast = i === SKILL_TREE.length - 1;
            const traveled = node.status === "completed";
            return (
              <li key={node.id} className="relative flex gap-4 pb-7 last:pb-0">
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${traveled ? "bg-accent" : "bg-line"}`}
                    style={traveled ? { boxShadow: "0 0 8px var(--accent-glow)" } : undefined}
                  />
                )}
                <Node status={node.status} />
                <div className="flex-1 pt-0.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className={`font-medium ${node.status === "locked" ? "text-muted" : "text-fg"}`}>{node.title}</h3>
                    <span
                      className={`font-mono text-[11px] ${node.status === "locked" ? "text-faint" : "text-accent-ink"}`}
                    >
                      {STATUS_LABEL[node.status]}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${node.status === "locked" ? "text-faint" : ""}`}>{node.note}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
