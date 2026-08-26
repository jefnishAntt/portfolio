interface Project {
  id: string;
  title: string;
  year: string;
  desc: string;
  image: string;
  liveUrl: string;
  githubUrl: string;
}

interface SocialLinks {
  name: string;
  url: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  location: string;
  points: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  location: string;
}

interface SkillCategory {
  name: string;
  items: string[];
}

export type { Project, SocialLinks, Experience, Education, SkillCategory };
