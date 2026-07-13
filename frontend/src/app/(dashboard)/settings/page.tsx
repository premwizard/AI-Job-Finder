import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Shield, 
  Key, 
  Plug, 
  Moon,
  Laptop,
  CheckCircle2,
  Mail,
  Smartphone
} from "lucide-react";
import { ChangePasswordCard } from "@/components/settings/ChangePasswordCard";
import { DeleteAccountFlow } from "@/components/settings/DeleteAccountFlow";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Manage your account settings, integrations, and preferences.
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6 bg-muted/50 p-1">
          <TabsTrigger value="account" className="gap-2">
            <Shield className="w-4 h-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Key className="w-4 h-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Plug className="w-4 h-4" /> Integrations
          </TabsTrigger>
          <TabsTrigger value="apikeys" className="gap-2">
            <Key className="w-4 h-4" /> API Keys
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6 outline-none">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your email and password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-w-md">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" defaultValue="johndoe@example.com" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the theme of your dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer bg-accent/50 border-primary/50">
                  <Moon className="w-5 h-5" />
                  <span className="font-medium">Dark Mode</span>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer opacity-50">
                  <Laptop className="w-5 h-5" />
                  <span className="font-medium">System</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Link external accounts for SSO and profile syncing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold">G</div>
                  <div>
                    <h4 className="font-semibold text-sm">Google</h4>
                    <p className="text-xs text-muted-foreground">johndoe@example.com</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Connected
                </Button>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-700 text-white rounded flex items-center justify-center font-bold">in</div>
                  <div>
                    <h4 className="font-semibold text-sm">LinkedIn</h4>
                    <p className="text-xs text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 outline-none">
          <ChangePasswordCard />

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Email Verification Status</CardTitle>
              <CardDescription>Status of your registered email address.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Email Verified</h4>
                    <p className="text-xs text-muted-foreground">Your email is verified and secure.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 opacity-70">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Active Sessions</CardTitle>
                  <CardDescription>Manage your active logins across devices.</CardDescription>
                </div>
                <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Coming Soon</div>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 opacity-70">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Login History</CardTitle>
                  <CardDescription>Review recent login activity and locations.</CardDescription>
                </div>
                <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Coming Soon</div>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 opacity-70">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account.</CardDescription>
                </div>
                <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Coming Soon</div>
              </CardHeader>
            </Card>

            {/* Danger Zone */}
            <div className="mt-2 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-destructive uppercase tracking-wider">Danger Zone</h3>
                <div className="flex-1 h-px bg-destructive/20" />
              </div>
              <DeleteAccountFlow />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 outline-none">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Email Preferences</CardTitle>
              <CardDescription>Control what emails you receive from AI Job Finder.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-semibold text-sm">Weekly Job Matches</h4>
                    <p className="text-xs text-muted-foreground">Receive a weekly digest of highly matched AI jobs.</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">Enabled</Button>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-semibold text-sm">Application Updates</h4>
                    <p className="text-xs text-muted-foreground">Get notified when an employer views your application.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Disabled</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>Manage browser and mobile notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-semibold text-sm">Interview Reminders</h4>
                    <p className="text-xs text-muted-foreground">Get pinged 30 minutes before a scheduled mock interview.</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">Enabled</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6 outline-none">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Model Context Protocol (MCP)</CardTitle>
              <CardDescription>Connect external tools and servers to your AI Assistant.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/30 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">GitHub Server</h4>
                  <p className="text-sm text-muted-foreground">Allow AI to read your repos to verify skills.</p>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Local File System</h4>
                  <p className="text-sm text-muted-foreground">Allow AI to access local project files.</p>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              <Button className="w-full gap-2 mt-2" variant="secondary">
                <Plug className="w-4 h-4" /> Add Custom MCP Server
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apikeys" className="space-y-6 outline-none">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Bring Your Own Key (BYOK)</CardTitle>
              <CardDescription>Use your own LLM API keys for the AI Assistant.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>OpenAI API Key</Label>
                <div className="flex gap-2">
                  <Input type="password" value="sk-xxxxxxxxxxxxxxxxxxxxxxxx" readOnly />
                  <Button variant="outline">Update</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Anthropic API Key</Label>
                <div className="flex gap-2">
                  <Input type="password" placeholder="sk-ant-..." />
                  <Button variant="outline">Save</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
