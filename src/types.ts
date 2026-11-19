interface SocialLinks {
  name: string;
  url: string;
  icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
}

export interface Experience {
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
}

interface SkillCategory {
  name: string;
  items: string[];
}

export type { SocialLinks, Education, SkillCategory };
