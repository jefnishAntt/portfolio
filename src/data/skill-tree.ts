/**
 * Learning roadmap. Update `status` as you progress:
 *   "completed"   → glows in the accent colour
 *   "in-progress" → pulses softly
 *   "locked"      → dimmed
 */
export type SkillStatus = "completed" | "in-progress" | "locked";

export interface SkillNode {
  id: string;
  title: string;
  note: string;
  status: SkillStatus;
}

export const SKILL_TREE: SkillNode[] = [
  { id: "python", title: "Python", note: "The language the rest of the path is written in.", status: "completed" },
  { id: "algebra", title: "Algebra", note: "Functions, equations, getting fluent with symbols.", status: "completed" },
  { id: "linear-algebra", title: "Linear Algebra", note: "Vectors, matrices, and the geometry behind ML.", status: "in-progress" },
  { id: "machine-learning", title: "Machine Learning", note: "Models that learn patterns from data.", status: "locked" },
  { id: "deep-learning", title: "Deep Learning", note: "Neural networks, layer by layer.", status: "locked" },
  { id: "signal-processing", title: "Signal Processing", note: "Filters, Fourier transforms, frequency bands.", status: "locked" },
  { id: "eeg", title: "EEG", note: "Reading electrical activity from the brain.", status: "locked" },
  { id: "bci", title: "Brain-Computer Interfaces", note: "Turning brain signals into actions.", status: "locked" },
];
