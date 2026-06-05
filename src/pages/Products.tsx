import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Package, Search, Filter, Plus, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { api } from '../lib/api';

export function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', inventory: '', category: '' });

  useEffect(() => {
    const fetchProducts = async () => {
       try {
         const data = await api.getProducts();
         if (data.connected && data.products && data.products.length > 0) {
            setProducts(data.products);
         } else {
            setProducts([]);
         }
       } catch (err) {
         setProducts([]);
       } finally {
         setLoading(false);
       }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateProduct = () => {
    if (!formData.name || !formData.sku || !formData.price || !formData.category) {
      toast.error('Validation Error', { description: 'Please fill in all required fields.' });
      return;
    }

    const priceNum = parseFloat(formData.price) || 0;
    const inventoryNum = parseInt(formData.inventory) || 0;

    const newProduct = {
      id: Math.random().toString(36).substr(2, 9),
      sku: formData.sku,
      name: formData.name,
      price: priceNum,
      inventory: inventoryNum,
      status: inventoryNum > 0 ? 'Active' : 'Out of Stock',
      category: formData.category,
    };

    setProducts(prev => [newProduct, ...prev]);
    setIsSheetOpen(false);
    setFormData({ name: '', sku: '', price: '', inventory: '', category: '' });
    toast.success("Product Created", { description: `${newProduct.name} has been added to the catalog.` });
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage catalogs across all connected storefronts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9" onClick={() => toast("Exporting Products...", { description: "Generating catalog data export." })}>Export</Button>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger render={
              <Button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow shadow-primary/20 hover:bg-primary/90 h-9 px-4 py-2">
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </Button>
            } />
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="text-xl">Add New Product</SheetTitle>
                <SheetDescription>
                  Enter the details of the new product to add to your catalog.
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input 
                    id="product-name" 
                    placeholder="e.g. Wireless Headphones" 
                    className="bg-secondary/40"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input 
                    id="sku" 
                    placeholder="e.g. PRD-123" 
                    className="bg-secondary/40 font-mono text-sm"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                      <Input 
                        id="price" 
                        type="number" 
                        placeholder="0.00" 
                        className="pl-6 bg-secondary/40 text-sm"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inventory">Initial Inventory</Label>
                    <Input 
                      id="inventory" 
                      type="number" 
                      placeholder="0" 
                      className="bg-secondary/40"
                      value={formData.inventory}
                      onChange={(e) => handleInputChange('inventory', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="bg-secondary/40">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-6">
                  <Button className="w-full h-11" onClick={handleCreateProduct}>
                    Create Product
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full max-w-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products by name, SKU, or category..." className="pl-9 h-10 bg-card/50" />
        </div>
        <Button variant="outline" size="sm" className="h-10 whitespace-nowrap bg-card/50" onClick={() => toast("Filters", { description: "Advanced product filtering coming soon." })}>
          <Filter className="w-4 h-4 mr-2" /> More Filters
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 30 }} className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-sm relative max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 bg-secondary/90 backdrop-blur-md z-10">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-[100px] text-xs font-medium uppercase tracking-wider h-11">Image</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider h-11">Details</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider h-11">SKU</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider h-11">Category</TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider h-11">Inventory</TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider h-11">Price</TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider h-11">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-border/20 hover:bg-secondary/40 transition-colors cursor-pointer h-16" onClick={() => toast("Product Details", { description: `Viewing details for ${product.name}` })}>
                  <TableCell>
                    <div className="w-12 h-12 bg-secondary/80 rounded-md flex items-center justify-center border border-border/50">
                      <Package className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-transparent text-xs font-normal border-border/50 text-muted-foreground">
                      <Tag className="w-3 h-3 mr-1" /> {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={product.inventory === 0 ? "text-destructive font-medium" : product.inventory < 20 ? "text-chart-4 font-medium" : ""}>
                      {product.inventory}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">₹{product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={product.status === 'Active' ? 'default' : product.status === 'Out of Stock' ? 'destructive' : 'secondary'} 
                           className={product.status === 'Active' ? 'bg-chart-1/10 text-chart-1 hover:bg-chart-1/20 border-transparent shadow-none' : product.status === 'Out of Stock' ? 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-transparent shadow-none' : 'bg-chart-4/10 text-chart-4 hover:bg-chart-4/20 border-transparent shadow-none'}>
                      {product.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </div>
  );
}
