import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, ShoppingCart, 
  Users, Box, AlertCircle, RefreshCw, XCircle, ChevronRight, Store, ArrowRight, Activity, Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

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
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring" as any, stiffness: 500, damping: 30 } }
};

import { api } from '../lib/api';

export function Dashboard() {
  const navigate = useNavigate();
  const [connectedStores, setConnectedStores] = React.useState<any[]>([]);
  const [revenueData, setRevenueData] = React.useState<any[]>([]);
  const [recentOrders, setRecentOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [storesData, ordersData] = await Promise.all([
          api.getStores().catch(() => ({ stores: [] })),
          api.getOrders().catch(() => ({ orders: [] }))
        ]);
        
        setConnectedStores(storesData.stores || []);
        // Note: We might not have a getAnalytics method mapped, so we omit revenueData overriding or fake it
        setRecentOrders(ordersData.orders?.slice(0, 5) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  
  const PROFIT_MARGIN = 0.3;
  const totalRevenue = React.useMemo(() => connectedStores.reduce((acc, s) => acc + (s.revenue || 0), 0), [connectedStores]);
  const totalOrders = React.useMemo(() => connectedStores.reduce((acc, s) => acc + (s.orders || 0), 0), [connectedStores]);
  const totalCustomers = React.useMemo(() => connectedStores.reduce((acc, s) => acc + (s.customers || 0), 0), [connectedStores]);
  const totalInventory = React.useMemo(() => connectedStores.reduce((acc, s) => acc + (s.inventoryValue || 0), 0), [connectedStores]);

  return (

    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-6"
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Operations Center</h1>
          <p className="text-muted-foreground mt-1 text-sm">Global executive overview {connectedStores.length ? `across ${connectedStores.length} storefronts.` : 'No active stores connected.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-border/50" onClick={() => toast("Syncing...", { description: "Force syncing all Shopify connections." })}>
            <RefreshCw className="w-4 h-4 mr-2" /> Sync Data
          </Button>
          <Button className="shadow-lg shadow-primary/20" onClick={() => navigate('/analytics')}>
            Detailed Analytics <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>

      {/* Global Alerts */}
      {!loading && connectedStores.length === 0 && (
         <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 text-primary rounded-full">
                 <Store className="w-5 h-5" />
              </div>
              <div>
                 <h3 className="font-medium text-primary">No Stores Connected</h3>
                 <p className="text-sm text-foreground/80">Configure SHOPIFY_STORES_CONFIG in your environment variables to connect your Shopify infrastructure.</p>
              </div>
           </div>
           <Button variant="outline" size="sm" onClick={() => navigate('/stores')}>Connect Stores</Button>
         </motion.div>
      )}

      {/* Critical Alerts Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
      >
        <Card className="bg-destructive/5 border-destructive/20 shadow-none">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-full text-destructive">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-destructive">Acme APAC Sync Failed</p>
                <p className="text-xs text-muted-foreground">API Rate limit exceeded</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => toast("Retrying Sync", { description: "Queueing Acme APAC for immediate sync." })}>Resolve</Button>
          </div>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20 shadow-none">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-full text-amber-500">
                <Box className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-500">42 Products Low Stock</p>
                <p className="text-xs text-muted-foreground">Across EU & US stores</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="text-amber-500 hover:bg-amber-500/10" onClick={() => navigate('/inventory')}>Review</Button>
          </div>
        </Card>
        <Card className="bg-chart-2/5 border-chart-2/20 shadow-none">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-2/10 rounded-full text-chart-2">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-chart-2">Target Exceeded</p>
                <p className="text-xs text-muted-foreground">EU region hit Q3 goal early</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="text-chart-2 hover:bg-chart-2/10" onClick={() => toast("Details", { description: "Opening target insights." })}>View</Button>
          </div>
        </Card>
      </motion.div>

      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
      >
        <MetricCard 
          title="Gross Revenue" 
          value={`₹${totalRevenue.toLocaleString()}`}}
          change="+0%" 
          trend="up" 
          icon={DollarSign}
          color="var(--color-chart-1)"
          subtitle="Dynamic Total"
        />
        <MetricCard 
          title="Profit (Est)" 
          value={`₹${(totalRevenue * PROFIT_MARGIN).toLocaleString()}`}}
          change="+0%" 
          trend="up" 
          icon={Activity}
          color="var(--color-chart-2)"
          subtitle="Dynamic Est"
        />
        <MetricCard 
          title="Total Orders" 
          value={totalOrders.toLocaleString()} 
          change="+0%" 
          trend="up" 
          icon={ShoppingCart} 
          color="var(--color-chart-3)"
          subtitle="Dynamic Total"
        />
        <MetricCard 
          title="Active Customers" 
          value={totalCustomers.toLocaleString()} 
          change="+0%" 
          trend="up" 
          icon={Users} 
          color="var(--color-chart-5)"
          subtitle="Dynamic Total"
        />
        <MetricCard 
          title="Inventory Value" 
          value={`₹${(totalInventory / 1000).toFixed(1)}k`}}
          change="+0%" 
          trend="up" 
          icon={Box} 
          color="var(--color-chart-4)"
          subtitle="Dynamic Total"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 30 }}
          className="lg:col-span-2 space-y-4"
        >
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden h-[450px] flex flex-col shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0 border-b border-border/50 bg-card/60">
              <div className="space-y-1">
                <CardTitle className="text-lg font-medium tracking-tight">Revenue Dynamics</CardTitle>
                <CardDescription>Multi-region consolidated growth trajectory</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-normal bg-secondary/50">30 Days</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-3 h-3 mr-1" /> YTD
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorApac" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.4} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12, fontWeight: 500 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12, fontWeight: 500 }} 
                    tickFormatter={(value) => `₹${value / 1000}k`}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'var(--color-foreground)', fontWeight: 500 }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, undefined]}
                  />
                  <Area type="monotone" dataKey="us" name="United States" stroke="var(--color-chart-1)" strokeWidth={3} fillOpacity={1} fill="url(#colorUs)" />
                  <Area type="monotone" dataKey="eu" name="Europe" stroke="var(--color-chart-2)" strokeWidth={3} fillOpacity={1} fill="url(#colorEu)" />
                  <Area type="monotone" dataKey="apac" name="Asia Pacific" stroke="var(--color-chart-3)" strokeWidth={3} fillOpacity={1} fill="url(#colorApac)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 30 }}
          className="space-y-6 flex flex-col"
        >
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm h-[450px] flex flex-col shadow-sm">
            <CardHeader className="shrink-0 border-b border-border/50 bg-card/60 pb-4">
              <CardTitle className="text-lg font-medium tracking-tight">Store Leaderboard</CardTitle>
              <CardDescription>Performance rank by revenue</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
               <div className="divide-y divide-border/50">
                 {connectedStores.map((store, i) => (
                   <div key={store.id} className="p-4 hover:bg-secondary/40 transition-colors cursor-pointer group" onClick={() => navigate('/stores')}>
                     <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-secondary ${i === 0 ? 'text-chart-1 bg-chart-1/10' : i === 1 ? 'text-chart-2 bg-chart-2/10' : 'text-chart-3 bg-chart-3/10'}`}>
                            #{i + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm group-hover:text-primary transition-colors">{store.name}</p>
                            <p className="text-xs text-muted-foreground">{store.region}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">₹{store.revenue?.toLocaleString() || 0}</p>
                          <p className={`text-xs ${store.growth >= 0 ? 'text-chart-1' : 'text-destructive'}`}>
                            {store.growth >= 0 ? '+' : ''}{store.growth}%
                          </p>
                        </div>
                     </div>
                     <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mt-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(store.revenue / (connectedStores[0]?.revenue || 1)) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                          className={`h-full ${i === 0 ? 'bg-chart-1' : i === 1 ? 'bg-chart-2' : 'bg-chart-3'}`}
                        />
                     </div>
                   </div>
                 ))}
               </div>
            </CardContent>
            <CardFooter className="p-4 border-t border-border/50 bg-card/60 shrink-0">
               <Button variant="outline" className="w-full h-9 bg-secondary/50 border-border/50 text-xs shadow-sm hover:bg-secondary" onClick={() => navigate('/stores')}>
                  Compare All Stores
               </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 30 }}
      >
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between bg-card/60 border-b border-border/50">
            <div>
              <CardTitle className="text-lg font-medium tracking-tight">Fulfillment Queue</CardTitle>
              <CardDescription>Recent transactions requiring attention across network</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex bg-background shadow-xs h-8 border-border" onClick={() => navigate('/orders')}>
              <ShoppingCart className="w-3.5 h-3.5 mr-2 text-muted-foreground" /> View Order Hub
            </Button>
          </CardHeader>
          <div className="overflow-x-auto max-h-[400px] relative">
            <Table>
              <TableHeader className="sticky top-0 bg-secondary/90 backdrop-blur-md z-10">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="w-[100px] text-xs font-semibold uppercase tracking-wider h-11">Order</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider h-11">Customer</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider h-11">Store</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider h-11">Date</TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wider h-11">Amount</TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wider h-11">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order, i) => (
                  <TableRow key={order.id} className="border-border/20 hover:bg-secondary/40 transition-colors cursor-pointer group" onClick={() => navigate('/orders')}>
                    <TableCell className="font-medium font-mono text-xs group-hover:text-primary transition-colors">{order.id}</TableCell>
                    <TableCell className="font-medium">{order.customer}</TableCell>
                    <TableCell className="text-muted-foreground text-sm flex items-center gap-1.5 mt-2">
                       <Store className="w-3.5 h-3.5" />
                       {order.store}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{order.date}</TableCell>
                    <TableCell className="text-right font-medium text-sm">₹{order.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={order.status === 'fulfilled' ? 'default' : order.status === 'processing' ? 'secondary' : 'destructive'} 
                             className={order.status === 'fulfilled' ? 'bg-chart-1/10 text-chart-1 hover:bg-chart-1/20 border-transparent shadow-none' : order.status === 'processing' ? 'bg-chart-4/10 text-chart-4 hover:bg-chart-4/20 border-transparent shadow-none' : 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-transparent shadow-none'}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function MetricCard({ title, value, change, trend, icon: Icon, color, subtitle }: any) {
  return (
    <motion.div variants={item} className="h-full">
      <Card className="border-border/40 bg-card/60 backdrop-blur-md hover:bg-card/80 transition-colors h-full flex flex-col group shadow-sm hover:shadow-md duration-300">
        <CardContent className="p-5 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground tracking-wide">{title}</p>
              <div className="p-2 rounded-md bg-secondary/60 group-hover:bg-background transition-colors text-muted-foreground" style={{ color: "var(--color-muted-foreground)" }}>
                 <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl xl:text-2xl 2xl:text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
          </div>
          <div className="flex flex-col gap-1 mt-4">
             <div className="flex items-center text-xs">
               <span className={change.startsWith('+') ? "text-chart-1 flex items-center font-medium bg-chart-1/10 px-1 py-0.5 rounded mr-2" : "text-destructive flex items-center font-medium bg-destructive/10 px-1 py-0.5 rounded mr-2"}>
                 {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                 {change}
               </span>
               <span className="text-muted-foreground">vs last month</span>
             </div>
             {subtitle && <span className="text-xs text-muted-foreground/80 mt-1">{subtitle}</span>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

