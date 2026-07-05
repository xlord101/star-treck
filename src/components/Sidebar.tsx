'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { 
  LayoutDashboard, 
  FileText, 
  Ship, 
  MapPin, 
  Package2, 
  Boxes, 
  Users, 
  Archive, 
  DollarSign, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Export Docs', href: '/export-docs', icon: FileText },
  { name: 'Shipments', href: '/shipments', icon: Ship },
  { name: 'Tracking', href: '/tracking', icon: MapPin },
  { name: 'Products', href: '/products', icon: Package2 },
  { name: 'Packages', href: '/packages', icon: Boxes },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Inventory', href: '/inventory', icon: Archive },
  { name: 'Accounting', href: '/accounting', icon: DollarSign },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isMobileSidebarOpen, setMobileSidebarOpen } = useStore();

  const handleLinkClick = () => {
    setMobileSidebarOpen(false);
  };

  const renderContent = () => (
    <>
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
            KD
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm tracking-wide">KD Export</h2>
            <p className="text-xs text-slate-400">1 member</p>
          </div>
        </div>
        
        {/* Close Button on Mobile */}
        <button 
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleLinkClick}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600/90 text-white shadow-md shadow-blue-900/30' 
                  : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
              }`}
            >
              <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <Link
          href="/settings"
          onClick={handleLinkClick}
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            pathname.startsWith('/settings')
              ? 'bg-blue-600/90 text-white shadow-md'
              : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
          }`}
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span>Settings</span>
        </Link>
        <button
          onClick={() => alert('Signing out...')}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-red-950/20 hover:text-red-400 text-slate-400 transition-all duration-200 text-left cursor-pointer"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible on desktop) */}
      <aside className="hidden md:flex w-64 bg-[#0B192C] text-slate-300 flex-col h-screen sticky top-0 shrink-0 no-print select-none">
        {renderContent()}
      </aside>

      {/* Mobile Drawer (visible on mobile, hidden on desktop) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden no-print">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Drawer menu */}
          <aside className="relative flex flex-col w-64 h-full bg-[#0B192C] text-slate-300 shadow-2xl z-10 animate-slide-in-left">
            {renderContent()}
          </aside>
        </div>
      )}
    </>
  );
}
