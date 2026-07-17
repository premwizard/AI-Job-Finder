'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema, PersonalInfoFormValues } from '../../utils/validators';
import { useGetPersonalInfo, useUpdatePersonalInfo } from '../../hooks/usePersonalInfo';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PersonalInfoCard } from './PersonalInfoCard';
import { ContactCard } from './ContactCard';
import { LocationCard } from './LocationCard';
import { LanguagesCard } from './LanguagesCard';
import { toast } from 'sonner';
import { Save, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';

export function PersonalInfoForm() {
  const { data: initialData, isLoading, refetch } = useGetPersonalInfo();
  const { mutate: updatePersonalInfo, isPending: isUpdating } = useUpdatePersonalInfo();
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(personalInfoSchema) as any,
    defaultValues: {
      first_name: '',
      middle_name: '',
      last_name: '',
      preferred_name: '',
      date_of_birth: '',
      gender: '',
      phone_number: '',
      alternate_phone_number: '',
      country: '',
      state: '',
      city: '',
      postal_code: '',
      time_zone: '',
      languages: [],
      headline: '',
      bio: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      // Format the date if it exists
      let dob = initialData.date_of_birth || '';
      if (dob && dob.includes('T')) {
        dob = dob.split('T')[0];
      }

      form.reset({
        first_name: initialData.first_name || '',
        middle_name: initialData.middle_name || '',
        last_name: initialData.last_name || '',
        preferred_name: initialData.preferred_name || '',
        date_of_birth: dob,
        gender: initialData.gender || '',
        phone_number: initialData.phone_number || '',
        alternate_phone_number: initialData.alternate_phone_number || '',
        country: initialData.country || '',
        state: initialData.state || '',
        city: initialData.city || '',
        postal_code: initialData.postal_code || '',
        time_zone: initialData.time_zone || '',
        languages: initialData.languages || [],
        headline: initialData.headline || '',
        bio: initialData.bio || '',
      });
      setHasUnsavedChanges(false);
    }
  }, [initialData, form]);

  // Watch for unsaved changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      // Skip the initial reset event
      if (type !== undefined) {
        setHasUnsavedChanges(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Add beforeunload event listener
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const onSubmit = (values: PersonalInfoFormValues) => {
    // Convert empty strings to null for optional fields if needed, or backend handles it
    updatePersonalInfo(values, {
      onSuccess: () => {
        toast.success('Personal information updated successfully');
        setHasUnsavedChanges(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.detail || 'Failed to update personal information');
      },
    });
  };

  const handleReset = () => {
    if (initialData) {
      let dob = initialData.date_of_birth || '';
      if (dob && dob.includes('T')) {
        dob = dob.split('T')[0];
      }
      form.reset({
        first_name: initialData.first_name || '',
        middle_name: initialData.middle_name || '',
        last_name: initialData.last_name || '',
        preferred_name: initialData.preferred_name || '',
        date_of_birth: dob,
        gender: initialData.gender || '',
        phone_number: initialData.phone_number || '',
        alternate_phone_number: initialData.alternate_phone_number || '',
        country: initialData.country || '',
        state: initialData.state || '',
        city: initialData.city || '',
        postal_code: initialData.postal_code || '',
        time_zone: initialData.time_zone || '',
        languages: initialData.languages || [],
        headline: initialData.headline || '',
        bio: initialData.bio || '',
      });
      setHasUnsavedChanges(false);
      toast.info('Changes discarded');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[250px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6 pb-20">
        
        {hasUnsavedChanges && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <RefreshCcw className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">You have unsaved changes. Don't forget to save!</p>
          </div>
        )}

        <PersonalInfoCard form={form} initialData={initialData} />
        <ContactCard form={form} initialData={initialData} />
        <LocationCard form={form} />
        <LanguagesCard form={form} />

        <div className="sticky bottom-6 z-10 flex justify-end gap-3 p-4 bg-background/80 backdrop-blur-md border border-border shadow-lg rounded-xl animate-in slide-in-from-bottom-8">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
            disabled={!hasUnsavedChanges || isUpdating}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!hasUnsavedChanges || isUpdating}
            className="shadow-md shadow-primary/20"
          >
            {isUpdating ? (
              <span className="flex items-center">
                <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
