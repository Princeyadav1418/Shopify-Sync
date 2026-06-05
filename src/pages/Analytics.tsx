import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, TrendingUp, Download, PieChart as PieChartIcon, Target, Users, Calendar, Filter, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '../lib/api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as any, stiffness: 500, damping: 30 } }
};

export function Analytics() {
  const [timeframe, setTimeframe] = useState('YTD');
  const [loading, setLoading] = useState(true);
  const [ltvData, setLtvData] = useState<any[]>([]);
  const [customerSegments, setCustomerSegments] = useState<any[]>([]);
  const [retentionData, setRetentionData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await api.getAnalytics();
        if (data.connected && data.analytics) {
          setLtvData(data.analytics.ltvData || []);
          setCustomerSegments(data.analytics.customerSegments || []);
          setRetentionData(data.analytics.retentionData || []);
        } else {
          setLtvData([]);
          setCustomerSegments([]);
          setRetentionData([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-6 sticky top-0 bg-background/80 backdrop-blur-xl z-20">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Business Intelligence</h1>
          <p className="text-muted-foreground mt-1 text-sm">Deep insights across all channels and operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="all">
             <SelectTrigger className="w-[160px] bg-card h-9">
               <SelectValue placeholder="Region" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">Global Network</SelectItem>
               <SelectItem value="na">North America</SelectItem>
               <SelectItem value="eu">Europe</SelectItem>
               <SelectItem value="apac">Asia Pacific</SelectItem>
             </SelectContent>
          </Select>
          <div className="hidden md:flex border border-border/50 rounded-md bg-card p-1">
             <button onClick={() => setTimeframe('30D')} className={`px-3 py-1 text-xs rounded-sm font-medium transition-colors ${timeframe === '30D' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>30D</button>
             <button onClick={() => setTimeframe('90D')} className={`px-3 py-1 text-xs rounded-sm font-medium transition-colors ${timeframe === '90D' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>90D</button>
             <button onClick={() => setTimeframe('YTD')} className={`px-3 py-1 text-xs rounded-sm font-medium transition-colors ${timeframe === 'YTD' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>YTD</button>
          </div>
          <Button variant="outline" className="h-9 border-border/50 bg-card/50 shadow-sm" onClick={() => toast("Exporting CSV...", { description: "Generating cross-channel analytics document." })}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
        </div>
      ) : (
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-6">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {/* KPI Cards */}
           {[
             { title: "Blended LTV", val: "₹310.50", sub: "+12% YoY", icon: Target, chartColor: 'var(--color-chart-1)' },
             { title: "Repeat Purchase Rate", val: "42.8%", sub: "+4% vs LM", icon: TrendingUp, chartColor: 'var(--color-chart-2)' },
             { title: "Avg. Acquisition Cost", val: "₹45.20", sub: "-8% vs LM", icon: Users, chartColor: 'var(--color-chart-3)' },
             { title: "Refund Rate", val: "1.2%", sub: "Stable", icon: PieChartIcon, chartColor: 'var(--color-chart-4)' },
           ].map((kpi, i) => (
             <motion.div key={i} variants={item}>
               <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-sm">
                 <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 mt-1">{kpi.title}</p>
                      <p className="text-2xl font-bold tracking-tight">{kpi.val}</p>
                      <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center opacity-80" style={{ backgroundColor: `${kpi.chartColor}20`, color: kpi.chartColor }}>
                       <kpi.icon className="w-6 h-6" />
                    </div>
                 </CardContent>
               </Card>
             </motion.div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LTV Forecasting */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="border-border/50 bg-card/40 backdrop-blur-sm h-[400px] flex flex-col shadow-sm">
              <CardHeader className="shrink-0 border-b border-border/50 bg-card/60 pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium tracking-tight">LTV Trajectory</CardTitle>
                  <CardDescription>Customer Lifetime Value accumulation by segment</CardDescription>
                </div>
                <Badge variant="outline" className="bg-background shadow-sm border-border">Predictive Model (AI)</Badge>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ltvData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.4} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12, fontWeight: 500 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12, fontWeight: 500 }} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontWeight: 500 }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="vip" name="VIP Customers" stroke="var(--color-chart-1)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="average" name="Average Cohort" stroke="var(--color-chart-2)" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="risk" name="High Risk" stroke="var(--color-chart-4)" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Customer Segments */}
          <motion.div variants={item}>
            <Card className="border-border/50 bg-card/40 backdrop-blur-sm h-[400px] flex flex-col shadow-sm">
              <CardHeader className="shrink-0 border-b border-border/50 bg-card/60 pb-4">
                <CardTitle className="text-lg font-medium tracking-tight">Revenue by Segment</CardTitle>
                <CardDescription>Value contribution per behavioral cluster</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center pt-6">
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerSegments}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {customerSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                        formatter={(value) => [`${value}%`, 'Contribution']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full mt-4 space-y-2">
                  {customerSegments.map((segment, idx) => (
                    <div key={idx} className="flex flex-row items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                        <span className="font-medium text-foreground">{segment.name}</span>
                      </div>
                      <span className="text-muted-foreground">{segment.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
        </div>
        
        {/* Retention Cohorts - Heatmap style data representation */}
        <motion.div variants={item}>
           <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm overflow-hidden">
              <CardHeader className="shrink-0 border-b border-border/50 bg-card/60 pb-4">
                <CardTitle className="text-lg font-medium tracking-tight">Retention Cohorts</CardTitle>
                <CardDescription>Monthly repurchase tracking by acquisition cohort</CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-medium">
                       <tr>
                          <th className="px-6 py-4">Cohort</th>
                          <th className="px-6 py-4">Month 1</th>
                          <th className="px-6 py-4">Month 2</th>
                          <th className="px-6 py-4">Month 3</th>
                          <th className="px-6 py-4">Month 4</th>
                          <th className="px-6 py-4">Month 5</th>
                          <th className="px-6 py-4">Month 6</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                       {retentionData.map((row, idx) => (
                         <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                            <td className="px-6 py-4 font-semibold text-foreground">{row.cohort} <span className="text-muted-foreground text-xs font-normal block">3,400 users</span></td>
                            <td className="px-6 py-4"><Badge className="bg-chart-1 text-chart-1-foreground shadow-none">{row.M1}%</Badge></td>
                            <td className="px-6 py-4"><Badge className="bg-chart-1/80 text-chart-1-foreground shadow-none">{row.M2}%</Badge></td>
                            <td className="px-6 py-4"><Badge className="bg-chart-1/60 text-chart-1-foreground shadow-none">{row.M3}%</Badge></td>
                            <td className="px-6 py-4">{row.M4 > 0 ? <Badge className="bg-chart-1/40 text-background shadow-none">{row.M4}%</Badge> : <span className="text-muted-foreground/30">-</span>}</td>
                            <td className="px-6 py-4">{row.M5 > 0 ? <Badge className="bg-chart-1/20 text-foreground shadow-none">{row.M5}%</Badge> : <span className="text-muted-foreground/30">-</span>}</td>
                            <td className="px-6 py-4">{row.M6 > 0 ? <Badge className="bg-chart-1/10 text-foreground shadow-none">{row.M6}%</Badge> : <span className="text-muted-foreground/30">-</span>}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </CardContent>
           </Card>
        </motion.div>
        
      </motion.div>
      )}
    </div>
  );
}
