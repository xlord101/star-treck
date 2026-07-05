'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Ship, 
  Plane, 
  Truck, 
  Train, 
  ChevronDown, 
  Plus, 
  Calendar,
  Check
} from 'lucide-react';

const transportIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  SEA: Ship,
  AIR: Plane,
  ROAD: Truck,
  RAIL: Train,
};

const statuses = [
  'Draft', 
  'Untracked', 
  'New', 
  'In Progress', 
  'Booked', 
  'Loaded', 
  'Sailing', 
  'Arrived', 
  'Discharged', 
  'Delivered'
];

export default function ShipmentsPage() {
  const { shipments, updateShipmentStatus, setCreateShipmentOpen, globalSearchQuery } = useStore();
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [filterMode, setFilterMode] = useState<string>('ALL');

  // Filter shipments based on search query and transport filter
  const filteredShipments = shipments.filter(s => {
    // 1. Search Query filter
    const matchesSearch = 
      s.shipment_name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      s.shipment_number.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      s.status.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      s.mode_of_transport.toLowerCase().includes(globalSearchQuery.toLowerCase());

    // 2. Transport Mode filter
    const matchesTransport = filterMode === 'ALL' || s.mode_of_transport === filterMode;

    return matchesSearch && matchesTransport;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Shipments</h1>
          <p className="text-sm text-slate-500">Manage, track, and update export shipments.</p>
        </div>

        {/* Buttons & Filters */}
        <div className="flex items-center space-x-3">
          {/* Transport Mode filter */}
          <div className="relative inline-flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
            {['ALL', 'SEA', 'AIR', 'ROAD', 'RAIL'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                  filterMode === mode
                    ? 'bg-slate-100 text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCreateShipmentOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Create Shipment</span>
          </button>
        </div>
      </div>

      {/* Shipment Grid */}
      {filteredShipments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-xs">
          <div className="h-12 w-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Ship className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-700">No shipments found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            {globalSearchQuery 
              ? `No shipments match your search "${globalSearchQuery}".`
              : "Start by creating your first export shipment with our AI assistant."}
          </p>
          {!globalSearchQuery && (
            <button
              onClick={() => setCreateShipmentOpen(true)}
              className="mt-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-sm px-4 py-2 rounded-lg transition-colors border border-blue-100"
            >
              Initiate Shipment
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShipments.map((shipment) => {
            const TransportIcon = transportIcons[shipment.mode_of_transport] || Ship;
            const isDropdownOpen = activeDropdown === shipment.id;

            return (
              <div 
                key={shipment.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Upper Body */}
                <div className="p-6 space-y-4">
                  {/* Title & transport Icon */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                          {shipment.shipment_number}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                          {shipment.type_of_shipment}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-800 text-base leading-tight group-hover:text-blue-600 transition-colors">
                        {shipment.shipment_name}
                      </h3>
                    </div>
                    <div className="p-2.5 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <TransportIcon className="h-5 w-5 shrink-0" />
                    </div>
                  </div>

                  {/* Shipment Info fields */}
                  <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-50">
                    <div className="space-y-0.5">
                      <p className="text-slate-400 font-medium">Transport Mode</p>
                      <p className="font-semibold text-slate-700">{shipment.mode_of_transport}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-slate-400 font-medium">Created Date</p>
                      <p className="font-semibold text-slate-700 flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{new Date(shipment.created_at).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lower Status Bar & actions */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between relative">
                  {/* Status update selector */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(isDropdownOpen ? null : shipment.id);
                      }}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
                    >
                      <span className={`h-2 w-2 rounded-full ${
                        ['Delivered', 'Arrived'].includes(shipment.status) ? 'bg-emerald-500' :
                        ['Sailing', 'Loaded'].includes(shipment.status) ? 'bg-amber-500' :
                        ['Booked', 'New', 'In Progress'].includes(shipment.status) ? 'bg-blue-500' :
                        'bg-slate-400'
                      }`} />
                      <span>{shipment.status}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>

                    {/* Status checklist dropdown menu */}
                    {isDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setActiveDropdown(null)} 
                        />
                        <div className="absolute left-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 max-h-60 overflow-y-auto">
                          <div className="px-3 py-1 border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Update Status
                          </div>
                          {statuses.map((status) => (
                            <button
                              key={status}
                              onClick={() => {
                                updateShipmentStatus(shipment.id, status);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left flex items-center justify-between"
                            >
                              <span>{status}</span>
                              {shipment.status === status && (
                                <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => alert(`Viewing shipment: ${shipment.shipment_name}`)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={() => alert(`Editing shipment: ${shipment.shipment_name}`)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
