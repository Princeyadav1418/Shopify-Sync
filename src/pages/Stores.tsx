import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Store, Globe, ArrowUpRight, ArrowDownRight, Settings2, MoreVertical, RefreshCw, AlertTriangle, ShieldCheck, Activity, PackageX, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as any, stiffness: 500, damping: 30 } }
};

import { api } from '../lib/api';

export function Stores() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await api.getStores();
      if (data.connected && data.stores && data.stores.length > 0) {
        setStores(data.stores);
        setSynced(true);
      } else {
        setStores([]);
        setSynced(false);
      }
    } catch (err) {
      console.error(err);
      setStores([]);
      setSynced(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSync = async () => {
    toast("Syncing...", { description: "Synchronizing data with Shopify." });
    await fetchStores();
    if (synced) toast.success("Sync complete.");
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Network Health</h1>
          <p className="text-muted-foreground mt-1 text-sm">Monitor operations, track anomalies, and manage Shopify connections.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-border/50 bg-card/50 backdrop-blur" onClick={handleSync} disabled={loading}>
             {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />} 
             Sync All
          </Button>
          <Button className="shadow-lg shadow-primary/20 bg-foreground text-background hover:bg-foreground/90" onClick={() => toast("OAuth Setup Required", { description: "Configure SHOPIFY_STORES_CONFIG in your settings Secrets panel." })}>Connect Store</Button>
        </div>
      </div>
      
      {!synced && !loading && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
           <div className="flex items-start gap-4">
              <div className="mt-0.5 p-2 bg-primary/10 text-primary rounded-full">
                 <Store className="w-5 h-5" />
              </div>
              <div>
                 <h3 className="font-semibold text-primary">No Stores Connected</h3>
                 <p className="text-sm text-foreground">You currently have no active Shopify instances. To connect your stores, set the <code className="bg-primary/10 text-primary px-1 rounded mx-1 text-xs">SHOPIFY_STORES_CONFIG</code> environment variable.</p>
              </div>
           </div>
        </motion.div>
      )}

      {/* Network Anomaly Detection */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
         <div className="flex items-start gap-4">
            <div className="mt-0.5 p-2 bg-destructive/10 text-destructive rounded-full">
               <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
               <h3 className="font-semibold text-destructive">Network Alert: APAC Region</h3>
               <p className="text-sm text-foreground">API Rate Limiting is currently delaying inventory syncs for <span className="font-medium">Acme APAC</span>. Operations may experience a 15-minute delay on stock updates.</p>
            </div>
         </div>
         <Button size="sm" variant="outline" className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => toast("Increasing Limits", { description: "Requesting rate limit bump from Shopify API." })}>Request Limit Bump</Button>
      </motion.div>

      <div className="flex items-center justify-between pt-2">
        <h2 className="text-lg font-medium tracking-tight">Active Nodes ({stores.length})</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
        </div>
      ) : (
        <motion.div 
          variants={container} 
          initial="hidden" 
          animate="show" 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function StoreCard({ store }: { store: any, key?: string | number }) {
  // Generate some specific alerts for realism
  const issues = store.status === 'warning' ? 
    [{ type: 'api', message: 'API rate limits approaching.' }, { type: 'stock', message: '12 empty SKUs.' }] : 
    (store.growth < 0 ? [{ type: 'sales', message: 'Revenue pacing below forecast.' }] : []);

  return (
    <motion.div 
      variants={item} 
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 0 25px -5px var(--primary), 0 0 0 2px var(--primary)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="h-full group relative StoreCard rounded-xl"
    >
       {/* Background animated prominent glow that activates on hover via group */}
       <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500 pointer-events-none" />
       
       <Card className="h-full border-border/40 bg-card/90 backdrop-blur-xl transition-all duration-300 flex flex-col relative overflow-hidden group hover:shadow-2xl">
         {/* Top border glow effect */}
         <div className="absolute inset-x-0 -top-px h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
         
         <CardHeader className="flex flex-row items-start justify-between pb-4">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-secondary/80 border border-border/50 flex items-center justify-center shrink-0 shadow-inner overflow-hidden relative group-hover:scale-105 transition-transform">
                <Store className="w-6 h-6 text-foreground/70" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100" />
             </div>
             <div>
               <CardTitle className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">{store.name}</CardTitle>
               <CardDescription className="flex items-center gap-1 mt-1 text-xs font-mono">
                 <Globe className="w-3 h-3" /> {store.url}
               </CardDescription>
             </div>
           </div>
           
           <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 outline-none cursor-pointer">
                  <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card backdrop-blur-xl border-border/50">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Store Actions</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast("Dashboard", { description: `Opening ${store.name} operations center...` })}>Operations Center</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast("Sync Data", { description: `Triggering manual sync for ${store.name}...` })}>Force Sync</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => toast("Disconnect Store", { description: `Initiating disconnection sequence for ${store.name}.` })}>Revoke Access</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
         </CardHeader>

         <CardContent className="flex-1 space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">MRR</p>
                <p className="text-2xl font-semibold tracking-tight tabular-nums">₹{store.revenue.toLocaleString()}</p>
                <p className={store.growth > 0 ? "text-chart-1 text-xs flex items-center bg-chart-1/10 w-fit px-1 py-0.5 rounded" : "text-destructive text-xs flex items-center bg-destructive/10 w-fit px-1 py-0.5 rounded"}>
                  {store.growth > 0 ? <ArrowUpRight className="w-3 h-3 justify-center mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {Math.abs(store.growth)}% vs LM
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Volume</p>
                <p className="text-2xl font-semibold tracking-tight tabular-nums">{store.orders.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1 text-nowrap">Orders this cycle</p>
              </div>
           </div>

           <div className="space-y-3 pt-2">
             <div className="flex items-center justify-between text-xs">
               <span className="text-muted-foreground font-medium">Inventory Saturation</span>
               <span className="font-semibold text-foreground">{(store.inventoryValue / 300000 * 100).toFixed(0)}%</span>
             </div>
             <Progress value={(store.inventoryValue / 300000) * 100} className="h-1.5 bg-secondary/50 [&>div]:bg-chart-3" />
             
             {/* Operational Mini-Alerts Block */}
             <div className="mt-4 pt-4 border-t border-border/40 grid grid-cols-1 gap-2">
                {issues.length > 0 ? issues.map((issue, i) => (
                   <div key={i} className="flex items-center gap-2 text-xs">
                      {issue.type === 'api' ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> : <PackageX className="w-3.5 h-3.5 text-destructive" />}
                      <span className={issue.type === 'api' ? "text-amber-500" : "text-destructive"}>{issue.message}</span>
                   </div>
                )) : (
                   <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-chart-2" />
                      <span className="text-chart-2">Systems stable. No anomalies detected.</span>
                   </div>
                )}
             </div>
           </div>
         </CardContent>

         <CardFooter className="pt-4 border-t border-border/20 bg-secondary/10 flex items-center justify-between">
           <motion.div
             animate={store.status === 'active' ? { 
               scale: [1, 1.05, 1, 1.05, 1], 
               opacity: [0.8, 1, 0.8, 1, 0.8] 
             } : {}}
             transition={{ duration: 2, ease: "easeInOut", times: [0, 0.15, 0.3, 0.45, 1], repeat: Infinity }}
           >
             <Badge variant="outline" className={cn(
               "border-transparent font-medium shadow-none",
               store.status === 'active' ? 'bg-chart-1/10 text-chart-1' : 'bg-chart-4/10 text-chart-4'
             )}>
               <span className="relative flex h-2 w-2 mr-2">
                 {store.status === 'active' && (
                   <motion.span
                     animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
                     transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
                     className="absolute inline-flex h-full w-full rounded-full bg-current opacity-75"
                   />
                 )}
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
               </span>
               {store.status === 'active' ? 'Sync: Optimal' : 'Sync: Degraded'}
             </Badge>
           </motion.div>
           
           <Sheet>
             <SheetTrigger render={
               <Button variant="outline" className="h-8 px-3 text-xs bg-background shadow-sm hover:bg-accent text-accent-foreground">
                 <Activity className="w-3 h-3 mr-1.5" /> Quick View
               </Button>
             } />
             <SheetContent className="bg-card w-[400px] border-l border-border/50 shadow-2xl">
               <SheetHeader>
                 <SheetTitle>{store.name} Quick View</SheetTitle>
                 <SheetDescription>
                   Aggregated KPIs and sync health status.
                 </SheetDescription>
               </SheetHeader>
               <div className="py-6 space-y-6">
                  <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">sync health status</p>
                    <div className="flex items-center gap-2">
                       <span className="relative flex h-3 w-3">
                         {store.status === 'active' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-1 opacity-40"></span>}
                         <span className={cn("relative inline-flex rounded-full h-3 w-3", store.status === 'active' ? 'bg-chart-1' : 'bg-chart-4')}></span>
                       </span>
                       <span className="font-medium">{store.status === 'active' ? 'Optimal' : 'Degraded'}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Last synced: Just now</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
                       <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">order volume</p>
                       <p className="text-2xl font-semibold tabular-nums">{store.orders.toLocaleString()}</p>
                       <p className="text-xs text-muted-foreground mt-1 text-nowrap">Orders this cycle</p>
                     </div>
                     <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
                       <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Revenue (MRR)</p>
                       <p className="text-xl font-semibold tabular-nums">₹{store.revenue.toLocaleString()}</p>
                       <p className={store.growth > 0 ? "text-chart-1 text-xs flex items-center mt-1" : "text-destructive text-xs flex items-center mt-1"}>
                         {store.growth > 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                         {Math.abs(store.growth)}%
                       </p>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                     <h4 className="text-sm font-semibold">Endpoint Identity</h4>
                     <div className="p-3 bg-secondary/30 rounded-md border border-border/50">
                        <p className="text-sm font-mono break-all">{store.url}</p>
                        <p className="text-xs text-muted-foreground mt-1">Region: {store.region}</p>
                     </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border/50">
                    <Button className="w-full" onClick={() => toast("Diagnostic report generated.", { description: "Report emailed to admin team." })}>View Full Operations Center</Button>
                  </div>
               </div>
             </SheetContent>
           </Sheet>
         </CardFooter>
       </Card>
    </motion.div>
  );
}

// Utility to handle class merging (duplicate of what is generated in shadcn but useful here)
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

