'use client';

import React, { useState, useMemo } from 'react';
import { useGetSkills, useUpdateSkill, useDeleteSkill } from '@/features/profile/hooks/useSkills';
import { SkillCard } from '@/features/profile/components/Skills/SkillCard';
import { SkillDialog } from '@/features/profile/components/Skills/SkillDialog';
import { SkillResponse, SKILL_CATEGORIES } from '@/features/profile/types/skills';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Layers, Star, Code2, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function SkillsPage() {
  const { data: skills, isLoading } = useGetSkills();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<SkillResponse | null>(null);

  // Derived state
  const filteredSkills = useMemo(() => {
    if (!skills) return [];
    
    let filtered = skills;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s => s.skill_name.toLowerCase().includes(q));
    }
    
    return filtered;
  }, [skills, selectedCategory, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    if (!skills || skills.length === 0) return null;
    
    const categories = skills.map(s => s.category).filter(Boolean);
    const topCategory = categories.sort((a,b) =>
          categories.filter(v => v===a).length
        - categories.filter(v => v===b).length
    ).pop() || 'None';

    const featuredCount = skills.filter(s => s.featured_skill).length;
    
    return {
      total: skills.length,
      topCategory,
      featuredCount,
    };
  }, [skills]);

  // Handlers
  const handleEdit = (skill: SkillResponse) => {
    setSkillToEdit(skill);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSkillToEdit(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (skillId: number) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      await deleteSkill.mutateAsync(skillId);
    }
  };

  const handleToggleFeatured = async (skill: SkillResponse) => {
    await updateSkill.mutateAsync({
      id: skill.id,
      data: { featured_skill: !skill.featured_skill }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Code2 className="w-8 h-8 text-primary" />
            Skills Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your technical toolkit, soft skills, and expertise.
          </p>
        </div>
        <Button onClick={handleAddNew} size="lg" className="shadow-md">
          <Plus className="w-5 h-5 mr-2" />
          Add Skill
        </Button>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Skills</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Skills (Pinned)</p>
                <p className="text-2xl font-bold">{stats.featuredCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Category</p>
                <p className="text-xl font-bold truncate max-w-[150px]">{stats.topCategory}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search skills..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <Select value={selectedCategory} onValueChange={(val: string | null) => setSelectedCategory(val || 'All')}>
          <SelectTrigger className="w-full sm:w-[200px] bg-background">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {SKILL_CATEGORIES.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <Skeleton key={i} className="h-[140px] rounded-xl" />
          ))}
        </div>
      ) : filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4">
          {filteredSkills.map(skill => (
            <SkillCard 
              key={skill.id} 
              skill={skill} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-background/50 border border-dashed rounded-xl">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No skills found</h2>
          <p className="text-muted-foreground mb-6">
            {searchQuery || selectedCategory !== 'All' 
              ? "We couldn't find any skills matching your search criteria."
              : "You haven't added any skills yet. Start building your profile!"}
          </p>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Skill
          </Button>
        </div>
      )}

      {/* Dialog */}
      <SkillDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        skillToEdit={skillToEdit}
      />
    </div>
  );
}
