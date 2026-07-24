export interface CategoryScore {
  score: number;
  feedback: string;
}

export interface QualityAnalysisResult {
  overall_score: number;
  category_scores: Record<string, CategoryScore>;
  strengths: string[];
  weaknesses: string[];
  critical_issues: string[];
  minor_issues: string[];
  excellent_sections: string[];
  general_feedback: string;
}

export interface QualityAnalysisHistory {
  id: string;
  user_id: string;
  resume_id: number;
  overall_score: number;
  category_scores_json: string;
  full_analysis_json: string;
  analyzed_at: string;
}
