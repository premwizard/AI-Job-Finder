export type CertificationCategory =
  | "Cloud Computing"
  | "Cyber Security"
  | "Software Engineering"
  | "Data & AI"
  | "Project Management"
  | "DevOps & Infrastructure"
  | "Design & UX"
  | "Other";

export type CertificationStatus = "active" | "expiring_soon" | "expired" | "never_expires";

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  credential_id?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  does_not_expire?: boolean;
  verification_url?: string | null;
  certificate_image_url?: string | null;
  category?: string | null;
  verification_status?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CertificationFormData {
  name: string;
  issuer: string;
  credential_id?: string;
  issue_date?: string;
  expiry_date?: string;
  does_not_expire?: boolean;
  verification_url?: string;
  certificate_image_url?: string;
  category?: string;
}

export type CertificationSortOption = "issue_newest" | "issue_oldest" | "expiry" | "name" | "issuer";
