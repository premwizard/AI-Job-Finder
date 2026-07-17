import { z } from 'zod';

export const professionalInfoSchema = z.object({
  current_job_title: z.string().optional().nullable(),
  current_company: z.string().optional().nullable(),
  employment_status: z.string().optional().nullable(),
  years_of_experience: z.string().optional().nullable(),
  total_months_of_experience: z.number().min(0).max(11).optional().nullable(),
  industry: z.string().optional().nullable(),
  career_level: z.string().optional().nullable(),
  current_annual_salary: z.string().optional().nullable(),
  current_salary_currency: z.string().optional().nullable(),
  salary_type: z.string().optional().nullable(),
  notice_period: z.string().optional().nullable(),
  expected_salary: z.string().optional().nullable(),
  expected_joining_bonus: z.string().optional().nullable(),
  negotiable_salary: z.boolean().optional().nullable(),
  preferred_currency: z.string().optional().nullable(),
  employment_types: z.string().optional().nullable(),
  work_setup: z.string().optional().nullable(),
  preferred_locations: z.string().optional().nullable(),
  preferred_time_zone: z.string().optional().nullable(),
  willing_to_relocate: z.boolean().optional().nullable(),
  relocation_countries: z.string().optional().nullable(),
  visa_status: z.string().optional().nullable(),
  travel_willingness: z.string().optional().nullable(),
});

export type ProfessionalInfoFormValues = z.infer<typeof professionalInfoSchema>;

export interface ProfessionalInfoResponse extends ProfessionalInfoFormValues {
  // Add any extra fields returned from the backend if necessary
}
