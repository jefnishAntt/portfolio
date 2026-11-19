/**
 * Case studies shown in the "Work" section. Built only from the facts in your
 * Haddy Designs experience. Review the wording, especially `challenge`, and
 * adjust it to match how you'd describe each project in an interview.
 */
export interface CaseStudy {
  id: string;
  title: string;
  /** Where / what, shown in small mono text. */
  context: string;
  challenge: string;
  approach: string;
  outcome: string;
  /** Up to 3 headline numbers. */
  metrics: { value: string; label: string }[];
  stack: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "pos",
    title: "Offline POS & billing app",
    context: "Haddy Designs · desktop app",
    challenge: "Shops needed point-of-sale billing that keeps working with no internet connection.",
    approach:
      "Owned it end to end: system architecture, database schema and UI. Built as a Tauri desktop app with a React interface and a Rust core on a local SQLite database.",
    outcome: "Running in production, handling 10,000+ local transactions a day.",
    metrics: [
      { value: "10k+", label: "transactions / day" },
      { value: "<50 ms", label: "per transaction" },
    ],
    stack: ["Tauri", "Rust", "React", "SQLite"],
  },
  {
    id: "lms",
    title: "Learning management system",
    context: "Haddy Designs · web platform",
    challenge: "A modern learning platform that stays consistent and maintainable as it grows.",
    approach:
      "Designed and built the frontend as 15+ modular component systems and dashboards, deployed on AWS Amplify with Route 53 domains and an RDS database.",
    outcome: "Supports over 2,000 active users.",
    metrics: [
      { value: "2,000+", label: "active users" },
      { value: "15+", label: "component systems" },
    ],
    stack: ["React", "Next.js", "AWS Amplify", "RDS"],
  },
  {
    id: "performance",
    title: "Production performance",
    context: "Haddy Designs · production web apps",
    challenge: "Slow asset loading and rendering were dragging down Core Web Vitals and page speed.",
    approach:
      "Optimised how assets load and pages render, and kept watch on health and cost in production. Separately, engineered a responsive static Next.js site managing 500+ course catalogue items.",
    outcome: "Lighthouse performance went from 65 to 95+, and page load time dropped by 40%.",
    metrics: [
      { value: "65 → 95+", label: "Lighthouse score" },
      { value: "−40%", label: "page load time" },
    ],
    stack: ["Next.js", "React", "Core Web Vitals"],
  },
];
