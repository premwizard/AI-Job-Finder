import { z } from 'zod';

export const SKILL_CATEGORIES = [
  'Programming Languages',
  'Frameworks',
  'Libraries',
  'Databases',
  'Cloud',
  'DevOps',
  'AI / Machine Learning',
  'LLMs',
  'Tools',
  'Soft Skills',
  'Other',
];

export const SKILL_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
];

export const skillSchema = z.object({
  skill_name: z.string().min(1, 'Skill name is required'),
  category: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  years_of_experience: z.number().min(0).optional().nullable(),
  last_used: z.number().min(1980).max(new Date().getFullYear()).optional().nullable(),
  currently_using: z.boolean().optional(),
  featured_skill: z.boolean().optional(),
  verified: z.boolean().optional(),
});

export type SkillFormValues = z.infer<typeof skillSchema>;

export interface SkillResponse extends SkillFormValues {
  id: number;
}
