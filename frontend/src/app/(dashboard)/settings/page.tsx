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
  Laptop
} from "lucide-react";

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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-muted/50 p-1">
          <TabsTrigger value="account" className="gap-2">
            <Shield className="w-4 h-4" /> Account
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
