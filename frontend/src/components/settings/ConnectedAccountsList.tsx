"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { getConnectedAccounts, disconnectAccount, initiateSocialLogin, ConnectedAccountResponse, AuthProvider } from "@/features/auth/services/social_auth.api";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth";

export function ConnectedAccountsList() {
  const [accounts, setAccounts] = useState<ConnectedAccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAccounts = async () => {
    try {
      const data = await getConnectedAccounts();
      setAccounts(data);
    } catch (error) {
      toast({
        title: "Error fetching accounts",
        description: "Could not load connected accounts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDisconnect = async (provider: AuthProvider) => {
    try {
      await disconnectAccount(provider);
      toast({ title: "Account disconnected" });
      fetchAccounts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Could not disconnect account.",
        variant: "destructive",
      });
    }
  };

  const renderProvider = (name: string, provider: AuthProvider, iconText: string, colorClass: string) => {
    const connected = accounts.find(a => a.provider === provider);
    
    return (
      <div className="flex justify-between items-center p-4 border rounded-lg bg-muted/30 mb-4" key={provider}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center font-bold ${colorClass}`}>
            {iconText}
          </div>
          <div>
            <h4 className="font-semibold text-sm">{name}</h4>
            <p className="text-xs text-muted-foreground">
              {connected ? connected.provider_email || "Connected" : "Not connected"}
            </p>
          </div>
        </div>
        {connected ? (
          <div className="flex gap-2 items-center">
            <Button variant="outline" size="sm" className="gap-2 pointer-events-none">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Connected
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDisconnect(provider)}>
              Disconnect
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => initiateSocialLogin(provider)}>
            Connect
          </Button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
        <CardDescription>Link external accounts for single sign-on (SSO).</CardDescription>
      </CardHeader>
      <CardContent>
        {renderProvider("Google", "google", "G", "bg-red-100 text-red-600")}
        {renderProvider("GitHub", "github", "gh", "bg-gray-800 text-white")}
        {renderProvider("LinkedIn", "linkedin", "in", "bg-blue-700 text-white")}
      </CardContent>
    </Card>
  );
}
