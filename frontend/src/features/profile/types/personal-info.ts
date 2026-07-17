import { z } from "zod";

export interface Language {
  name: string;
  proficiency: string;
}

export interface PersonalInfoResponse {
  first_name?: string | null;
  last_name?: string | null;
  middle_name?: string | null;
  preferred_name?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  alternate_phone_number?: string | null;
  profile_picture_url?: string | null;
  cover_banner_url?: string | null;
  headline?: string | null;
  bio?: string | null;
  phone_number?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  postal_code?: string | null;
  time_zone?: string | null;
  email?: string | null;
  is_verified?: boolean | null;
  languages?: Language[];
}

export const languageSchema = z.object({
  name: z.string().min(1, "Language is required"),
  proficiency: z.string().min(1, "Proficiency is required"),
});

export const personalInfoFormSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  middle_name: z.string().optional().nullable(),
  preferred_name: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone_number: z.string().optional().nullable(),
  alternate_phone_number: z.string().optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  country: z.string().min(1, "Country is required"),
  state: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  time_zone: z.string().optional().nullable(),
  languages: z.array(languageSchema).default([]),
  profile_picture_url: z.string().optional().nullable(),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoFormSchema>;
