"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EducationItem } from "../../types/education.types";
import { uploadEducationFile } from "../../services/profile.api";
import { Loader2, Upload, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const educationSchema = z
  .object({
    institution_name: z.string().min(2, "Institution name is required (min 2 characters)"),
    institution_logo_url: z.string().optional(),
    degree: z.string().min(2, "Degree is required (e.g. Bachelor of Science)"),
    major: z.string().optional(),
    specialization: z.string().optional(),
    cgpa: z.string().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    is_current: z.boolean().default(false),
    activities: z.string().optional(),
    honors_awards: z.string().optional(),
    relevant_coursework: z.string().optional(),
    certificate_url: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.is_current && data.start_date && data.end_date) {
        return new Date(data.start_date) <= new Date(data.end_date);
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["end_date"],
    }
  );

type EducationFormValues = z.infer<typeof educationSchema>;

interface EducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  education?: EducationItem | null;
  onSave: (data: EducationFormValues) => Promise<void>;
}

export function EducationDialog({
  open,
  onOpenChange,
  education,
  onSave,
}: EducationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCert, setIsUploadingCert] = useState(false);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution_name: "",
      institution_logo_url: "",
      degree: "",
      major: "",
      specialization: "",
      cgpa: "",
      start_date: "",
      end_date: "",
      is_current: false,
      activities: "",
      honors_awards: "",
      relevant_coursework: "",
      certificate_url: "",
    },
  });

  useEffect(() => {
    if (education) {
      form.reset({
        institution_name: education.institution_name || education.institution || "",
        institution_logo_url: education.institution_logo_url || "",
        degree: education.degree || "",
        major: education.major || "",
        specialization: education.specialization || "",
        cgpa: education.cgpa || education.grade || "",
        start_date: education.start_date ? education.start_date.split("T")[0] : "",
        end_date: education.end_date ? education.end_date.split("T")[0] : "",
        is_current: education.is_current || false,
        activities: education.activities || "",
        honors_awards: education.honors_awards || "",
        relevant_coursework: education.relevant_coursework || "",
        certificate_url: education.certificate_url || "",
      });
    } else {
      form.reset({
        institution_name: "",
        institution_logo_url: "",
        degree: "",
        major: "",
        specialization: "",
        cgpa: "",
        start_date: "",
        end_date: "",
        is_current: false,
        activities: "",
        honors_awards: "",
        relevant_coursework: "",
        certificate_url: "",
      });
    }
  }, [education, open, form]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingLogo(true);
      const res = await uploadEducationFile(file);
      form.setValue("institution_logo_url", res.url);
      toast.success("Logo uploaded successfully");
    } catch {
      toast.error("Failed to upload logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingCert(true);
      const res = await uploadEducationFile(file);
      form.setValue("certificate_url", res.url);
      toast.success("Certificate attached successfully");
    } catch {
      toast.error("Failed to upload certificate");
    } finally {
      setIsUploadingCert(false);
    }
  };

  const handleSubmit = async (values: EducationFormValues) => {
    try {
      setIsSubmitting(true);
      await onSave(values);
      onOpenChange(false);
    } catch {
      // Error handled in caller
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{education ? "Edit Education" : "Add Education"}</DialogTitle>
          <DialogDescription>
            Enter your academic background, institution details, CGPA, and achievements.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            {/* Institution Name & Logo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="institution_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Stanford University" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel>Institution Logo (Optional)</FormLabel>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload-input"
                  />
                  <label htmlFor="logo-upload-input" className="w-full">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full h-9 text-xs"
                      disabled={isUploadingLogo}
                      asChild
                    >
                      <span>
                        {isUploadingLogo ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                        ) : (
                          <ImageIcon className="w-3.5 h-3.5 mr-1" />
                        )}
                        {form.watch("institution_logo_url") ? "Change Logo" : "Upload Logo"}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            {/* Degree & Major */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Bachelor of Science, Master of Arts" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Major / Field of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Computer Science, Economics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Specialization & CGPA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Artificial Intelligence, Data Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cgpa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CGPA / Percentage / Grade</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 3.85 / 4.0 or 88%" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dates & Currently Studying */}
            <div className="space-y-3 p-3 bg-muted/20 rounded-lg border border-border/40">
              <FormField
                control={form.control}
                name="is_current"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                      I am currently studying here
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!form.watch("is_current") && (
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (or Expected)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* Activities & Honors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="activities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activities & Societies</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Clubs, student council, sports teams..."
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="honors_awards"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Honors & Awards</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Dean's list, scholarships, rank..."
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Relevant Coursework */}
            <FormField
              control={form.control}
              name="relevant_coursework"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevant Coursework</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Data Structures, Machine Learning, Operating Systems..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Attach Degree Certificate */}
            <div className="p-3 border border-dashed rounded-lg bg-background flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <FormLabel className="text-sm font-medium">Degree Certificate (Optional Attachment)</FormLabel>
                <p className="text-xs text-muted-foreground">Upload PDF or image copy of degree / transcript.</p>
                {form.watch("certificate_url") && (
                  <a
                    href={form.watch("certificate_url")}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 underline font-medium mt-1 inline-block"
                  >
                    View Attached File
                  </a>
                )}
              </div>

              <div>
                <Input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleCertUpload}
                  className="hidden"
                  id="cert-upload-input"
                />
                <label htmlFor="cert-upload-input">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    disabled={isUploadingCert}
                    asChild
                  >
                    <span>
                      {isUploadingCert ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 mr-1" />
                      )}
                      {form.watch("certificate_url") ? "Replace File" : "Upload File"}
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {education ? "Save Changes" : "Add Education"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
