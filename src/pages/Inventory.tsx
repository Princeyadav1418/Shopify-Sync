import React, { useState, useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'motion/react';
import { Box, AlertTriangle, ArrowRightLeft, TrendingDown, PackageX, Activity, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { api } from '../lib/api';

export function Inventory() {
  const fastParentRef = useRef<HTMLDivElement>(null);
  const deadParentRef = useRef<HTMLDivElement>(null);
  const [fastMoving, setFastMoving] = useState<any[]>([]);
  const [deadStock, setDeadStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
       try {
         const data = await api.getInventory();
         if (data.connected) {
            setFastMoving(data.fastMoving || []);
            setDeadStock(data.deadStock || []);
         } else {
            setFastMoving([]);
            setDeadStock([]);
         }
       } catch (err) {
         setFastMoving([]);
         setDeadStock([]);
       } finally {
         setLoading(false);
       }
    };
    fetchInventory();
  }, []);

  const fastVirtualizer = useVirtualizer({
    count: fastMoving.length,
    getScrollElement: () => fastParentRef.current,
    estimateSize: () => 52, // Approximate h-13
    overscan: 5,
  });

  const deadVirtualizer = useVirtualizer({
    count: deadStock.length,
    getScrollElement: () => deadParentRef.current,
    estimateSize: () => 52,
    overscan: 5,
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-6 sticky top-0 bg-background/80 backdrop-blur-xl z-20">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Inventory Optimization</h1>
          <p className="text-muted-foreground mt-1 text-sm">Forecasting, dead stock detection, and capital allocation.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-border/50 bg-card/50" onClick={() => toast("Running forecast model...", { description: "Applying predictive algorithms to stock levels." })}>
             <Activity className="w-4 h-4 mr-2" /> Run Forecast
          </Button>
          <Button className="shadow-lg shadow-primary/20 bg-foreground text-background" onClick={() => toast("Exporting PO...", { description: "Generating Purchase Orders for low stock items." })}>Generate POs</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/40 border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Box className="w-4 h-4 mr-2" /> Capital Tied Up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">₹520,450</div>
            <p className="text-xs text-chart-1 mt-1 font-medium bg-chart-1/10 w-fit px-1 py-0.5 rounded">+2.4% vs LM</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/40 border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <PackageX className="w-4 h-4 mr-2 text-destructive" /> Dead Stock Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums">₹45,200</div>
            <p className="text-xs text-muted-foreground mt-1 text-destructive font-medium bg-destructive/10 w-fit px-1 py-0.5 rounded">8.6% of Total Inventory</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-chart-4" /> Stockout Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-chart-4">High</div>
            <p className="text-xs text-muted-foreground mt-1">42 SKUs dropping below par</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <ArrowRightLeft className="w-4 h-4 mr-2" /> Reorder Value Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums">₹124,000</div>
            <p className="text-xs text-muted-foreground mt-1">To reach 30-day safety stock</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="bg-card/40 border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 bg-card/60">
               <CardTitle className="text-lg">Velocity: Fast Moving</CardTitle>
               <CardDescription>High demand items nearing stockout thresholds</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <div ref={fastParentRef} className="overflow-auto max-h-[400px] relative custom-scrollbar">
               <Table>
                 <TableHeader className="sticky top-0 bg-secondary/90 backdrop-blur-md z-10 transition-transform">
                   <TableRow>
                     <TableHead className="text-xs uppercase">Product</TableHead>
                     <TableHead className="text-xs uppercase">Velocity</TableHead>
                     <TableHead className="text-xs uppercase text-right">Runway</TableHead>
                     <TableHead className="text-xs uppercase text-right">Action</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {fastVirtualizer.getVirtualItems().length > 0 && (
                     <TableRow style={{ height: `${fastVirtualizer.getVirtualItems()[0].start}px` }}>
                       <TableCell colSpan={4} className="p-0 border-0" />
                     </TableRow>
                   )}
                   {fastVirtualizer.getVirtualItems().map((virtualRow) => {
                     const item = fastMoving[virtualRow.index];
                     return (
                       <TableRow key={item.id} data-index={virtualRow.index} ref={fastVirtualizer.measureElement} className="h-13">
                         <TableCell className="font-medium text-sm">
                           {item.name}
                           <span className="block text-xs text-muted-foreground font-mono">{item.id}</span>
                         </TableCell>
                         <TableCell className="text-sm">{item.velocity}</TableCell>
                         <TableCell className="text-right">
                           <span className={`font-mono text-sm ${item.daysLeft < 10 ? 'text-destructive font-bold' : ''}`}>{item.daysLeft} days</span>
                         </TableCell>
                         <TableCell className="text-right">
                           <Badge variant="outline" className={item.status === 'Urgent' ? 'bg-destructive/10 text-destructive border-transparent' : item.status === 'Reorder' ? 'bg-chart-4/10 text-chart-4 border-transparent' : 'bg-chart-1/10 text-chart-1 border-transparent'}>
                             {item.status}
                           </Badge>
                         </TableCell>
                       </TableRow>
                     );
                   })}
                   {fastVirtualizer.getVirtualItems().length > 0 && (
                     <TableRow style={{ height: `${fastVirtualizer.getTotalSize() - fastVirtualizer.getVirtualItems()[fastVirtualizer.getVirtualItems().length - 1].end}px` }}>
                       <TableCell colSpan={4} className="p-0 border-0" />
                     </TableRow>
                   )}
                 </TableBody>
               </Table>
               </div>
            </CardContent>
         </Card>

         <Card className="bg-card/40 border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50 bg-card/60 flex flex-row items-center justify-between">
               <div>
                 <CardTitle className="text-lg">Capital Drain: Dead Stock</CardTitle>
                 <CardDescription>Items with zero movement for &gt;90 days</CardDescription>
               </div>
               <Button variant="outline" size="sm" className="h-8 shadow-sm">Automate Markdown</Button>
            </CardHeader>
            <CardContent className="p-0">
               <div ref={deadParentRef} className="overflow-auto max-h-[400px] relative custom-scrollbar">
               <Table>
                 <TableHeader className="sticky top-0 bg-secondary/90 backdrop-blur-md z-10 transition-transform">
                   <TableRow>
                     <TableHead className="text-xs uppercase">Product</TableHead>
                     <TableHead className="text-xs uppercase">Stagnant</TableHead>
                     <TableHead className="text-xs uppercase text-right">Trapped Cap</TableHead>
                     <TableHead className="text-xs uppercase text-right">Risk</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {deadVirtualizer.getVirtualItems().length > 0 && (
                     <TableRow style={{ height: `${deadVirtualizer.getVirtualItems()[0].start}px` }}>
                       <TableCell colSpan={4} className="p-0 border-0" />
                     </TableRow>
                   )}
                   {deadVirtualizer.getVirtualItems().map((virtualRow) => {
                     const item = deadStock[virtualRow.index];
                     return (
                       <TableRow key={item.id} data-index={virtualRow.index} ref={deadVirtualizer.measureElement} className="h-13">
                         <TableCell className="font-medium text-sm">
                           {item.name}
                           <span className="block text-xs text-muted-foreground font-mono">{item.id}</span>
                         </TableCell>
                         <TableCell className="text-sm font-mono">{item.days} days</TableCell>
                         <TableCell className="text-right font-medium text-sm text-destructive">
                           ₹{item.value.toLocaleString()}
                         </TableCell>
                         <TableCell className="text-right">
                           <Badge variant="outline" className={item.status === 'Critical' ? 'bg-destructive/20 text-destructive border-transparent' : 'bg-chart-4/10 text-chart-4 border-transparent'}>
                             {item.status}
                           </Badge>
                         </TableCell>
                       </TableRow>
                     );
                   })}
                   {deadVirtualizer.getVirtualItems().length > 0 && (
                     <TableRow style={{ height: `${deadVirtualizer.getTotalSize() - deadVirtualizer.getVirtualItems()[deadVirtualizer.getVirtualItems().length - 1].end}px` }}>
                       <TableCell colSpan={4} className="p-0 border-0" />
                     </TableRow>
                   )}
                 </TableBody>
               </Table>
               </div>
            </CardContent>
         </Card>
      </div>

    </div>
  );
}

