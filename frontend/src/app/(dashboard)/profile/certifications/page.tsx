"use client";

import { useQuery } from "@tanstack/react-query";
import { getFullProfile } from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Award, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function CertificationsPage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getFullProfile,
  });

  const certifications = profile?.certifications || [];

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>;
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold">Certifications</h2>
          <p className="text-sm text-muted-foreground">Showcase your professional certifications and licenses.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-muted/10">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">No certifications added</h3>
          <p className="text-muted-foreground mt-1 mb-6">Add your relevant certifications to stand out.</p>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Add Certification
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {certifications.map((cert: any) => (
            <Card key={cert.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 -mt-2 -mr-2">Edit</Button>
                </div>
                
                <h3 className="text-lg font-bold line-clamp-1" title={cert.name}>{cert.name}</h3>
                <p className="font-medium text-primary mt-1 line-clamp-1">{cert.issuer}</p>
                
                <div className="space-y-2 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Issued: {cert.issue_date ? format(new Date(cert.issue_date), "MMM yyyy") : "N/A"}
                    </span>
                  </div>
                  {cert.expiry_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Expires: {format(new Date(cert.expiry_date), "MMM yyyy")}
                      </span>
                    </div>
                  )}
                </div>

                {cert.verification_url && (
                  <div className="mt-6">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={cert.verification_url} target="_blank">
                        Show Credential <ExternalLink className="w-3 h-3 ml-2" />
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
