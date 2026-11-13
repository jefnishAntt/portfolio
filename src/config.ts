import { SocialLinks, Experience, Education, SkillCategory } from "./types";
import { Github, Linkedin, Mail } from "lucide-react";

const PROFILE = {
  name: "Jefnish Antt J",
  firstName: "Jefnish",
  lastName: "ANTT",
  tagline: "Developer learning how brains and machines think.",
  /** Put a photo in /public (e.g. /profile.jpg) and set the path here. Empty → initials placeholder. */
  photo: "",
  email: "jefnish007@gmail.com",
  location: "Tamil Nadu, India",
  openToWork: true,
};

const EXPERIENCE: Experience[] = [
  {
    id: "EXP-01",
    role: "Developer · Frontend & Backend",
    company: "Haddy Designs",
    duration: "May 2024 — Present",
    location: "Tamil Nadu, India",
    points: [
      "Owned system architecture, database schema, and UI end-to-end for a fully offline desktop POS & billing application built with Tauri, React, and Rust on a local SQLite database — sustaining 10,000+ local transactions daily at under 50ms processing latency in production.",
      "Designed and implemented the frontend for a modern Learning Management System (LMS), building 15+ modular component systems and dashboards supporting over 2,000 active users.",
      "Deployed and operated production applications on AWS Amplify, configured custom domains via Route 53, integrated an AWS RDS database for backend persistence, and monitored infrastructure cost and health using AWS Cost Explorer.",
      "Improved production reliability and Core Web Vitals by optimizing asset loading and rendering, raising Lighthouse performance scores from 65 to 95+ and cutting page load time by 40%.",
      "Engineered a high-performance, responsive static site with Next.js and React to structure, render, and manage 500+ course catalog items at scale.",
    ],
  },
];

const EDUCATION: Education[] = [
  {
    id: "EDU-01",
    degree: "B.E. in Computer Science & Engineering",
    institution: "Anna University Affiliated College",
    duration: "Expected 2027",
    location: "Tamil Nadu, India",
  },
  {
    id: "EDU-02",
    degree: "Diploma in Computer Science & Engineering",
    institution: "Government Polytechnic College",
    duration: "2020 — 2023",
    location: "Nagercoil, Tamil Nadu",
  },
];

const SKILLS: SkillCategory[] = [
  { name: "Languages & Frameworks", items: ["TypeScript", "React.js", "Next.js", "Python"] },
  { name: "Backend & Systems", items: ["RESTful API Design", "System Design Fundamentals", "Authentication & Security"] },
  { name: "Cloud & Infrastructure", items: ["AWS Amplify", "AWS RDS", "Route 53"] },
  { name: "AI/ML Foundations", items: ["RAG", "Vector Databases", "LLM-based Application Design"] },
  { name: "Web & Desktop", items: ["Tailwind CSS", "Tauri (Desktop Apps)", "UI/UX Design"] },
];

const SOCIAL_LINKS: SocialLinks[] = [
  { name: "GitHub", url: "https://github.com/jefnishAntt", icon: Github },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/jefnishantt/", icon: Linkedin },
  { name: "Email", url: `mailto:${PROFILE.email}`, icon: Mail },
];

export { PROFILE, EXPERIENCE, EDUCATION, SKILLS, SOCIAL_LINKS };
