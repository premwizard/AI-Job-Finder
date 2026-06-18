"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, UploadCloud, X, CheckCircle2, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  preferredRole: z.string().min(2, "Role is required"),
  experience: z.number().min(0, "Experience must be a positive number"),
  education: z.string().min(2, "Education is required"),
  workPreference: z.enum(["remote", "hybrid", "on-site"]),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
  preferredLocations: z.array(z.string()).min(1, "Add at least one location"),
  resumeUploaded: z.boolean().refine(val => val === true, { message: "Please upload a resume" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const steps = [
  { id: 1, name: "Personal Information", fields: ["name", "email", "password", "confirmPassword"] },
  { id: 2, name: "Career Preferences", fields: ["preferredRole", "experience", "education", "workPreference"] },
  { id: 3, name: "Skills & Technologies", fields: ["skills"] },
  { id: 4, name: "Preferred Locations", fields: ["preferredLocations"] },
  { id: 5, name: "Resume Upload", fields: ["resumeUploaded"] },
  { id: 6, name: "Profile Review", fields: [] },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newSkill, setNewSkill] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      preferredRole: "",
      experience: 0,
      education: "",
      workPreference: "remote",
      skills: ["Python", "Machine Learning"],
      preferredLocations: ["Remote"],
      resumeUploaded: false,
    },
    mode: "onChange",
  });

  const watchAllFields = watch();

  const handleNext = async () => {
    const currentStepFields = steps.find(s => s.id === step)?.fields as any[];
    if (currentStepFields && currentStepFields.length > 0) {
      const isStepValid = await trigger(currentStepFields);
      if (!isStepValid) return;
    }
    setStep((s) => Math.min(s + 1, 6));
  };

  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const addSkill = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (newSkill.trim() && !watchAllFields.skills.includes(newSkill.trim())) {
      setValue("skills", [...watchAllFields.skills, newSkill.trim()], { shouldValidate: true });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setValue("skills", watchAllFields.skills.filter((s) => s !== skillToRemove), { shouldValidate: true });
  };

  const addLocation = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (newLocation.trim() && !watchAllFields.preferredLocations.includes(newLocation.trim())) {
      setValue("preferredLocations", [...watchAllFields.preferredLocations, newLocation.trim()], { shouldValidate: true });
      setNewLocation("");
    }
  };

  const removeLocation = (locToRemove: string) => {
    setValue("preferredLocations", watchAllFields.preferredLocations.filter((l) => l !== locToRemove), { shouldValidate: true });
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Submitted Profile:", data);
      router.push("/dashboard");
    }, 1500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setValue("resumeUploaded", true, { shouldValidate: true });
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       setValue("resumeUploaded", true, { shouldValidate: true });
    }
  }

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
          {steps.find(s => s.id === step)?.name}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 min-h-[300px]">
        <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
          
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" {...register("name")} className={errors.name ? "border-red-500" : ""} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" {...register("email")} className={errors.email ? "border-red-500" : ""} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} className={errors.password ? "border-red-500" : ""} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} className={errors.confirmPassword ? "border-red-500" : ""} />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                <Label htmlFor="preferredRole">Preferred Job Role</Label>
                <Input id="preferredRole" placeholder="e.g. AI Engineer, Product Manager" {...register("preferredRole")} className={errors.preferredRole ? "border-red-500" : ""} />
                {errors.preferredRole && <p className="text-sm text-red-500">{errors.preferredRole.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" type="number" placeholder="e.g. 3" min="0" {...register("experience", { valueAsNumber: true })} className={errors.experience ? "border-red-500" : ""} />
                {errors.experience && <p className="text-sm text-red-500">{errors.experience.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input id="education" placeholder="e.g. MS in Computer Science" {...register("education")} className={errors.education ? "border-red-500" : ""} />
                {errors.education && <p className="text-sm text-red-500">{errors.education.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Preferred Work Mode</Label>
                <div className="flex gap-2 mt-2">
                  <Button 
                    type="button" 
                    variant={watchAllFields.workPreference === "remote" ? "default" : "outline"} 
                    className="flex-1"
                    onClick={() => setValue("workPreference", "remote", { shouldValidate: true })}
                  >Remote</Button>
                  <Button 
                    type="button" 
                    variant={watchAllFields.workPreference === "hybrid" ? "default" : "outline"} 
                    className="flex-1"
                    onClick={() => setValue("workPreference", "hybrid", { shouldValidate: true })}
                  >Hybrid</Button>
                  <Button 
                    type="button" 
                    variant={watchAllFields.workPreference === "on-site" ? "default" : "outline"} 
                    className="flex-1"
                    onClick={() => setValue("workPreference", "on-site", { shouldValidate: true })}
                  >On-site</Button>
                </div>
                {errors.workPreference && <p className="text-sm text-red-500">{errors.workPreference.message}</p>}
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button onClick={addSkill} type="button">Add</Button>
                </div>
                {errors.skills && <p className="text-sm text-red-500">{errors.skills.message}</p>}
              </div>
              <div className="flex flex-wrap gap-2 pt-4">
                {watchAllFields.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1">
                    {skill}
                    <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => removeSkill(skill)} />
                  </Badge>
                ))}
                {watchAllFields.skills.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                <Label>Where do you want to work?</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g. New York, London, Remote" 
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLocation();
                      }
                    }}
                  />
                  <Button onClick={addLocation} type="button">Add</Button>
                </div>
                {errors.preferredLocations && <p className="text-sm text-red-500">{errors.preferredLocations.message}</p>}
              </div>
              <div className="flex flex-wrap gap-2 pt-4">
                {watchAllFields.preferredLocations.map((loc) => (
                  <Badge key={loc} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1">
                    {loc}
                    <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => removeLocation(loc)} />
                  </Badge>
                ))}
                {watchAllFields.preferredLocations.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No locations added yet.</p>
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center justify-center py-8">
              <Label className="w-full">Upload Resume (PDF)</Label>
              <div 
                className={`w-full max-w-sm border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'} ${watchAllFields.resumeUploaded ? 'border-green-500 bg-green-500/5' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('resume-upload')?.click()}
              >
                {watchAllFields.resumeUploaded ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1 text-green-600">Resume Uploaded</h3>
                    <p className="text-sm text-muted-foreground mb-4">Click or drag to replace</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Upload Resume</h3>
                    <p className="text-sm text-muted-foreground mb-4">Drag & drop your PDF here</p>
                  </>
                )}
                
                <Input id="resume-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
                <Button variant="outline" size="sm" type="button">Browse Files</Button>
              </div>
              {errors.resumeUploaded && <p className="text-sm text-red-500 w-full text-center">{errors.resumeUploaded.message}</p>}
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
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{watchAllFields.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-medium">{watchAllFields.preferredRole}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">{watchAllFields.experience} Years</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Work Mode</span>
                  <span className="font-medium capitalize">{watchAllFields.workPreference}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Skills</span>
                  <span className="font-medium">{watchAllFields.skills.length} Added</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resume</span>
                  <span className="font-medium text-primary flex items-center gap-1">
                    {watchAllFields.resumeUploaded ? "Uploaded" : "Missing"} <CheckCircle2 className="w-3 h-3" />
                  </span>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Your profile is ready for AI analysis. Let&apos;s find your dream job!
              </p>
            </div>
          )}

        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={handlePrev} className="gap-2" type="button">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        ) : (
          <div /> // Placeholder for spacing
        )}
        
        {step < 6 ? (
          <Button onClick={handleNext} className="gap-2" type="button">
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button type="submit" form="register-form" disabled={isSubmitting} className="gap-2 bg-primary text-primary-foreground">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
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
