'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { toast } from 'sonner';

import { experienceSchema, ExperienceFormValues, WorkExperience } from '../../types/experience';
import { useExperience } from '../../hooks/useExperience';

interface ExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experienceToEdit?: WorkExperience | null;
}

export function ExperienceDialog({ open, onOpenChange, experienceToEdit }: ExperienceDialogProps) {
  const { addExperienceAsync, updateExperienceAsync, isAdding, isUpdating } = useExperience();
  const isEditing = !!experienceToEdit;

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company_name: '',
      role: '',
      location: '',
      department: '',
      employment_type: '',
      work_model: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      achievements: '',
      manager_name: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (experienceToEdit) {
        form.reset({
          company_name: experienceToEdit.company_name || '',
          role: experienceToEdit.role || '',
          location: experienceToEdit.location || '',
          department: experienceToEdit.department || '',
          employment_type: experienceToEdit.employment_type || '',
          work_model: experienceToEdit.work_model || '',
          start_date: experienceToEdit.start_date?.split('T')[0] || '',
          end_date: experienceToEdit.end_date?.split('T')[0] || '',
          is_current: experienceToEdit.is_current || false,
          description: experienceToEdit.description || '',
          achievements: experienceToEdit.achievements || '',
          manager_name: experienceToEdit.manager_name || '',
        });
      } else {
        form.reset({
          company_name: '',
          role: '',
          location: '',
          department: '',
          employment_type: '',
          work_model: '',
          start_date: '',
          end_date: '',
          is_current: false,
          description: '',
          achievements: '',
          manager_name: '',
        });
      }
    }
  }, [open, experienceToEdit, form]);

  const onSubmit = async (values: ExperienceFormValues) => {
    try {
      const formattedValues = {
        ...values,
        start_date: values.start_date ? new Date(values.start_date).toISOString() : undefined,
        end_date: !values.is_current && values.end_date ? new Date(values.end_date).toISOString() : undefined,
      };

      if (isEditing && experienceToEdit) {
        await updateExperienceAsync({ id: experienceToEdit.id, data: formattedValues });
        toast.success('Experience updated successfully');
      } else {
        await addExperienceAsync(formattedValues);
        toast.success('Experience added successfully');
      }
      onOpenChange(false);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to save experience';
      toast.error(message);
    }
  };

  const isPending = isAdding || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Experience' : 'Add Work Experience'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update your work experience details.' : 'Add a new work experience to your professional profile.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title / Role *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Senior Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Google" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Self-employed">Self-employed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="work_model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Model</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="On-site">On-site</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. San Francisco, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Engineering" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="month" 
                        {...field} 
                        disabled={form.watch('is_current')} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_current"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">I currently work here</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEditor 
                      value={field.value || ''} 
                      onChange={field.onChange} 
                      placeholder="Describe your responsibilities and daily tasks..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="achievements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Achievements</FormLabel>
                  <FormControl>
                    <RichTextEditor 
                      value={field.value || ''} 
                      onChange={field.onChange} 
                      placeholder="Highlight your major accomplishments, metrics, and impact..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Add Experience'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
