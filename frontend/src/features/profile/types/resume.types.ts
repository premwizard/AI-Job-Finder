export interface ResumeItem {
  id: number;
  file_url: string;
  file_name?: string | null;
  file_size?: number | null;     // bytes
  file_type?: string | null;     // "PDF", "DOCX", "PNG", etc.
  mime_type?: string | null;
  file_hash?: string | null;
  version: number;
  is_active: boolean;
  parsing_status: string;
  raw_text?: string | null;
  clean_text?: string | null;
  parsed_data_json?: string | null;
  processing_error?: string | null;
  processed_at?: string | null;
  cleaned_at?: string | null;
  parsed_at?: string | null;
  ocr_confidence?: number | null;
  ocr_processing_time_ms?: number | null;
  is_low_confidence?: boolean;
  ocr_provider?: string | null;
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
