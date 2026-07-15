'use client';

import React, { useState } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { PersonalInfoFormValues } from '../../utils/validators';

interface LanguagesCardProps {
  form: UseFormReturn<PersonalInfoFormValues>;
}

export function LanguagesCard({ form }: LanguagesCardProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "languages",
  });

  const [newLanguage, setNewLanguage] = useState('');
  const [newProficiency, setNewProficiency] = useState('Native');

  const handleAddLanguage = () => {
    if (!newLanguage.trim()) return;
    
    // Check if already exists
    const exists = form.getValues('languages')?.some(
      l => l.name.toLowerCase() === newLanguage.trim().toLowerCase()
    );
    
    if (!exists) {
      append({
        name: newLanguage.trim(),
        proficiency: newProficiency,
      });
    }
    
    setNewLanguage('');
    setNewProficiency('Native');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLanguage();
    }
  };

  return (
    <Card className="rounded-xl shadow-sm border-border/40">
      <CardHeader>
        <CardTitle className="text-xl">Languages</CardTitle>
        <CardDescription>
          What languages do you speak? Add them and specify your proficiency level.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Language
            </label>
            <Input 
              placeholder="e.g. English, French" 
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="w-full sm:w-[200px] space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Proficiency
            </label>
            <Select value={newProficiency} onValueChange={setNewProficiency}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Native">Native</SelectItem>
                <SelectItem value="Fluent">Fluent</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="button" 
            onClick={handleAddLanguage}
            disabled={!newLanguage.trim()}
            className="w-full sm:w-auto mt-2 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {fields.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {fields.map((field, index) => (
              <Badge 
                key={field.id} 
                variant="secondary"
                className="px-3 py-1.5 text-sm flex items-center gap-2 bg-primary/5 hover:bg-primary/10 border-primary/20"
              >
                <span className="font-medium">{field.name}</span>
                <span className="text-muted-foreground text-xs border-l border-primary/20 pl-2">
                  {field.proficiency}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="ml-1 text-muted-foreground hover:text-destructive transition-colors focus:outline-none"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground italic">No languages added yet. At least one language is recommended.</p>
        )}
      </CardContent>
    </Card>
  );
}
