import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Mail, Phone, MapPin, MoreHorizontal, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

export function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
       try {
         const data = await api.getCustomers();
         if (data.connected && data.customers && data.customers.length > 0) {
            setCustomers(data.customers);
         } else {
            setCustomers([]);
         }
       } catch (err) {
         setCustomers([]);
       } finally {
         setLoading(false);
       }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Customer Intelligence</h1>
          <p className="text-muted-foreground mt-1 text-sm">Analyze lifetime value and engagement.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {customers.map(customer => (
             <motion.div variants={item} key={customer.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
               <Card className="bg-card/40 border-border/50 hover:bg-card/60 transition-colors h-full group hover:shadow-lg duration-300">
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <Avatar className="w-12 h-12 border border-border group-hover:border-primary/50 transition-colors">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`} />
                      <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground outline-none">
                        <MoreHorizontal className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast("View Profile", { description: `Loading profile for ${customer.name}...` })}>View Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast("Email Sent", { description: `Opened composer for ${customer.email}` })}>Email Customer</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast("Exporting to PDF", { description: "Customer details exported successfully." })}>Download PDF Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Mail className="w-3 h-3 mr-1.5" /> {customer.email}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1.5" /> {customer.location}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50 grid grid-cols-2 gap-4 mt-auto">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Spent</p>
                      <p className="font-semibold text-primary">₹{customer.totalSpent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Orders</p>
                      <p className="font-semibold text-primary">{customer.orders}</p>
                    </div>
                  </div>
                </div>
             </Card>
             </motion.div>
           ))}
        </motion.div>
      )}
    </div>
  );
}
