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

import { skillSchema, SkillFormValues, SKILL_CATEGORIES, SKILL_LEVELS, SkillResponse } from '../../types/skills';
import { useAddSkill, useUpdateSkill } from '../../hooks/useSkills';
import { toast } from 'sonner';

interface SkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skillToEdit?: SkillResponse | null;
}

export function SkillDialog({ open, onOpenChange, skillToEdit }: SkillDialogProps) {
  const addSkill = useAddSkill();
  const updateSkill = useUpdateSkill();
  const isEditing = !!skillToEdit;

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skill_name: '',
      category: '',
      level: '',
      years_of_experience: 0,
      last_used: new Date().getFullYear(),
      currently_using: true,
      featured_skill: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (skillToEdit) {
        form.reset({
          skill_name: skillToEdit.skill_name || '',
          category: skillToEdit.category || '',
          level: skillToEdit.level || '',
          years_of_experience: skillToEdit.years_of_experience || 0,
          last_used: skillToEdit.last_used || new Date().getFullYear(),
          currently_using: skillToEdit.currently_using || false,
          featured_skill: skillToEdit.featured_skill || false,
        });
      } else {
        form.reset({
          skill_name: '',
          category: '',
          level: '',
          years_of_experience: 0,
          last_used: new Date().getFullYear(),
          currently_using: true,
          featured_skill: false,
        });
      }
    }
  }, [open, skillToEdit, form]);

  const onSubmit = async (values: SkillFormValues) => {
    try {
      if (isEditing && skillToEdit) {
        await updateSkill.mutateAsync({ id: skillToEdit.id, data: values });
        toast.success('Skill updated successfully');
      } else {
        await addSkill.mutateAsync(values);
        toast.success('Skill added successfully');
      }
      onOpenChange(false);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to save skill';
      toast.error(message);
    }
  };

  const isPending = addSkill.isPending || updateSkill.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details of your skill.' : 'Add a new skill to your profile.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="skill_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Python, React, AWS" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SKILL_CATEGORIES.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proficiency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SKILL_LEVELS.map(l => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="years_of_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="e.g. 3" 
                        {...field} 
                        value={field.value || ''} 
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_used"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Used (Year)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1980"
                        max={new Date().getFullYear()}
                        placeholder="e.g. 2024" 
                        {...field} 
                        value={field.value || ''} 
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                        disabled={form.watch('currently_using')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-6 pt-2">
              <FormField
                control={form.control}
                name="currently_using"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(val) => {
                          field.onChange(val);
                          if (val) form.setValue('last_used', new Date().getFullYear());
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Currently using this skill
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured_skill"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer text-amber-600 dark:text-amber-500">
                      Pin to Top Skills
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Add Skill'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
