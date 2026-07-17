'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationPreferencesCardProps {
  form: any;
}

export function LocationPreferencesCard({ form }: LocationPreferencesCardProps) {
  const [newLocation, setNewLocation] = useState('');

  const handleAddLocation = (field: any) => {
    if (!newLocation.trim()) return;
    
    const current = field.value ? field.value.split(',').filter(Boolean) : [];
    const locationName = newLocation.trim();
    
    // Check if already exists
    const exists = current.some((l: string) => l.toLowerCase() === locationName.toLowerCase());
    
    if (!exists) {
      field.onChange([...current, locationName].join(','));
    }
    
    setNewLocation('');
  };

  const handleRemoveLocation = (field: any, locationToRemove: string) => {
    const current = field.value ? field.value.split(',').filter(Boolean) : [];
    field.onChange(current.filter((l: string) => l !== locationToRemove).join(','));
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLocation(field);
    }
  };

  return (
    <Card className="rounded-xl shadow-sm border-border/40">
      <CardHeader>
        <CardTitle className="text-xl">Location Preferences</CardTitle>
        <CardDescription>
          Where do you want to work? Add specific cities, countries, or regions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="preferred_locations"
          render={({ field }) => {
            const locations = field.value ? field.value.split(',').filter(Boolean) : [];
            return (
              <FormItem>
                <FormLabel>Preferred Job Locations</FormLabel>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <FormControl>
                    <Input 
                      placeholder="e.g. Bangalore, Singapore, Remote" 
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, field)}
                    />
                  </FormControl>
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => handleAddLocation(field)}
                    disabled={!newLocation.trim()}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                <FormMessage />
                
                {locations.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-3">
                    {locations.map((loc: string) => (
                      <Badge 
                        key={loc} 
                        variant="secondary"
                        className="px-3 py-1.5 text-sm flex items-center gap-2 bg-primary/5 hover:bg-primary/10 border-primary/20"
                      >
                        <span className="font-medium">{loc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLocation(field, loc)}
                          className="ml-1 text-muted-foreground hover:text-destructive transition-colors focus:outline-none"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic mt-2">No locations added yet.</p>
                )}
              </FormItem>
            );
          }}
        />

        <div className="pt-4 border-t border-border/40">
          <FormField
            control={form.control}
            name="preferred_time_zone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Working Time Zone (For Remote)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || null}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PST">Pacific Time (PT)</SelectItem>
                    <SelectItem value="EST">Eastern Time (ET)</SelectItem>
                    <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="CET">Central European Time (CET)</SelectItem>
                    <SelectItem value="IST">Indian Standard Time (IST)</SelectItem>
                    <SelectItem value="SGT">Singapore Time (SGT)</SelectItem>
                    <SelectItem value="AEST">Australian Eastern Time (AEST)</SelectItem>
                    <SelectItem value="Any">Any Timezone</SelectItem>
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
