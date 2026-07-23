export interface EducationItem {
  id: string;
  institution_name: string;
  institution_logo_url?: string | null;
  degree: string;
  major?: string | null;
  specialization?: string | null;
  cgpa?: string | null;
  grade?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean;
  activities?: string | null;
  honors_awards?: string | null;
  relevant_coursework?: string | null;
  certificate_url?: string | null;
  verification_status?: string | null;
  order?: number;
  created_at?: string;
  updated_at?: string;

  // Legacy field support
  institution?: string;
}

export interface EducationFormData {
  institution_name: string;
  institution_logo_url?: string;
  degree: string;
  major?: string;
  specialization?: string;
  cgpa?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  activities?: string;
  honors_awards?: string;
  relevant_coursework?: string;
  certificate_url?: string;
}

export type EducationSortOption = "newest" | "oldest" | "institution" | "degree";
