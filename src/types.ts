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

export type { Project, SocialLinks };