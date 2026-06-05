import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AppWindow, ArrowRight, ShieldCheck, BarChart3, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../store/auth';

export function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const emailValue = formData.get('email') as string || 'admin@company.com';
    setIsLoading(true);
    // Simulate API Auth Request
    setTimeout(() => {
      login(
        btoa(emailValue + Date.now().toString()),
        { id: 'usr_1', name: emailValue.split('@')[0], email: emailValue, role: 'admin' },
        3600 // 1 hour session
      );
    }, 1000);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-secondary/30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-foreground font-semibold tracking-tight text-2xl mb-12">
             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <AppWindow className="text-primary-foreground w-6 h-6" />
            </div>
            <span>Command<span className="text-muted-foreground">Center</span></span>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 max-w-lg"
          >
            <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
              Enterprise commerce operations, <br />
              <span className="text-muted-foreground">unified.</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Monitor, analyze, and manage multiple Shopify storefronts from a single, powerful Command Center.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 grid gap-6 grid-cols-1 sm:grid-cols-2 mt-20">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-2xl flex flex-col gap-3">
             <div className="w-10 h-10 rounded-full bg-chart-1/20 flex items-center justify-center text-chart-1">
               <BarChart3 className="w-5 h-5" />
             </div>
             <div>
               <h3 className="font-semibold text-foreground">Advanced Analytics</h3>
               <p className="text-sm text-muted-foreground mt-1">Real-time revenue tracking and forecasting across all regions.</p>
             </div>
           </motion.div>
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-2xl flex flex-col gap-3">
             <div className="w-10 h-10 rounded-full bg-chart-2/20 flex items-center justify-center text-chart-2">
               <Globe className="w-5 h-5" />
             </div>
             <div>
               <h3 className="font-semibold text-foreground">Global Operations</h3>
               <p className="text-sm text-muted-foreground mt-1">Manage multiple localized storefronts seamlessly.</p>
             </div>
           </motion.div>
        </div>
        
        {/* Abstract 3D-like structural shapes in background */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -right-20 w-72 h-72 bg-chart-2/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 lg:p-12 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-8 bg-card p-8 sm:p-10 rounded-3xl border border-border/50 shadow-2xl shadow-black/5"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your administration dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input id="email" name="email" type="email" placeholder="admin@company.com" required className="h-11 bg-secondary/50 border-transparent focus-visible:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-all">Forgot password?</a>
                </div>
                <Input id="password" name="password" type="password" placeholder="••••••••" required className="h-11 bg-secondary/50 border-transparent focus-visible:ring-primary/20" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="rounded border-border bg-secondary/50 text-primary w-4 h-4 cursor-pointer" />
              <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                Remember this device for 30 days
              </label>
            </div>

            <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20 group relative overflow-hidden" disabled={isLoading}>
              {isLoading ? (
                 <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                 </span>
              ) : (
                <span className="flex items-center">
                  Sign In <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

           <div className="pt-6 border-t border-border/50 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4" />
              <span>Secured by Enterprise SSO</span>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
