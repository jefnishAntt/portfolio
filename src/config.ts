import { SocialLinks, Experience, Education, SkillCategory } from "./types";
import { Github, Linkedin, Mail } from "lucide-react";

const PROFILE = {
  name: "Jefnish Antt J",
  firstName: "Jefnish",
  lastName: "ANTT",
  tagline: "Developer learning how brains and machines think.",
  /**
   * Profile photo. Put the image in /public (e.g. public/profile.jpg) and set "/profile.jpg" here.
   * Square photos look best; it's cropped to a circle. Leave empty to show your initials.
   */
  photo: "/me.jpg",
  email: "jefnish007@gmail.com",
};

const EXPERIENCE: Experience[] = [
  {
    id: "EXP-01",
    role: "Developer · Frontend & Backend",
    company: "Haddy Designs",
    duration: "May 2024 — Present",
    location: "Tamil Nadu, India",
    points: [
      "Owned the architecture, database and UI of an offline desktop POS & billing app (Tauri, React, Rust, SQLite): 10,000+ transactions a day at under 50ms each in production.",
      "Designed and built the frontend of a Learning Management System with 15+ reusable component systems and dashboards, serving 2,000+ active users.",
      "Improved Core Web Vitals by optimising asset loading and rendering: Lighthouse performance rose from 65 to 95+ and page load time dropped by 40%.",
    ],
  },
];

const EDUCATION: Education[] = [
  {
    id: "EDU-01",
    degree: "B.E. in Computer Science & Engineering",
    institution: "Anna University Affiliated College",
    duration: "Expected 2027",
  },
  {
    id: "EDU-02",
    degree: "Diploma in Computer Science & Engineering",
    institution: "Government Polytechnic College",
    duration: "2020 — 2023",
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
