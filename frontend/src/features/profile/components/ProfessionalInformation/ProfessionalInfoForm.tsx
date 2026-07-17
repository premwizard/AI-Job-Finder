'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { professionalInfoSchema, ProfessionalInfoFormValues } from '../../types/professional-info';
import { useUpdateProfessionalInfo } from '../../hooks/useProfessionalInfo';

import { EmploymentCard } from './EmploymentCard';
import { CareerLevelCard } from './CareerLevelCard';
import { CompensationCard } from './CompensationCard';
import { NoticePeriodCard } from './NoticePeriodCard';
import { EmploymentPreferencesCard } from './EmploymentPreferencesCard';
import { LocationPreferencesCard } from './LocationPreferencesCard';
import { RelocationCard } from './RelocationCard';

interface ProfessionalInfoFormProps {
  initialData: any;
}

export function ProfessionalInfoForm({ initialData }: ProfessionalInfoFormProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(professionalInfoSchema) as any,
    defaultValues: {
      current_job_title: '',
      current_company: '',
      employment_status: '',
      years_of_experience: '',
      total_months_of_experience: 0,
      industry: '',
      career_level: '',
      current_annual_salary: '',
      current_salary_currency: '',
      salary_type: '',
      notice_period: '',
      expected_salary: '',
      expected_joining_bonus: '',
      negotiable_salary: false,
      preferred_currency: '',
      employment_types: '',
      work_setup: '',
      preferred_locations: '',
      preferred_time_zone: '',
      willing_to_relocate: false,
      relocation_countries: '',
      visa_status: '',
      travel_willingness: '',
    },
  });

  // Reset form when initial data is loaded
  useEffect(() => {
    if (initialData) {
      form.reset({
        current_job_title: initialData.current_job_title || '',
        current_company: initialData.current_company || '',
        employment_status: initialData.employment_status || '',
        years_of_experience: initialData.years_of_experience || '',
        total_months_of_experience: initialData.total_months_of_experience || 0,
        industry: initialData.industry || '',
        career_level: initialData.career_level || '',
        current_annual_salary: initialData.current_annual_salary || '',
        current_salary_currency: initialData.current_salary_currency || '',
        salary_type: initialData.salary_type || '',
        notice_period: initialData.notice_period || '',
        expected_salary: initialData.expected_salary || '',
        expected_joining_bonus: initialData.expected_joining_bonus || '',
        negotiable_salary: initialData.negotiable_salary || false,
        preferred_currency: initialData.preferred_currency || '',
        employment_types: initialData.employment_types || '',
        work_setup: initialData.work_setup || '',
        preferred_locations: initialData.preferred_locations || '',
        preferred_time_zone: initialData.preferred_time_zone || '',
        willing_to_relocate: initialData.willing_to_relocate || false,
        relocation_countries: initialData.relocation_countries || '',
        visa_status: initialData.visa_status || '',
        travel_willingness: initialData.travel_willingness || '',
      });
    }
  }, [initialData, form]);

  // Track unsaved changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change') {
        setHasUnsavedChanges(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Warn before leaving if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        e.returnValue = message;
        return message;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const updateProfessionalInfo = useUpdateProfessionalInfo();

  const onSubmit = async (values: ProfessionalInfoFormValues) => {
    try {
      await updateProfessionalInfo.mutateAsync(values);
      toast.success('Professional information updated successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Failed to update professional information');
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6 pb-20">
        
        {hasUnsavedChanges && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">You have unsaved changes. Don't forget to save!</p>
          </div>
        )}

        <EmploymentCard form={form} />
        <CareerLevelCard form={form} />
        <CompensationCard form={form} />
        <NoticePeriodCard form={form} />
        <EmploymentPreferencesCard form={form} />
        <LocationPreferencesCard form={form} />
        <RelocationCard form={form} />

        <div className="flex justify-end pt-6 border-t border-border/40 sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 -mx-4 z-10">
          <Button 
            type="submit" 
            disabled={updateProfessionalInfo.isPending || !hasUnsavedChanges}
            className="w-full sm:w-auto shadow-md"
            size="lg"
          >
            {updateProfessionalInfo.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
