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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CertificationItem } from "../../types/certification.types";
import { uploadCertificationFile } from "../../services/profile.api";
import { Loader2, Upload, FileText } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  "Cloud Computing",
  "Cyber Security",
  "Software Engineering",
  "Data & AI",
  "Project Management",
  "DevOps & Infrastructure",
  "Design & UX",
  "Other",
];

const certificationSchema = z
  .object({
    name: z.string().min(2, "Certificate name is required"),
    issuer: z.string().min(2, "Issuing organization is required"),
    category: z.string().optional(),
    credential_id: z.string().optional(),
    issue_date: z.string().optional(),
    expiry_date: z.string().optional(),
    does_not_expire: z.boolean().default(false),
    verification_url: z.string().optional(),
    certificate_image_url: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.does_not_expire && data.issue_date && data.expiry_date) {
        return new Date(data.issue_date) <= new Date(data.expiry_date);
      }
      return true;
    },
    {
      message: "Expiry date must be after or equal to issue date",
      path: ["expiry_date"],
    }
  );

type CertificationFormValues = z.infer<typeof certificationSchema>;

interface CertificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certification?: CertificationItem | null;
  onSave: (data: CertificationFormValues) => Promise<void>;
}

export function CertificationDialog({
  open,
  onOpenChange,
  certification,
  onSave,
}: CertificationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: "",
      issuer: "",
      category: "Software Engineering",
      credential_id: "",
      issue_date: "",
      expiry_date: "",
      does_not_expire: false,
      verification_url: "",
      certificate_image_url: "",
    },
  });

  useEffect(() => {
    if (certification) {
      form.reset({
        name: certification.name || "",
        issuer: certification.issuer || "",
        category: certification.category || "Software Engineering",
        credential_id: certification.credential_id || "",
        issue_date: certification.issue_date ? certification.issue_date.split("T")[0] : "",
        expiry_date: certification.expiry_date ? certification.expiry_date.split("T")[0] : "",
        does_not_expire: certification.does_not_expire || false,
        verification_url: certification.verification_url || "",
        certificate_image_url: certification.certificate_image_url || "",
      });
    } else {
      form.reset({
        name: "",
        issuer: "",
        category: "Software Engineering",
        credential_id: "",
        issue_date: "",
        expiry_date: "",
        does_not_expire: false,
        verification_url: "",
        certificate_image_url: "",
      });
    }
  }, [certification, open, form]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const res = await uploadCertificationFile(file);
      form.setValue("certificate_image_url", res.url);
      toast.success("Certificate document uploaded successfully");
    } catch {
      toast.error("Failed to upload certificate document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (values: CertificationFormValues) => {
    try {
      setIsSubmitting(true);
      await onSave(values);
      onOpenChange(false);
    } catch {
      // Handled by caller
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{certification ? "Edit Certification" : "Add Certification"}</DialogTitle>
          <DialogDescription>
            Record your professional certificates, licenses, and credentials.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            {/* Certificate Name & Issuer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. AWS Certified Solutions Architect" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issuer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuing Organization *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Amazon Web Services, Google" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category & Credential ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="credential_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credential ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. AWS-123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dates & Never Expires */}
            <div className="space-y-3 p-3 bg-muted/20 rounded-lg border border-border/40">
              <FormField
                control={form.control}
                name="does_not_expire"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                      This credential does not expire
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <FormField
                  control={form.control}
                  name="issue_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!form.watch("does_not_expire") && (
                  <FormField
                    control={form.control}
                    name="expiry_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
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

            {/* Credential URL */}
            <FormField
              control={form.control}
              name="verification_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification / Credential URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.credly.com/badges/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Attach Certificate Image / PDF */}
            <div className="p-3 border border-dashed rounded-lg bg-background flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <FormLabel className="text-sm font-medium">Upload Certificate Image or PDF</FormLabel>
                <p className="text-xs text-muted-foreground">Attach badge image, PDF certificate, or license copy.</p>
                {form.watch("certificate_image_url") && (
                  <a
                    href={form.watch("certificate_image_url")}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 underline font-medium mt-1 inline-block"
                  >
                    View Uploaded File
                  </a>
                )}
              </div>

              <div>
                <Input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cert-file-upload"
                />
                <label htmlFor="cert-file-upload">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    disabled={isUploading}
                    asChild
                  >
                    <span>
                      {isUploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 mr-1" />
                      )}
                      {form.watch("certificate_image_url") ? "Replace Document" : "Upload Document"}
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
                {certification ? "Save Changes" : "Add Certification"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
