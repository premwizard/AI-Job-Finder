import { z } from "zod";
import { Skill } from "./skills";

export const experienceSchema = z.object({
  company_name: z.string().min(1, "Company name is required").max(100),
  company_logo_url: z.string().url().optional().or(z.literal("")),
  role: z.string().min(1, "Role is required").max(100),
  employment_type: z.string().optional(),
  department: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  work_model: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().max(2000).optional(),
  achievements: z.string().max(2000).optional(),
  manager_name: z.string().max(100).optional(),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;


export interface Project {
  id: string;
  name: string;
  description?: string;
  project_type?: string;
  role?: string;
  team_size?: number;
  duration_months?: number;
  tech_stack?: string;
  ai_technologies?: string;
  github_url?: string;
  live_demo_url?: string;
  video_demo_url?: string;
  highlights?: string;
  challenges?: string;
  achievements?: string;
  created_at: string;
  updated_at?: string;
}

export interface WorkExperience {
  id: string;
  company_name: string;
  company_logo_url?: string;
  role: string;
  employment_type?: string;
  department?: string;
  location?: string;
  work_model?: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  achievements?: string;
  technologies?: string;
  manager_name?: string;
  order: number;
  created_at: string;
  updated_at?: string;
  skills?: Skill[];
  projects?: Project[];
}

export interface WorkExperienceCreate {
  company_name: string;
  company_logo_url?: string;
  role: string;
  employment_type?: string;
  department?: string;
  location?: string;
  work_model?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  achievements?: string;
  technologies?: string;
  manager_name?: string;
  order?: number;
  skill_ids?: number[];
  project_ids?: string[];
}

export interface WorkExperienceUpdate extends Partial<WorkExperienceCreate> {}
