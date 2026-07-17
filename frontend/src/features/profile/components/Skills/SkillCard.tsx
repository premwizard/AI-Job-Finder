'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Star, CheckCircle2 } from 'lucide-react';
import { SkillResponse } from '../../types/skills';

interface SkillCardProps {
  skill: SkillResponse;
  onEdit: (skill: SkillResponse) => void;
  onDelete: (skillId: number) => void;
  onToggleFeatured: (skill: SkillResponse) => void;
}

export function SkillCard({ skill, onEdit, onDelete, onToggleFeatured }: SkillCardProps) {
  
  // Convert proficiency level to progress representation
  const renderProficiency = (level?: string | null) => {
    if (!level) return null;
    
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const index = levels.indexOf(level);
    if (index === -1) return <span className="text-sm font-medium text-muted-foreground">{level}</span>;
    
    return (
      <div className="flex items-center gap-1.5" title={level}>
        {levels.map((l, i) => (
          <div 
            key={l} 
            className={`h-2 w-6 rounded-full ${i <= index ? 'bg-primary' : 'bg-primary/20'}`} 
          />
        ))}
        <span className="text-xs font-medium text-muted-foreground ml-2 hidden sm:inline-block">{level}</span>
      </div>
    );
  };

  return (
    <Card className={`group rounded-xl transition-all hover:shadow-md border-border/40 ${skill.featured_skill ? 'border-amber-500/30 bg-amber-50/10' : ''}`}>
      <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
        
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg leading-none">{skill.skill_name}</h3>
              {skill.verified && (
                <span title="Verified Skill">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                </span>
              )}
            </div>
            {skill.category && (
              <Badge variant="secondary" className="font-normal text-xs bg-primary/5">
                {skill.category}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`w-8 h-8 ${skill.featured_skill ? 'text-amber-500 opacity-100' : 'text-muted-foreground hover:text-amber-500'}`}
              onClick={() => onToggleFeatured(skill)}
              title={skill.featured_skill ? 'Unpin from Top Skills' : 'Pin to Top Skills'}
            >
              <Star className="w-4 h-4" fill={skill.featured_skill ? 'currentColor' : 'none'} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 text-muted-foreground hover:text-primary"
              onClick={() => onEdit(skill)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(skill.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {renderProficiency(skill.level)}
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {skill.years_of_experience ? (
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-foreground">{skill.years_of_experience}</span> years experience
              </div>
            ) : null}
            
            {skill.last_used ? (
              <div className="flex items-center gap-1.5">
                Last used: <span className="font-medium text-foreground">{skill.last_used}</span>
              </div>
            ) : null}
            
            {skill.currently_using && (
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-2 h-5 bg-green-500/10 text-green-600 border-green-500/20">
                Current
              </Badge>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
