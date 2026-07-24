import { authApi } from "@/features/auth/services/auth.api";

export interface CompanyProfile {
  id: number;
  company_name: string;
  industry?: string;
  logo_url?: string;
  ai_summary?: string;
  tech_stack?: string[];
  benefits?: string[];
  culture?: {
    mission?: string;
    engineering_culture?: string;
  };
}

export const listCompanies = async (): Promise<CompanyProfile[]> => {
  const { data } = await authApi.get('/company');
  return data;
};

export const getCompany = async (id: number): Promise<CompanyProfile> => {
  const { data } = await authApi.get(`/company/${id}`);
  return data;
};

export const enrichCompany = async (company_name: string): Promise<any> => {
  const { data } = await authApi.post('/company/enrich', { company_name });
  return data;
};
