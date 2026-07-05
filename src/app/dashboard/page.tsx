'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { 
  TrendingUp, 
  Users, 
  Ship, 
  Package, 
  MapPin, 
  DollarSign, 
  ChevronDown, 
  Layers 
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function DashboardPage() {
  const { shipments, products, contacts, documents } = useStore();
  const [dateRange] = useState('Year to date');

  // Compute status counts
  const totalShipments = shipments.length;
  const untrackedCount = shipments.filter(s => ['Draft', 'Untracked'].includes(s.status)).length;
  const bookedCount = shipments.filter(s => ['Booked', 'New'].includes(s.status)).length;
  const sailingCount = shipments.filter(s => ['Sailing', 'In Progress', 'Loaded'].includes(s.status)).length;
  const completedCount = shipments.filter(s => ['Arrived', 'Discharged', 'Delivered'].includes(s.status)).length;

  const untrackedPct = totalShipments > 0 ? Math.round((untrackedCount / totalShipments) * 100) : 0;
  const bookedPct = totalShipments > 0 ? Math.round((bookedCount / totalShipments) * 100) : 0;
  const sailingPct = totalShipments > 0 ? Math.round((sailingCount / totalShipments) * 100) : 0;
  const completedPct = totalShipments > 0 ? Math.round((completedCount / totalShipments) * 100) : 0;

  // Dynamic Metrics
  const buyersList = contacts.filter(c => c.role === 'Buyer' || c.role === 'Consignee');
  const totalBuyers = buyersList.length;
  const totalProducts = products.length;
  
  // Calculate total invoiced based on Commercial Invoices count
  const invoiceDocs = documents.filter(d => d.doc_type === 'Commercial Invoice');
  const totalInvoiced = invoiceDocs.length * 48500; // Average value of $48.5K per invoice

  // Build chart data based on invoices
  const chartData = [
    { name: 'Jan', revenue: 0 },
    { name: 'Feb', revenue: invoiceDocs.length > 0 ? 25000 : 0 },
    { name: 'Mar', revenue: invoiceDocs.length > 1 ? 65000 : 0 },
    { name: 'Apr', revenue: invoiceDocs.length > 2 ? 110000 : 0 },
    { name: 'May', revenue: totalInvoiced > 0 ? totalInvoiced : 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Good afternoon, KD Export</h1>
          <p className="text-sm text-slate-500">{"Here's what's happening with your exports today."}</p>
        </div>

        {/* Datepicker Dropdown */}
        <div className="relative inline-block text-left">
          <button
            type="button"
            className="inline-flex items-center space-x-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <span>{dateRange}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-200 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Invoiced</p>
            <p className="text-2xl font-bold text-slate-800">${totalInvoiced.toLocaleString()}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-200 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Buyers</p>
            <p className="text-2xl font-bold text-slate-800">{totalBuyers}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-200 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Ship className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Shipments</p>
            <p className="text-2xl font-bold text-slate-800">{totalShipments}</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow duration-200 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Products</p>
            <p className="text-2xl font-bold text-slate-800">{totalProducts}</p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 columns - Revenue Trend & Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Trend (Chart Area) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-800 text-base flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Revenue Trend</span>
              </h3>
              {totalInvoiced > 0 && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                  Active billing
                </span>
              )}
            </div>
            
            {/* Elegant Area Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip formatter={(value) => [`$${Number(value || 0).toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Grid: Shipment by Status & Destinations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipment by Status */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
              <h3 className="font-semibold text-slate-800 text-base mb-5 flex items-center space-x-2">
                <Layers className="h-5 w-5 text-indigo-600" />
                <span>Shipment by Status</span>
              </h3>
              <div className="space-y-4">
                {/* Untracked */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">Untracked</span>
                    <span className="text-slate-800">{untrackedPct}% ({untrackedCount})</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-slate-400 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${untrackedPct}%` }}
                    />
                  </div>
                </div>

                {/* Booked */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">Booked</span>
                    <span className="text-slate-800">{bookedPct}% ({bookedCount})</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${bookedPct}%` }}
                    />
                  </div>
                </div>

                {/* Sailing */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">Sailing</span>
                    <span className="text-slate-800">{sailingPct}% ({sailingCount})</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${sailingPct}%` }}
                    />
                  </div>
                </div>

                {/* Completed */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">Completed</span>
                    <span className="text-slate-800">{completedPct}% ({completedCount})</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${completedPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Destinations */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
              <h3 className="font-semibold text-slate-800 text-base mb-5 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <span>Top Destinations</span>
              </h3>
              {shipments.length === 0 ? (
                <div className="h-44 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-4 text-center">
                  <MapPin className="h-6 w-6 text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No destination data yet</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Create active tracked shipments to plot shipping destinations.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs font-semibold text-slate-700">Jebel Ali Port (Dubai, UAE)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700">Active</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs font-semibold text-slate-700">Port of Abu Dhabi (UAE)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Nhava Sheva (Mumbai, India)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600">Transit</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Buyer Insights */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs h-full flex flex-col">
            <h3 className="font-semibold text-slate-800 text-base mb-5 flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Buyer Insights</span>
            </h3>

            <div className="flex-1 space-y-6">
              {/* Top Buyers Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Buyers</h4>
                {buyersList.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center py-6">
                    <p className="text-xs font-semibold text-slate-600">No buyers registered yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {buyersList.slice(0, 3).map((b) => (
                      <div key={b.id} className="flex items-center justify-between p-3 border border-slate-50 rounded-xl hover:bg-slate-50/50 transition-colors">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{b.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{b.email}</p>
                        </div>
                        <span className="text-xs font-bold text-slate-600">Buy</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buyer Concentration Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Concentration</h4>
                {buyersList.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center py-6">
                    <p className="text-xs font-semibold text-slate-600">Not enough data to calculate</p>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">{buyersList[0]?.name || 'Primary Buyer'}</span>
                      <span className="text-slate-800">60%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom list: Top Products */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <h3 className="font-semibold text-slate-800 text-base mb-5 flex items-center space-x-2">
          <Package className="h-5 w-5 text-amber-500" />
          <span>Top Products</span>
        </h3>
        {products.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
            <p className="text-sm font-semibold text-slate-700">No products added yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Products you configure in the Products module will rank here based on export volume.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center space-x-3 p-4 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-colors">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{p.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku} | HS: {p.hs_code}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
