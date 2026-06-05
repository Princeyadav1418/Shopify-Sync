import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Box,
  CreditCard,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Users,
  Bell,
  Search,
  Menu,
  ChevronDown,
  Activity,
  Globe,
  MoreHorizontal,
  AlertCircle
} from 'lucide-react';

export const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Stores', href: '/stores', icon: Store },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Inventory', href: '/inventory', icon: Box },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
];
