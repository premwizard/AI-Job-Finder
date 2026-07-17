'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface RelocationCardProps {
  form: any;
}

export function RelocationCard({ form }: RelocationCardProps) {
  const willingToRelocate = form.watch("willing_to_relocate");

  return (
    <Card className="rounded-xl shadow-sm border-border/40">
      <CardHeader>
        <CardTitle className="text-xl">Relocation & Travel</CardTitle>
        <CardDescription>
          Information about your global mobility.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="willing_to_relocate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Willing to Relocate?</FormLabel>
                <CardDescription>
                  Are you open to moving for a new role?
                </CardDescription>
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

        {willingToRelocate && (
          <FormField
            control={form.control}
            name="relocation_countries"
            render={({ field }) => (
              <FormItem className="animate-in fade-in slide-in-from-top-2">
                <FormLabel>Preferred Relocation Countries</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. USA, Canada, Germany (Comma separated)" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40">
          <FormField
            control={form.control}
            name="visa_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visa Sponsorship</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || null}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visa needs" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Required">Required</SelectItem>
                    <SelectItem value="Not Required">Not Required</SelectItem>
                    <SelectItem value="Open to Sponsored Roles">Open to Sponsored Roles</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="travel_willingness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Travel Availability</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || null}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select travel %" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="No Travel">No Travel</SelectItem>
                    <SelectItem value="Up to 10%">Up to 10%</SelectItem>
                    <SelectItem value="Up to 25%">Up to 25%</SelectItem>
                    <SelectItem value="Up to 50%">Up to 50%</SelectItem>
                    <SelectItem value="Extensive Travel">Extensive Travel</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
