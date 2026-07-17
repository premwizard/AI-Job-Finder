'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface EmploymentPreferencesCardProps {
  form: any;
}

const EMPLOYMENT_TYPES = [
  'Full Time',
  'Internship',
  'Contract',
  'Freelance',
  'Part Time',
  'Apprenticeship',
];

const WORK_MODES = [
  'Remote',
  'Hybrid',
  'Onsite',
];

export function EmploymentPreferencesCard({ form }: EmploymentPreferencesCardProps) {
  
  const handleToggle = (field: any, value: string) => {
    const current = field.value ? field.value.split(',').filter(Boolean) : [];
    if (current.includes(value)) {
      field.onChange(current.filter((item: string) => item !== value).join(','));
    } else {
      field.onChange([...current, value].join(','));
    }
  };

  return (
    <Card className="rounded-xl shadow-sm border-border/40">
      <CardHeader>
        <CardTitle className="text-xl">Employment Preferences</CardTitle>
        <CardDescription>
          What kind of roles and work environments are you looking for?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="employment_types"
          render={({ field }) => {
            const selected = field.value ? field.value.split(',').filter(Boolean) : [];
            return (
              <FormItem>
                <FormLabel>Preferred Employment Type</FormLabel>
                <div className="flex flex-wrap gap-2 pt-2">
                  {EMPLOYMENT_TYPES.map(type => {
                    const isSelected = selected.includes(type);
                    return (
                      <Badge
                        key={type}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer hover:bg-primary/90 px-3 py-1.5 transition-all ${isSelected ? '' : 'text-muted-foreground'}`}
                        onClick={() => handleToggle(field, type)}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 mr-1" />}
                        {type}
                      </Badge>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="work_setup"
          render={({ field }) => {
            const selected = field.value ? field.value.split(',').filter(Boolean) : [];
            return (
              <FormItem>
                <FormLabel>Preferred Work Mode</FormLabel>
                <div className="flex flex-wrap gap-2 pt-2">
                  {WORK_MODES.map(mode => {
                    const isSelected = selected.includes(mode);
                    return (
                      <Badge
                        key={mode}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer hover:bg-primary/90 px-3 py-1.5 transition-all ${isSelected ? '' : 'text-muted-foreground'}`}
                        onClick={() => handleToggle(field, mode)}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 mr-1" />}
                        {mode}
                      </Badge>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </CardContent>
    </Card>
  );
}
