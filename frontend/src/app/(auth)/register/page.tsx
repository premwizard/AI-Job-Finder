"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, UploadCloud, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [skills, setSkills] = useState(["Python", "Machine Learning"]);
  const [newSkill, setNewSkill] = useState("");

  const handleNext = () => setStep((s) => Math.min(s + 1, 6));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = () => {
    // Navigate to dashboard
    router.push("/dashboard");
  };

  return (
    <Card className="w-full max-w-xl mx-auto border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl transition-all duration-300">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-2xl font-bold tracking-tight">Create Account</CardTitle>
          <span className="text-sm text-muted-foreground font-medium">Step {step} of 6</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-in-out" 
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
        <CardDescription className="pt-2">
          {step === 1 && "Personal Information"}
          {step === 2 && "Career Preferences"}
          {step === 3 && "Skills & Technologies"}
          {step === 4 && "Preferred Locations"}
          {step === 5 && "Resume Upload"}
          {step === 6 && "Profile Review"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 min-h-[300px]">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <Label>Preferred Job Role</Label>
              <Input placeholder="e.g. AI Engineer, Product Manager" />
            </div>
            <div className="space-y-2">
              <Label>Years of Experience</Label>
              <Input type="number" placeholder="e.g. 3" min="0" />
            </div>
            <div className="space-y-2">
              <Label>Preferred Work Mode</Label>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" className="flex-1 bg-primary/10 border-primary/20">Remote</Button>
                <Button variant="outline" className="flex-1">Hybrid</Button>
                <Button variant="outline" className="flex-1">On-site</Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <Label>Add your skills</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. React, Python" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} type="button">Add</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-4">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1">
                  {skill}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => removeSkill(skill)} />
                </Badge>
              ))}
              {skills.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <Label>Where do you want to work?</Label>
              <Input placeholder="e.g. New York, London, Remote" />
              <p className="text-xs text-muted-foreground mt-2">
                Press enter to add multiple locations.
              </p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center justify-center py-8">
            <div className="w-full max-w-sm border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Upload Resume</h3>
              <p className="text-sm text-muted-foreground mb-4">Drag & drop your PDF here</p>
              <Button variant="outline" size="sm">Browse Files</Button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium">AI Engineer</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-medium">3 Years</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Skills</span>
                <span className="font-medium">{skills.length} Added</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resume</span>
                <span className="font-medium text-primary flex items-center gap-1">
                  resume.pdf <CheckCircle2 className="w-3 h-3" />
                </span>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Your profile is ready for AI analysis. Let's find your dream job!
            </p>
          </div>
        )}

      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={handlePrev} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        ) : (
          <div /> // Placeholder for spacing
        )}
        
        {step < 6 ? (
          <Button onClick={handleNext} className="gap-2">
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="gap-2 bg-primary text-primary-foreground">
            Complete Profile
          </Button>
        )}
      </CardFooter>
      {step === 1 && (
        <div className="text-sm text-center w-full text-muted-foreground pb-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Login
          </Link>
        </div>
      )}
    </Card>
  );
}
