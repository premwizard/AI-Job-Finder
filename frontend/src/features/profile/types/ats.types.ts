export interface KeywordAnalysis {
  found: string[];
  missing: string[];
  suggested: string[];
}

export interface CategoryScore {
  score: number;
  feedback: string;
}

export interface ATSAnalysisResult {
  overall_score: number;
  category_scores: Record<string, CategoryScore>;
  keyword_analysis: KeywordAnalysis;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  priority_improvements: string[];
}

export interface ATSAnalysisHistory {
  id: string;
  user_id: string;
  resume_id: number;
  overall_score: number;
  category_scores_json: string;
  full_analysis_json: string;
  analyzed_at: string;
}
