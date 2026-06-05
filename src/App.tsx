import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { useAuth } from './store/auth';
import { useTheme } from './store/theme';
import { Toaster } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

// Lazy loading route components for performance (Code Splitting)
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Stores = lazy(() => import('./pages/Stores').then(m => ({ default: m.Stores })));
const Orders = lazy(() => import('./pages/Orders').then(m => ({ default: m.Orders })));
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })));
const Inventory = lazy(() => import('./pages/Inventory').then(m => ({ default: m.Inventory })));
const Customers = lazy(() => import('./pages/Customers').then(m => ({ default: m.Customers })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));

function LoadingFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function PageLoadingFallback() {
  return (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { checkSession } = useAuth();
  if (!checkSession()) return <Navigate to="/login" replace />;
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

export default function App() {
  const { checkSession } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    // Ensure the theme is set on initial load
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Execute session check immediately
  const hasValidSession = checkSession();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={hasValidSession ? <Navigate to="/" replace /> : <Login />} />
            
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Suspense fallback={<PageLoadingFallback />}><Dashboard /></Suspense>} />
              <Route path="stores" element={<Suspense fallback={<PageLoadingFallback />}><Stores /></Suspense>} />
              <Route path="orders" element={<Suspense fallback={<PageLoadingFallback />}><Orders /></Suspense>} />
              <Route path="products" element={<Suspense fallback={<PageLoadingFallback />}><Products /></Suspense>} />
              <Route path="inventory" element={<Suspense fallback={<PageLoadingFallback />}><Inventory /></Suspense>} />
              <Route path="customers" element={<Suspense fallback={<PageLoadingFallback />}><Customers /></Suspense>} />
              <Route path="analytics" element={<Suspense fallback={<PageLoadingFallback />}><Analytics /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<PageLoadingFallback />}><Settings /></Suspense>} />
            </Route>
          </Routes>
        </Suspense>
        <Toaster position="top-right" theme={theme} className="font-sans" />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

