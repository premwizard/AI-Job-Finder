export interface RoadmapItem {
  skill: string;
  priority: "High" | "Medium" | "Low";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimated_time: string;
  career_impact: string;
}

export interface RadarDataPoint {
  category: string;
  current_level: number;
  required_level: number;
}

export interface SkillGapResult {
  gap_percentage: number;
  matching_skills: string[];
  missing_skills: string[];
  recommended_skills: string[];
  learning_roadmap: RoadmapItem[];
  radar_data: RadarDataPoint[];
}

export interface SkillGapAnalysisHistory {
  id: string;
  user_id: string;
  resume_id: number | null;
  target_role: string;
  target_industry: string;
  gap_percentage: number;
  analysis_data_json: string;
  created_at: string;
}
