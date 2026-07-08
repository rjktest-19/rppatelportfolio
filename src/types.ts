export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: 'Mobile Apps' | 'Web Apps' | 'AI Tools' | 'Game Projects';
  tags: string[];
  image: string;
  techStack: string[];
  stats: { label: string; value: string }[];
  features: string[];
  links: {
    github?: string;
    live?: string;
  };
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'design' | 'tools';
  level: number;
  iconName: string; // Dynamic rendering from Lucide Icons
  color: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  description: string;
  category: 'Portrait' | 'Branding' | 'Illustration';
}

export interface IdentityPhoto {
  id: 'orange' | 'portrait' | 'red';
  url: string;
  title: string;
  description: string;
}

export interface StatCounter {
  id: string;
  label: string;
  targetValue: number;
  prefix?: string;
  suffix?: string;
}
