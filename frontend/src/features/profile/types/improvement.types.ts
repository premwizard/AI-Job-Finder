export interface ResumeImprovementSuggestion {
  id: string;
  user_id: string;
  resume_id: number;
  section: string;
  original_text: string;
  suggested_text: string;
  improvement_type: string;
  reason: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EDITED";
  created_at: string;
  resolved_at: string | null;
}

export interface ResolveImprovementRequest {
  action: "ACCEPT" | "REJECT" | "EDIT";
  edited_text?: string;
}
