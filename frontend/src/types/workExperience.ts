export enum EmploymentType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
  FREELANCE = 'Freelance',
  INTERNSHIP = 'Internship',
  OTHER = 'Other',
}

export enum WorkModel {
  REMOTE = 'Remote',
  HYBRID = 'Hybrid',
  ONSITE = 'Onsite',
}

export interface Skill {
  id: number;
  skill_name: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
}

export interface WorkExperience {
  id: number;
  user_id: number;
  company_name: string;
  company_logo?: string;
  role: string;
  department?: string;
  employment_type: EmploymentType;
  location?: string;
  work_model: WorkModel;
  start_date: string; // ISO format YYYY-MM-DD
  end_date?: string; // ISO format YYYY-MM-DD
  is_current: boolean;
  description?: string;
  achievements?: string;
  technologies_used?: string;
  manager_name?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  skills_used: Skill[];
  projects: Project[];
}

export interface WorkExperienceCreate {
  company_name: string;
  company_logo?: string;
  role: string;
  department?: string;
  employment_type: EmploymentType;
  location?: string;
  work_model: WorkModel;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  achievements?: string;
  technologies_used?: string;
  manager_name?: string;
  sort_order?: number;
  skill_ids?: number[];
  project_ids?: number[];
}

export type WorkExperienceUpdate = Partial<WorkExperienceCreate>;
