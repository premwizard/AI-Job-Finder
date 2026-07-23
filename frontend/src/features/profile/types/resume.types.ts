export interface ResumeItem {
  id: number;
  file_url: string;
  file_name?: string | null;
  file_size?: number | null;     // bytes
  file_type?: string | null;     // "PDF", "DOCX", etc.
  version: number;
  is_active: boolean;
  parsing_status: string;
  resume_score?: number | null;  // Reserved - AI
  ats_score?: number | null;     // Reserved - AI
  ai_summary?: string | null;    // Reserved - AI
  uploaded_at: string;
  updated_at: string;
}

/** Formats bytes into human-readable string e.g. "1.4 MB" */
export function formatFileSize(bytes?: number | null): string {
  if (bytes == null || bytes === 0) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
