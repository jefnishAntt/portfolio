interface SocialLinks {
  name: string;
  url: string;
  icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
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

export type { SocialLinks, Experience, Education, SkillCategory };
