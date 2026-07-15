import * as z from 'zod';

export const languageSchema = z.object({
  name: z.string().min(1, 'Language is required'),
  proficiency: z.string().min(1, 'Proficiency is required'),
});

export const personalInfoSchema = z.object({
  first_name: z.string().min(1, 'First Name is required').max(100),
  middle_name: z.string().optional().nullable(),
  last_name: z.string().min(1, 'Last Name is required').max(100),
  preferred_name: z.string().optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  phone_number: z.string().optional().nullable(),
  alternate_phone_number: z.string().optional().nullable(),
  country: z.string().min(1, 'Country is required'),
  state: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  time_zone: z.string().optional().nullable(),
  languages: z.array(languageSchema).optional().default([]),
  headline: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
export type Language = z.infer<typeof languageSchema>;
