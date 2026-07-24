export interface ResumeVersion {
  id: string;
  resume_id: number;
  version_number: number;
  change_summary: string;
  parsed_data_json: string | null;
  clean_text: string | null;
  ats_score: number | null;
  quality_score: number | null;
  created_at: string;
}
