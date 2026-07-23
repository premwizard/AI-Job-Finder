"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationSettings,
  updateNotificationSettings,
} from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Mail,
  Smartphone,
  Clock,
  CheckCheck,
  XCircle,
  Briefcase,
  Calendar,
  Sparkles,
  ShieldAlert,
  Loader2,
  Moon,
} from "lucide-react";
import { toast } from "sonner";

const FREQUENCY_OPTIONS = ["Instant", "Hourly", "Daily Batch"];

const NOTIFICATION_TYPES_KEYS = [
  { key: "job_matches", label: "Job Matches", desc: "Alerts when new jobs match your preferences", icon: <Briefcase className="w-4 h-4 text-blue-500" /> },
  { key: "daily_digest", label: "Daily Digest", desc: "Daily summary of top job recommendations and activity", icon: <Calendar className="w-4 h-4 text-purple-500" /> },
  { key: "weekly_digest", label: "Weekly Digest", desc: "Weekly analytics performance and market trends", icon: <Calendar className="w-4 h-4 text-indigo-500" /> },
  { key: "resume_tips", label: "Resume Tips", desc: "Actionable AI tips to improve your resume impact score", icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
  { key: "career_tips", label: "Career Tips", desc: "Industry insights and career growth recommendations", icon: <Sparkles className="w-4 h-4 text-emerald-500" /> },
  { key: "interview_reminders", label: "Interview Reminders", desc: "Reminders for scheduled mock or real interviews", icon: <Clock className="w-4 h-4 text-rose-500" /> },
  { key: "product_updates", label: "Product Updates", desc: "New platform features, enhancements, and news", icon: <Bell className="w-4 h-4 text-teal-500" /> },
  { key: "security_alerts", label: "Security Alerts", desc: "Account security, login alerts, and password updates", icon: <ShieldAlert className="w-4 h-4 text-red-500" /> },
] as const;

export default function NotificationSettingsPage() {
  const queryClient = useQueryClient();

  // Notification Type States
  const [types, setTypes] = useState<Record<string, boolean>>({
    job_matches: true,
    daily_digest: true,
    weekly_digest: true,
    resume_tips: true,
    career_tips: true,
    interview_reminders: true,
    product_updates: false,
    security_alerts: true,
  });

  // Channel States
  const [emailChannel, setEmailChannel] = useState(true);
  const [inAppChannel, setInAppChannel] = useState(true);
  const [pushChannel, setPushChannel] = useState(false);

  // Frequency & Quiet Hours
  const [frequency, setFrequency] = useState("Instant");
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState("22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState("08:00");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["notificationSettings"],
    queryFn: getNotificationSettings,
  });

  useEffect(() => {
    if (!settings) return;
    setTypes({
      job_matches: settings.job_matches ?? true,
      daily_digest: settings.daily_digest ?? true,
      weekly_digest: settings.weekly_digest ?? true,
      resume_tips: settings.resume_tips ?? true,
      career_tips: settings.career_tips ?? true,
      interview_reminders: settings.interview_reminders ?? true,
      product_updates: settings.product_updates ?? false,
      security_alerts: settings.security_alerts ?? true,
    });
    setEmailChannel(settings.email_channel ?? true);
    setInAppChannel(settings.in_app_channel ?? true);
    setPushChannel(settings.push_channel ?? false);
    setFrequency(settings.notification_frequency || "Instant");
    setQuietHoursEnabled(settings.quiet_hours_enabled ?? false);
    setQuietHoursStart(settings.quiet_hours_start || "22:00");
    setQuietHoursEnd(settings.quiet_hours_end || "08:00");
  }, [settings]);

  const mutation = useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
      toast.success("Notification settings saved!");
    },
    onError: () => toast.error("Failed to save notification settings."),
  });

  const handleToggleType = (key: string, value: boolean) => {
    const updated = { ...types, [key]: value };
    setTypes(updated);
    mutation.mutate({ [key]: value });
  };

  const handleSelectAll = (enable: boolean) => {
    const updated: Record<string, boolean> = {};
    NOTIFICATION_TYPES_KEYS.forEach((t) => {
      updated[t.key] = enable;
    });
    setTypes(updated);
    mutation.mutate(updated);
    toast.success(enable ? "All notifications enabled" : "All notifications disabled");
  };

  const handleChannelToggle = (key: string, val: boolean, setter: (v: boolean) => void) => {
    setter(val);
    mutation.mutate({ [key]: val });
  };

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const allEnabled = Object.values(types).every(Boolean);

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Notification Settings</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Choose what alerts you receive, via which delivery channels, and schedule quiet hours.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSelectAll(!allEnabled)}
            className="text-xs"
          >
            {allEnabled ? (
              <><XCircle className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" /> Deselect All</>
            ) : (
              <><CheckCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Select All</>
            )}
          </Button>
        </div>
      </div>

      {/* 1. Notification Channels */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" /> Notification Delivery Channels
          </CardTitle>
          <CardDescription className="text-xs">
            Choose where notifications are dispatched
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="flex items-center justify-between p-3.5 border rounded-xl bg-background">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold">Email</span>
            </div>
            <Switch
              checked={emailChannel}
              onCheckedChange={(val) => handleChannelToggle("email_channel", val, setEmailChannel)}
            />
          </div>

          <div className="flex items-center justify-between p-3.5 border rounded-xl bg-background">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold">In-App</span>
            </div>
            <Switch
              checked={inAppChannel}
              onCheckedChange={(val) => handleChannelToggle("in_app_channel", val, setInAppChannel)}
            />
          </div>

          <div className="flex items-center justify-between p-3.5 border rounded-xl bg-background/50">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Push</span>
                <Badge variant="outline" className="ml-1.5 text-[9px] border-dashed">
                  Future
                </Badge>
              </div>
            </div>
            <Switch
              checked={pushChannel}
              onCheckedChange={(val) => handleChannelToggle("push_channel", val, setPushChannel)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Individual Notification Toggles */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" /> Notification Types & Categories
          </CardTitle>
          <CardDescription className="text-xs">
            Toggle specific alert categories on or off
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-1">
          {NOTIFICATION_TYPES_KEYS.map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3.5 border rounded-xl bg-background hover:bg-muted/10 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{item.icon}</div>
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
              <Switch
                checked={types[item.key] ?? false}
                onCheckedChange={(val) => handleToggleType(item.key, val)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. Frequency & Quiet Hours */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Delivery Frequency & Quiet Hours
          </CardTitle>
          <CardDescription className="text-xs">
            Control when notifications arrive to avoid interruptions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Notification Batching Frequency</label>
            <Select
              value={frequency}
              onValueChange={(val) => {
                setFrequency(val);
                mutation.mutate({ notification_frequency: val });
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-t border-border/40 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-500" />
                <div>
                  <p className="text-sm font-semibold">Quiet Hours</p>
                  <p className="text-xs text-muted-foreground">Mute notifications during designated rest hours.</p>
                </div>
              </div>
              <Switch
                checked={quietHoursEnabled}
                onCheckedChange={(val) => {
                  setQuietHoursEnabled(val);
                  mutation.mutate({ quiet_hours_enabled: val });
                }}
              />
            </div>

            {quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Quiet Start Time</label>
                  <Input
                    type="time"
                    value={quietHoursStart}
                    onChange={(e) => {
                      setQuietHoursStart(e.target.value);
                      mutation.mutate({ quiet_hours_start: e.target.value });
                    }}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Quiet End Time</label>
                  <Input
                    type="time"
                    value={quietHoursEnd}
                    onChange={(e) => {
                      setQuietHoursEnd(e.target.value);
                      mutation.mutate({ quiet_hours_end: e.target.value });
                    }}
                    className="h-9"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
