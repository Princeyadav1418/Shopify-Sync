import React, { useState } from 'react';
import { User, Shield, Bell, Palette, Store, FileText, Download, Calendar as CalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTheme } from '../store/theme';
import { cn } from '@/lib/utils';
import { useAuth } from '../store/auth';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [reportFormat, setReportFormat] = useState('pdf');

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your account, routing rules, and command center preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <Button 
            variant="ghost" 
            className={cn("w-full justify-start font-medium", activeTab === 'profile' ? "bg-secondary/50" : "text-muted-foreground hover:text-foreground")}
            onClick={() => setActiveTab('profile')}
          >
            <User className="w-4 h-4 mr-2" /> Profile Administrator
          </Button>
          <Button 
            variant="ghost" 
            className={cn("w-full justify-start font-medium", activeTab === 'appearance' ? "bg-secondary/50" : "text-muted-foreground hover:text-foreground")}
            onClick={() => setActiveTab('appearance')}
          >
            <Palette className="w-4 h-4 mr-2" /> Interface Settings
          </Button>
          <Button 
            variant="ghost" 
            className={cn("w-full justify-start font-medium", activeTab === 'reports' ? "bg-secondary/50" : "text-muted-foreground hover:text-foreground")}
            onClick={() => setActiveTab('reports')}
          >
            <FileText className="w-4 h-4 mr-2" /> Executive Reporting
          </Button>
          <Button 
            variant="ghost" 
            className={cn("w-full justify-start font-medium", activeTab === 'stores' ? "bg-secondary/50" : "text-muted-foreground hover:text-foreground")}
            onClick={() => setActiveTab('stores')}
          >
            <Store className="w-4 h-4 mr-2" /> Store Network API
          </Button>
          <Button 
            variant="ghost" 
            className={cn("w-full justify-start font-medium", activeTab === 'notifications' ? "bg-secondary/50" : "text-muted-foreground hover:text-foreground")}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="w-4 h-4 mr-2" /> Alert Subscriptions
          </Button>
          <Button 
            variant="ghost" 
            className={cn("w-full justify-start font-medium", activeTab === 'security' ? "bg-secondary/50" : "text-muted-foreground hover:text-foreground")}
            onClick={() => setActiveTab('security')}
          >
            <Shield className="w-4 h-4 mr-2" /> Access Control <span className="ml-auto text-xs bg-chart-1/20 text-chart-1 px-2 py-0.5 rounded-full">Pro</span>
          </Button>
        </aside>

        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <Card className="bg-card/40 border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and active context.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name || "Admin Executive"} className="max-w-md bg-secondary/50 border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email || "admin@company.com"} className="max-w-md bg-secondary/50 border-border/50" />
                </div>
                <Button onClick={() => toast("Profile updated", { description: "Your details have been saved successfully." })}>Save Profile State</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="bg-card/40 border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Global Theme</CardTitle>
                <CardDescription>Customize the visual mode of your command center.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => setTheme('dark')}
                    className={cn("w-32 p-1 border-2 rounded-lg cursor-pointer bg-background transition-all", theme === 'dark' ? "border-primary" : "border-transparent hover:border-border opacity-50")}
                  >
                    <div className="h-20 bg-[#000000] rounded overflow-hidden p-2 flex flex-col gap-1">
                       <div className="h-2 w-full bg-white/20 rounded-full" />
                       <div className="h-2 w-3/4 bg-white/20 rounded-full" />
                       <div className="flex-1 rounded-sm bg-white/10 mt-1 flex gap-1 p-1">
                          <div className="h-full w-1/3 bg-white/10 rounded-sm" />
                          <div className="h-full w-2/3 bg-white/10 rounded-sm" />
                       </div>
                    </div>
                    <p className="text-center text-xs font-medium mt-2">Dark Engine {theme === 'dark' && '(Active)'}</p>
                  </div>
                  
                  <div 
                    onClick={() => setTheme('light')}
                    className={cn("w-32 p-1 border-2 rounded-lg cursor-pointer bg-background transition-all", theme === 'light' ? "border-primary" : "border-transparent hover:border-border opacity-50")}
                  >
                    <div className="h-20 bg-white rounded overflow-hidden p-2 flex flex-col gap-1 border border-black/10">
                       <div className="h-2 w-full bg-black/20 rounded-full" />
                       <div className="h-2 w-3/4 bg-black/20 rounded-full" />
                       <div className="flex-1 rounded-sm bg-black/5 mt-1 flex gap-1 p-1">
                          <div className="h-full w-1/3 bg-black/10 rounded-sm" />
                          <div className="h-full w-2/3 bg-black/10 rounded-sm" />
                       </div>
                    </div>
                    <p className="text-center text-xs font-medium mt-2">Light Engine {theme === 'light' && '(Active)'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <Card className="bg-card/40 border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle>Automated Delivery Schedule</CardTitle>
                  <CardDescription>Configure recurring reports for C-Suite and stakeholders.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Report Cadence</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="bg-secondary/50 border-primary shadow-sm text-primary">Daily Brief</Button>
                      <Button variant="outline" className="bg-background text-muted-foreground">Weekly Digest</Button>
                      <Button variant="outline" className="bg-background text-muted-foreground">EOM Summary</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Format Preference</Label>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className={cn(reportFormat === 'pdf' ? "bg-secondary/50 border-primary shadow-sm text-primary" : "bg-background text-muted-foreground")}
                        onClick={() => setReportFormat('pdf')}
                      >
                        PDF Overview
                      </Button>
                      <Button 
                        variant="outline" 
                        className={cn(reportFormat === 'csv' ? "bg-secondary/50 border-primary shadow-sm text-primary" : "bg-background text-muted-foreground")}
                        onClick={() => setReportFormat('csv')}
                      >
                        Raw CSV Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-secondary/20 border-t border-border/50 py-4 flex gap-3">
                  <Button onClick={() => toast("Schedule Created", { description: "You will receive an automated report daily at 9AM." })}><CalIcon className="w-4 h-4 mr-2"/> Save Schedule</Button>
                  <Button variant="secondary" onClick={() => toast("Export Triggered", { description: `Generating manual ${reportFormat.toUpperCase()} snapshot...` })}><Download className="w-4 h-4 mr-2" /> Generate Now</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab !== 'profile' && activeTab !== 'appearance' && activeTab !== 'reports' && (
            <div className="mt-8 flex items-center justify-center h-64 border border-dashed border-border/50 rounded-xl bg-card/10">
               <div className="text-center text-muted-foreground w-64">
                 <p className="font-medium capitalize">{activeTab} controls</p>
                 <p className="text-sm opacity-70 mt-1">This module is locked subject to enterprise rollout schedules.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
