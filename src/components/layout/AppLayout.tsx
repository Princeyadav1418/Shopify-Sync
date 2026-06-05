import React, { useState } from 'react';
import { useNavigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu, Bell, Search, Globe, ChevronDown, User, LogOut, Code, AppWindow, MoreHorizontal
} from 'lucide-react';
import { navigation, secondaryNavigation } from '../../data';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '../../store/auth';
import { toast } from 'sonner';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex text-foreground selection:bg-primary/30">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="hidden md:flex flex-col border-r bg-card/50 backdrop-blur-xl z-20 h-screen sticky top-0"
      >
        <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shrink-0">
            <AppWindow className="text-primary-foreground w-5 h-5" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 font-semibold tracking-tight text-lg"
              >
                Command<span className="text-muted-foreground">Center</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-6 hide-scrollbar">
          <div className="space-y-1">
            <div className={cn("px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider", !sidebarOpen && "text-center")}>
              {sidebarOpen ? 'Main Menu' : 'Menu'}
            </div>
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all group overflow-hidden mb-1",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
                title={!sidebarOpen ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
          </div>

          <div className="mt-auto space-y-1">
             {secondaryNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all group overflow-hidden",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
                title={!sidebarOpen ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-border/50">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full justify-start px-2 hover:bg-secondary/50 h-auto py-2 flex items-center rounded-md text-foreground transition-colors outline-none cursor-pointer">
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <div className="flex flex-col items-start text-sm ml-3 overflow-hidden">
                    <span className="font-medium truncate max-w-[120px]">Admin Executive</span>
                    <span className="text-xs text-muted-foreground truncate w-full">admin@company.com</span>
                  </div>
                )}
                {sidebarOpen && <MoreHorizontal className="w-4 h-4 ml-auto text-muted-foreground" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 z-10 shrink-0">
          <div className="flex items-center flex-1 gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:flex">
              <Menu className="w-5 h-5 text-muted-foreground" />
            </Button>
            
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
                <Menu className="w-5 h-5 text-muted-foreground" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] p-0 bg-card/50 backdrop-blur-xl border-r">
                <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
                  <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shrink-0">
                    <AppWindow className="text-primary-foreground w-5 h-5" />
                  </div>
                  <span className="ml-3 font-semibold tracking-tight text-lg">
                    Command<span className="text-muted-foreground">Center</span>
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-6 hide-scrollbar h-[calc(100vh-130px)]">
                  <div className="space-y-1">
                    <div className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Main Menu
                    </div>
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) => cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-all group overflow-hidden mb-1",
                          isActive 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        <span className="whitespace-nowrap">{item.name}</span>
                      </NavLink>
                    ))}
                  </div>
                  <div className="mt-auto space-y-1">
                     {secondaryNavigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) => cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-all group overflow-hidden",
                          isActive 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        <span className="whitespace-nowrap">{item.name}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="max-w-md w-full relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search orders, customers, or stores (Cmd+K)" 
                className="pl-9 bg-secondary/30 border-transparent focus-visible:ring-primary/20 h-9" 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    toast("Search Initiated", { description: `Searching for: ${(e.target as HTMLInputElement).value}` });
                  }
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
             <DropdownMenu>
              <DropdownMenuTrigger className="hidden lg:flex items-center justify-center gap-2 h-9 px-3 rounded-md border border-border/50 bg-background text-sm text-muted-foreground font-normal hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer">
                  <Globe className="w-4 h-4" />
                  <span>All Stores</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast("Switched Store", { description: "You are now viewing 'Global Flagship'." })}>Global Flagship</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast("Switched Store", { description: "You are now viewing 'EU Operations'." })}>EU Operations</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast("Switched Store", { description: "You are now viewing 'APAC Outlet'." })}>APAC Outlet</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground" onClick={() => toast("Notifications Check", { description: "You have 3 unread alerts." })}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-background"></span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-card/10 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
