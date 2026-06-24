"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  ShieldAlert,
  ChevronRight,
  Menu,
  X,
  Zap,
  Award,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'OVERVIEW', href: '/', icon: <LayoutDashboard size={18} /> },
  { label: 'INVENTORY', href: '/inventory', icon: <Package size={18} /> },
  { label: 'ORDERS', href: '/orders', icon: <ShoppingCart size={18} /> },
  { label: 'TACTICAL DROPS', href: '/drops', icon: <Zap size={18} /> },
  { label: 'LOYALTY', href: '/loyalty', icon: <Award size={18} /> },
  { label: 'PROMOTIONS', href: '/promotions', icon: <Tag size={18} /> },
  { label: 'PERSONNEL', href: '/users', icon: <Users size={18} /> },
  { label: 'SETTINGS', href: '/settings', icon: <Settings size={18} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('kavon-admin-token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthLoading(false);
    }
  }, [router]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('kavon-admin-token');
    localStorage.removeItem('kavon-admin-user');
    router.push('/login');
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-brand-volt border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-brand-volt text-[10px] tracking-[0.5em] uppercase animate-pulse">AUTHORIZING_OPERATOR...</span>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-volt rounded-sm flex items-center justify-center text-black">
            <ShieldAlert size={20} />
          </div>
          <span className="font-black italic tracking-tighter text-xl text-white">KAVON<span className="text-brand-volt">_ADMIN</span></span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-brand-volt/40 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-brand-volt rounded-full animate-pulse" />
          System_Operational
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center justify-between p-4 transition-all group ${isActive ? 'bg-white/5 text-brand-volt border-l-2 border-brand-volt' : 'text-white/40 hover:text-white hover:bg-white/[0.02]'}`}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span className="font-mono text-[11px] uppercase tracking-widest">{item.label}</span>
              </div>
              {isActive && (
                <motion.div layoutId="nav-indicator">
                  <ChevronRight size={14} />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 text-white/20 hover:text-red-500 transition-colors font-mono text-[11px] uppercase tracking-widest"
        >
          <LogOut size={18} />
          Termination
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-white/5 flex-col fixed inset-y-0 z-50 bg-black">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-brand-volt" />
          <span className="font-black italic tracking-tighter text-sm">KAVON<span className="text-brand-volt">_ADMIN</span></span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-black border-r border-white/5 z-[70] lg:hidden flex flex-col shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen p-6 md:p-12 mt-16 lg:mt-0">
        {children}
      </main>
    </div>
  );
}
