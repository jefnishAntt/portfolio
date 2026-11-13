export interface LabProject {
  title: string;
  description: string; // one line
  tags: string[];
  github?: string;
  demo?: string;
}

/** Brain / AI experiments. Leave empty to show the "coming soon" state. */
export const LAB_EXPERIMENTS: LabProject[] = [];

/** Earlier work, shown under the experiments. */
export const EARLIER_BUILDS: LabProject[] = [
  {
    title: "AI Document Assistant",
    description:
      "A RAG pipeline for natural-language Q&A over large document sets, combining vector retrieval with LLM-based answers.",
    tags: ["rag", "llm", "vector-search"],
    github: "https://github.com/jefnishAntt",
  },
  {
    title: "E-Commerce Platform",
    description:
      "Full-stack store with server-rendered catalogs, a type-safe REST API, and a relational schema that keeps stock consistent under concurrent checkouts.",
    tags: ["full-stack", "rest-api", "sql"],
    github: "https://github.com/jefnishAntt",
  },
];
