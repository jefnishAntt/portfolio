import { Project, SocialLinks } from "./types";
import {
  Github,
  Linkedin,
} from "lucide-react";

const PROJECTS: Project[] = [
  {
    id: "LIB-01",
    title: "Aethelred",
    year: "2024",
    desc: "A data-governance platform utilizing recursive archival logic.",
    image: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80&w=800",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "LIB-02",
    title: "Omen Lab",
    year: "2025",
    desc: "Generative typography based on geometric distribution models.",
    image: "https://images.unsplash.com/photo-1544391496-1ca7c97457cd?auto=format&fit=crop&q=80&w=800",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "LIB-03",
    title: "Vanguard",
    year: "2026",
    desc: "A dashboard designed with Fibonacci-sequence spatial layouts.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    liveUrl: "#",
    githubUrl: "#",
  },
];

const SOCIAL_LINKS: SocialLinks[] = [
  {
    name: "GitHub",
    url: "https://github.com/jefnishAntt",
    icon: Github,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/jefnishantt/",
    icon: Linkedin,
  },
];

export { PROJECTS, SOCIAL_LINKS };