'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NoticePeriodCardProps {
  form: any;
}

export function NoticePeriodCard({ form }: NoticePeriodCardProps) {
  return (
    <Card className="rounded-xl shadow-sm border-border/40">
      <CardHeader>
        <CardTitle className="text-xl">Notice Period</CardTitle>
        <CardDescription>
          When can you join a new company?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="notice_period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notice Period</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || null}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select notice period" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Immediate">Immediate</SelectItem>
                  <SelectItem value="15 Days">15 Days</SelectItem>
                  <SelectItem value="30 Days">30 Days</SelectItem>
                  <SelectItem value="45 Days">45 Days</SelectItem>
                  <SelectItem value="60 Days">60 Days</SelectItem>
                  <SelectItem value="90 Days">90 Days</SelectItem>
                  <SelectItem value="Negotiable">Negotiable</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
