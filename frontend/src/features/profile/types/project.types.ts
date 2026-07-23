export type ProjectStatus = "Completed" | "In Progress" | "Archived" | "Planned";

export interface ProjectItem {
  id: string;
  name: string;
  short_description?: string | null;
  description?: string | null;
  project_type?: string | null;
  role?: string | null;
  team_size?: string | null;
  duration?: string | null;
  duration_months?: number | null;
  tech_stack?: string | null;
  ai_technologies?: string | null;
  github_url?: string | null;
  live_demo_url?: string | null;
  video_demo_url?: string | null;
  images?: string | null; // JSON string array or comma separated list of image URLs
  highlights?: string | null;
  challenges?: string | null;
  achievements?: string | null;
  status?: string | null;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;

  // Legacy field support
  title?: string;
}

export interface ProjectFormData {
  name: string;
  short_description?: string;
  description?: string;
  project_type?: string;
  role?: string;
  team_size?: string;
  duration?: string;
  tech_stack?: string;
  ai_technologies?: string;
  github_url?: string;
  live_demo_url?: string;
  video_demo_url?: string;
  images?: string[];
  challenges?: string;
  achievements?: string;
  status?: string;
  is_featured?: boolean;
}

export type ProjectSortOption = "featured_first" | "newest" | "oldest" | "title";
