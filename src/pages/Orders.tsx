import React, { useState, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Search, Filter, Download, ArrowUpDown, MoreHorizontal, AlertTriangle, ShieldCheck, Tag, LoaderCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { api } from '../lib/api';

export function Orders() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isFulfilling, setIsFulfilling] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
       try {
         const data = await api.getOrders();
         if (data.connected && data.orders && data.orders.length > 0) {
            setOrders(data.orders);
         } else {
            setOrders([]);
         }
       } catch (err) {
         setOrders([]);
       } finally {
         setLoading(false);
       }
    };
    fetchOrders();
  }, []);

  const filteredOrders = React.useMemo(() => {
    if (!searchQuery) return orders;
    const lowerQuery = searchQuery.toLowerCase();
    return orders.filter(order => 
      order.id.toLowerCase().includes(lowerQuery) || 
      order.customer.toLowerCase().includes(lowerQuery) ||
      order.store.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, orders]);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredOrders.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // corresponds to h-16 (64px)
    overscan: 10,
  });

  const toggleAll = () => {
    if (selected.length === filteredOrders.length) {
      setSelected([]);
    } else {
      setSelected(filteredOrders.map(o => o.id));
    }
  };

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleBulkFulfill = () => {
    setIsFulfilling(true);
    setTimeout(() => {
      setIsFulfilling(false);
      toast("Bulk action successful", { description: `${selected.length} orders queued for local fulfillment and tracking emails fired.` });
      setSelected([]);
    }, 1200);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-6 sticky top-0 bg-background/80 backdrop-blur-xl z-20">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Fulfillment & Operations</h1>
          <p className="text-muted-foreground mt-1 text-sm">Process, review risk, and manage fulfillment logistics.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search PO, customer, or SKU" 
              className="pl-9 h-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 whitespace-nowrap bg-card/60" onClick={() => toast("Advanced Filtering", { description: "Filter module will open in a new drawer." })}>
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
          <Button variant="outline" size="sm" className="h-9 whitespace-nowrap bg-card/60" onClick={() => toast("Exporting orders...", { description: "Generating CSV file (142 rows)." })}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Operations Quick KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Fulfillment", val: "142", trend: "High Priority" },
          { label: "Delayed (>48h)", val: "12", trend: "Needs Attention" },
          { label: "High Risk Flags", val: "3", trend: "Manual Review" },
          { label: "Total Value (Queue)", val: "₹14.2k", trend: "Projected" },
        ].map((k, i) => (
          <div key={i} className="p-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm">
             <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{k.label}</p>
             <p className="text-2xl font-bold tracking-tight">{k.val}</p>
             <p className="text-xs text-muted-foreground mt-1">{k.trend}</p>
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-sm relative">
        {/* Bulk Actions Header - Pops up when items are selected */}
        <AnimatePresence>
          {selected.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 60, opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-0 left-0 right-0 bg-primary z-20 flex items-center justify-between px-6 px-lg-8 border-b border-border shadow-lg"
            >
               <div className="flex items-center gap-4 text-primary-foreground font-medium">
                  <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">{selected.length}</span>
                  Selected for processing
               </div>
               <div className="flex gap-2">
                 <Button size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 text-primary-foreground border-transparent shadow-none" onClick={() => setSelected([])}>Cancel</Button>
                 <Button size="sm" className="bg-white text-primary hover:bg-white/90" onClick={handleBulkFulfill} disabled={isFulfilling}>
                    {isFulfilling ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                    Batch Fulfill Labels
                 </Button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={parentRef} className="overflow-x-auto max-h-[600px] overflow-y-auto relative custom-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 bg-secondary/90 backdrop-blur-md z-10 transition-transform">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-[50px] pl-4">
                   <Checkbox checked={selected.length === orders.length && orders.length > 0} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead className="w-[120px] text-xs font-medium uppercase tracking-wider h-11">
                  <div className="flex items-center cursor-pointer hover:text-foreground">
                    Order ID <ArrowUpDown className="w-3 h-3 ml-1" />
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider h-11">Customer & Risk</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider h-11">Store</TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider h-11">
                   <div className="flex items-center justify-end cursor-pointer hover:text-foreground">
                    Total <ArrowUpDown className="w-3 h-3 ml-1" />
                  </div>
                </TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider h-11">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center text-muted-foreground border-none">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-10 h-10 mb-4 opacity-20" />
                      <p className="text-sm font-medium text-foreground">No orders found</p>
                      <p className="text-xs opacity-70 mt-1">Try adjusting your search criteria</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {rowVirtualizer.getVirtualItems().length > 0 && (
                    <TableRow style={{ height: `${rowVirtualizer.getVirtualItems()[0].start}px` }}>
                       <TableCell colSpan={7} className="p-0 border-0" />
                    </TableRow>
                  )}
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const order = filteredOrders[virtualRow.index];
                    return (
                      <TableRow key={order.id} data-index={virtualRow.index} ref={rowVirtualizer.measureElement} className={`border-border/20 group hover:bg-secondary/40 transition-colors h-16 ${selected.includes(order.id) ? 'bg-primary/5' : ''}`}>
                        <TableCell className="pl-4 relative">
                          <Checkbox checked={selected.includes(order.id)} onCheckedChange={() => toggle(order.id)} />
                          {/* VIP Ribbon indicator */}
                          {order.isVip && <div className="absolute left-0 top-0 bottom-0 w-1 bg-chart-1" title="VIP Customer" />}
                        </TableCell>
                        <TableCell className="font-mono text-sm tracking-tight font-medium group-hover:text-primary transition-colors cursor-pointer" onClick={() => toast("Order Context", { description: `Opened details panel for ${order.id}` })}>
                           {order.id}
                           <span className="block text-[10px] text-muted-foreground mt-0.5">{order.date}</span>
                        </TableCell>
                        <TableCell>
                           <div className="flex flex-col gap-1">
                              <span className="font-medium text-sm flex items-center gap-2">
                                 {order.customer}
                                 {order.isVip && <Tag className="w-3 h-3 text-chart-1" />}
                              </span>
                              {order.risk === 'Clean' ? (
                                 <span className="text-[10px] flex items-center text-chart-2 uppercase font-semibold"><ShieldCheck className="w-3 h-3 mr-1" /> Cleared</span>
                              ) : order.risk === 'Fraud Risk' ? (
                                 <span className="text-[10px] flex items-center text-destructive uppercase font-semibold bg-destructive/10 w-fit px-1 rounded-sm"><AlertTriangle className="w-3 h-3 mr-1" /> Fraud Analysis</span>
                              ) : (
                                 <span className="text-[10px] flex items-center text-amber-500 uppercase font-semibold bg-amber-500/10 w-fit px-1 rounded-sm"><AlertTriangle className="w-3 h-3 mr-1" /> Address Invalid</span>
                              )}
                           </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                           {order.store}
                           <span className="block text-xs mt-0.5">{order.items} Items</span>
                        </TableCell>
                        <TableCell className="text-right font-medium text-sm tabular-nums">₹{order.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={order.status === 'fulfilled' ? 'default' : order.status === 'processing' ? 'secondary' : 'destructive'} 
                                  className={order.status === 'fulfilled' ? 'bg-chart-1/10 text-chart-1 hover:bg-chart-1/20 border-transparent shadow-none' : order.status === 'processing' ? 'bg-chart-4/10 text-chart-4 hover:bg-chart-4/20 border-transparent shadow-none' : 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-transparent shadow-none'}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${order.status === 'fulfilled' ? 'bg-chart-1 animate-pulse' : 'bg-current'}`} />
                            <span className="capitalize">{order.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <DropdownMenu>
                              <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground opacity-30 group-hover:opacity-100 transition-opacity outline-none bg-transparent hover:bg-transparent cursor-pointer">
                                  <MoreHorizontal className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-card backdrop-blur-xl border-border/50">
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => toast("Opening Order Details", { description: `Loading details for order ${order.id}...` })}>View Details</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast("Exporting to PDF", { description: "Packing slip exported successfully." })}>Download Packing Slip</DropdownMenuItem>
                                {order.risk !== 'Clean' && <DropdownMenuItem onClick={() => toast("Initiating manual review", { description: "Flagging for security team." })}>Request Manual Review</DropdownMenuItem>}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => toast("Canceling Order", { description: `Cancellation requested for order ${order.id}.` })}>Cancel Order</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {rowVirtualizer.getVirtualItems().length > 0 && (
                    <TableRow style={{ height: `${rowVirtualizer.getTotalSize() - rowVirtualizer.getVirtualItems()[rowVirtualizer.getVirtualItems().length - 1].end}px` }}>
                       <TableCell colSpan={7} className="p-0 border-0" />
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t border-border/50 bg-secondary/10 flex items-center justify-between text-sm text-muted-foreground">
          <div>Showing {filteredOrders.length} orders</div>
          <div className="flex gap-2 text-xs">
            Virtualized list optimization active
          </div>
        </div>
      </motion.div>
    </div>
  );
}
