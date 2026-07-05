'use client';

import { Search, Grid, Bell, Plus, Menu } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function Topbar() {
  const { globalSearchQuery, setGlobalSearchQuery, setCreateShipmentOpen, setMobileSidebarOpen } = useStore();

  return (
    <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-6 sticky top-0 z-30 shadow-xs">
      {/* Mobile Menu Hamburger */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="md:hidden p-2 mr-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        title="Open Navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-2xl mr-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            placeholder="Search by name, type, reference, tracking ID, or container number..."
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Right Side Icons & Actions */}
      <div className="flex items-center space-x-4">
        {/* App Menu Grid */}
        <button 
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          title="App Menu"
        >
          <Grid className="h-5 w-5" />
        </button>

        {/* Notification Bell */}
        <button 
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors relative"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white" />
        </button>

        {/* Vertical divider */}
        <div className="w-px h-6 bg-slate-200" />

        {/* Create Shipment Button */}
        <button
          onClick={() => setCreateShipmentOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Create Shipment</span>
        </button>
      </div>
    </header>
  );
}
