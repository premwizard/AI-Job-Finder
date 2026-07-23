"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from "@/features/profile/services/profile.api";
import {
  CertificationItem,
  CertificationSortOption,
} from "@/features/profile/types/certification.types";
import { CertificationCard } from "@/features/profile/components/certifications/CertificationCard";
import { CertificationDialog } from "@/features/profile/components/certifications/CertificationDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  Search,
  Award,
  FileText,
  Sparkles,
  Bell,
  ShieldCheck,
  Loader2,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";

const CATEGORIES = [
  "All Categories",
  "Cloud Computing",
  "Cyber Security",
  "Software Engineering",
  "Data & AI",
  "Project Management",
  "DevOps & Infrastructure",
  "Design & UX",
  "Other",
];

const STATUS_FILTERS = [
  "All Statuses",
  "Active",
  "Expiring Soon",
  "Expired",
  "Never Expires",
];

export default function CertificationsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortBy, setSortBy] = useState<CertificationSortOption>("issue_newest");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null);

  // Fetch certifications list
  const { data: certifications = [], isLoading } = useQuery<CertificationItem[]>({
    queryKey: ["certifications"],
    queryFn: getCertifications,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Certification added successfully");
    },
    onError: () => {
      toast.error("Failed to add certification");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateCertification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Certification updated successfully");
    },
    onError: () => {
      toast.error("Failed to update certification");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Certification deleted");
    },
    onError: () => {
      toast.error("Failed to delete certification");
    },
  });

  // Handlers
  const handleAddClick = () => {
    setEditingCert(null);
    setDialogOpen(true);
  };

  const handleEditClick = (item: CertificationItem) => {
    setEditingCert(item);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = async (formData: any) => {
    if (editingCert) {
      await updateMutation.mutateAsync({ id: editingCert.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  // Helper for status matching
  const getCertStatusLabel = (cert: CertificationItem) => {
    if (cert.does_not_expire) return "Never Expires";
    if (!cert.expiry_date) return "Active";
    try {
      const expDate = new Date(cert.expiry_date);
      const daysLeft = differenceInDays(expDate, new Date());
      if (daysLeft < 0) return "Expired";
      if (daysLeft <= 60) return "Expiring Soon";
      return "Active";
    } catch {
      return "Active";
    }
  };

  // Filtering & Sorting
  const filteredAndSortedCertifications = useMemo(() => {
    let result = [...certifications];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((cert) => {
        const name = cert.name.toLowerCase();
        const issuer = cert.issuer.toLowerCase();
        const credId = (cert.credential_id || "").toLowerCase();
        const cat = (cert.category || "").toLowerCase();
        return name.includes(q) || issuer.includes(q) || credId.includes(q) || cat.includes(q);
      });
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      result = result.filter((cert) => cert.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== "All Statuses") {
      result = result.filter((cert) => getCertStatusLabel(cert) === selectedStatus);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "issue_newest") {
        const dateA = a.issue_date ? new Date(a.issue_date).getTime() : 0;
        const dateB = b.issue_date ? new Date(b.issue_date).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === "issue_oldest") {
        const dateA = a.issue_date ? new Date(a.issue_date).getTime() : 0;
        const dateB = b.issue_date ? new Date(b.issue_date).getTime() : 0;
        return dateA - dateB;
      }
      if (sortBy === "expiry") {
        const dateA = a.expiry_date ? new Date(a.expiry_date).getTime() : 9999999999999;
        const dateB = b.expiry_date ? new Date(b.expiry_date).getTime() : 9999999999999;
        return dateA - dateB;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "issuer") {
        return a.issuer.localeCompare(b.issuer);
      }
      return 0;
    });

    return result;
  }, [certifications, searchQuery, selectedCategory, selectedStatus, sortBy]);

  // Future Ready Feature Placeholders
  const handleFeatureNotice = (featureName: string) => {
    toast.info(`${featureName} feature is ready for integration. AI engine is currently set to dormant.`);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Certification Management</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Showcase your professional certifications, licenses, and verified skill credentials.
          </p>
        </div>

        <Button onClick={handleAddClick} className="shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Certification
        </Button>
      </div>

      {/* Future-Ready Action Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-muted/20 border rounded-xl">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeatureNotice("Resume Certification Import")}
          className="h-9 text-xs justify-start border-dashed hover:border-blue-500/50"
        >
          <FileText className="w-3.5 h-3.5 mr-2 text-blue-500" /> Resume Import
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeatureNotice("AI Certification Recommendations")}
          className="h-9 text-xs justify-start border-dashed hover:border-purple-500/50"
        >
          <Sparkles className="w-3.5 h-3.5 mr-2 text-purple-500" /> AI Recommendations
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeatureNotice("Expiry Notifications Engine")}
          className="h-9 text-xs justify-start border-dashed hover:border-amber-500/50"
        >
          <Bell className="w-3.5 h-3.5 mr-2 text-amber-500" /> Expiry Alerts
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeatureNotice("Certification Verification Engine")}
          className="h-9 text-xs justify-start border-dashed hover:border-emerald-500/50"
        >
          <ShieldCheck className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Verify Credentials
        </Button>
      </div>

      {/* Controls: Search, Category Filter, Status Filter & Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-card p-4 rounded-xl border">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search certificate, issuer, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm h-9"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="text-xs h-9 w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="text-xs h-9 w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((st) => (
                <SelectItem key={st} value={st}>
                  {st}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
          <Select value={sortBy} onValueChange={(val: CertificationSortOption) => setSortBy(val)}>
            <SelectTrigger className="text-xs h-9 w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="issue_newest">Issue Date (Newest)</SelectItem>
              <SelectItem value="issue_oldest">Issue Date (Oldest)</SelectItem>
              <SelectItem value="expiry">Nearest Expiry</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="issuer">Issuer (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : filteredAndSortedCertifications.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/10 p-6">
          <div className="mx-auto w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Award className="w-7 h-7 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-semibold text-lg">No certifications found</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-6 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== "All Categories" || selectedStatus !== "All Statuses"
              ? "No certifications match your active search or filter criteria."
              : "Add your certifications, licenses, and verified credentials to highlight your specialized skills."}
          </p>
          <Button onClick={handleAddClick}>
            <Plus className="w-4 h-4 mr-2" /> Add Certification
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAndSortedCertifications.map((cert) => (
            <CertificationCard
              key={cert.id}
              certification={cert}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onVerify={(item) => handleFeatureNotice(`Verification trigger for ${item.name}`)}
            />
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <CertificationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        certification={editingCert}
        onSave={handleSave}
      />
    </div>
  );
}
