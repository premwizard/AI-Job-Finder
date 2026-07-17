'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmploymentCardProps {
  form: any;
}

export function EmploymentCard({ form }: EmploymentCardProps) {
  return (
    <Card className="rounded-xl shadow-sm border-border/40">
      <CardHeader>
        <CardTitle className="text-xl">Current Employment</CardTitle>
        <CardDescription>
          Your current job status and experience level.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="current_job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Senior Software Engineer" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="current_company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Company</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Acme Corp" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employment_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || null}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Employed">Employed</SelectItem>
                    <SelectItem value="Open to Work">Open to Work</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Intern">Intern</SelectItem>
                    <SelectItem value="Freelancer">Freelancer</SelectItem>
                    <SelectItem value="Self Employed">Self Employed</SelectItem>
                    <SelectItem value="Career Break">Career Break</SelectItem>
                    <SelectItem value="Looking for Opportunities">Looking for Opportunities</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40">
          <FormField
            control={form.control}
            name="years_of_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Years of Experience</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="e.g. 5" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="total_months_of_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Months</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="11" placeholder="e.g. 6" {...field} value={field.value || ''} 
                    onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : null)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
