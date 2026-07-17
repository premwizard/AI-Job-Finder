'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { PersonalInfoFormValues } from '../../utils/validators';
import { PersonalInfoResponse } from '../../services/personal-info.service';

interface ContactCardProps {
  form: any;
  initialData?: PersonalInfoResponse;
}

export function ContactCard({ form, initialData }: ContactCardProps) {
  return (
    <Card className="rounded-xl shadow-sm border-border/40">
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Contact Information</span>
          {initialData?.is_verified ? (
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Verified
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              Not Verified
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          How employers and the platform can reach you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <FormLabel>Email Address</FormLabel>
            <Input 
              value={initialData?.email || ''} 
              disabled 
              className="bg-muted text-muted-foreground opacity-70"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your email is used for login and cannot be changed here.
            </p>
          </div>
          
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 000-0000" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="alternate_phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alternate Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 000-0000" {...field} value={field.value || ''} />
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
