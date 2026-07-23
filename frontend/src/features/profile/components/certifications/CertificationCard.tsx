"use client";

import { useState } from "react";
import { CertificationItem } from "../../types/certification.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Calendar, 
  ExternalLink, 
  FileText, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2 
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";

interface CertificationCardProps {
  certification: CertificationItem;
  onEdit: (item: CertificationItem) => void;
  onDelete: (id: string) => void;
  onVerify?: (item: CertificationItem) => void;
}

export function CertificationCard({
  certification,
  onEdit,
  onDelete,
  onVerify,
}: CertificationCardProps) {
  const [copied, setCopied] = useState(false);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  // Status calculation logic
  const computeStatus = () => {
    if (certification.does_not_expire) {
      return { label: "Never Expires", variant: "never_expires" as const };
    }
    if (!certification.expiry_date) {
      return { label: "Active", variant: "active" as const };
    }

    try {
      const expDate = new Date(certification.expiry_date);
      const now = new Date();
      const daysLeft = differenceInDays(expDate, now);

      if (daysLeft < 0) {
        return { label: "Expired", variant: "expired" as const };
      }
      if (daysLeft <= 60) {
        return { label: `Expiring Soon (${daysLeft}d)`, variant: "expiring_soon" as const };
      }
      return { label: "Active", variant: "active" as const };
    } catch {
      return { label: "Active", variant: "active" as const };
    }
  };

  const statusInfo = computeStatus();

  const copyCredentialId = () => {
    if (certification.credential_id) {
      navigator.clipboard.writeText(certification.credential_id);
      setCopied(true);
      toast.success("Credential ID copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="overflow-hidden border border-border/60 hover:border-primary/40 transition-all shadow-sm hover:shadow-md bg-card flex flex-col justify-between">
      <CardContent className="p-5 md:p-6 space-y-4">
        {/* Header Badges & Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Tag */}
            {certification.category && (
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs font-semibold">
                {certification.category}
              </Badge>
            )}

            {/* Status Badge */}
            {statusInfo.variant === "never_expires" && (
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Never Expires
              </Badge>
            )}
            {statusInfo.variant === "active" && (
              <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-xs flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Active
              </Badge>
            )}
            {statusInfo.variant === "expiring_soon" && (
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" /> {statusInfo.label}
              </Badge>
            )}
            {statusInfo.variant === "expired" && (
              <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-xs flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Expired
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(certification)}
              className="h-8 px-2 text-xs"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(certification.id)}
              className="h-8 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Certificate Title & Issuer */}
        <div className="flex items-start gap-3 pt-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-primary/10 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-inner">
            <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>

          <div className="space-y-1 overflow-hidden">
            <h3 className="text-lg font-bold text-foreground leading-snug line-clamp-2" title={certification.name}>
              {certification.name}
            </h3>
            <p className="font-semibold text-primary text-sm line-clamp-1">
              Issued by {certification.issuer}
            </p>
          </div>
        </div>

        {/* Dates & Credential ID */}
        <div className="space-y-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-primary/70" />
              <span>
                Issued: {formatDate(certification.issue_date) || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-primary/70" />
              <span>
                Expires: {certification.does_not_expire ? "Never" : formatDate(certification.expiry_date) || "N/A"}
              </span>
            </div>
          </div>

          {certification.credential_id && (
            <div className="flex items-center justify-between gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/30">
              <span className="font-mono text-foreground/80 truncate">
                ID: <span className="font-semibold text-foreground">{certification.credential_id}</span>
              </span>
              <button
                onClick={copyCredentialId}
                className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                title="Copy Credential ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Credential Link & Attached File */}
        {(certification.verification_url || certification.certificate_image_url) && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {certification.verification_url && (
              <Button variant="outline" size="sm" className="h-8 text-xs flex-1" asChild>
                <a href={certification.verification_url} target="_blank" rel="noreferrer">
                  Verify Credential <ExternalLink className="w-3 h-3 ml-1.5" />
                </a>
              </Button>
            )}

            {certification.certificate_image_url && (
              <Button variant="secondary" size="sm" className="h-8 text-xs flex-1" asChild>
                <a href={certification.certificate_image_url} target="_blank" rel="noreferrer">
                  <FileText className="w-3 h-3 mr-1.5" /> View Certificate
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
