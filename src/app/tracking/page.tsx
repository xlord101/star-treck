'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { MapPin, X, Plus, Ship, Mail, ArrowRight } from 'lucide-react';

interface TrackedItem {
  id: number;
  trackingName: string;
  shipmentType: string;
  notifier: string;
  status: string;
  origin: string;
  destination: string;
  eta: string;
}

export default function TrackingPage() {
  const { isTrackShipmentOpen, setTrackShipmentOpen } = useStore();
  const [shipmentType, setShipmentType] = useState('Ocean Shipment');
  const [trackingName, setTrackingName] = useState('');
  const [notifier, setNotifier] = useState('');
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);

  const handleStartTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingName.trim()) return;

    setTrackedItems([
      ...trackedItems,
      {
        id: Date.now(),
        trackingName,
        shipmentType,
        notifier,
        status: 'In Transit',
        origin: 'Port of Nhava Sheva (IN)',
        destination: 'Port of Jebel Ali (AE)',
        eta: '2026-07-22'
      }
    ]);

    // Reset
    setTrackingName('');
    setNotifier('');
    setTrackShipmentOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cargo Tracking</h1>
          <p className="text-sm text-slate-500">Track containers and ocean shipments in real time.</p>
        </div>
        <button
          onClick={() => setTrackShipmentOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Track Shipment</span>
        </button>
      </div>

      {trackedItems.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center max-w-2xl mx-auto shadow-xs mt-8">
          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <MapPin className="h-6 w-6 animate-pulse" />
          </div>
          <h3 className="text-base font-semibold text-slate-700">No tracking data found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Start tracking your first shipment by entering your booking reference, container number, or bill of lading.
          </p>
          <button
            onClick={() => setTrackShipmentOpen(true)}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-all shadow-xs"
          >
            Start Tracking
          </button>
        </div>
      ) : (
        /* Tracked List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trackedItems.map((item) => (
            <div key={item.id} className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md uppercase">
                      {item.shipmentType}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">ID: {item.id.toString().slice(-6)}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">{item.trackingName}</h3>
                </div>
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md font-bold">
                  {item.status}
                </span>
              </div>

              <div className="border-t border-b border-slate-50 py-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-medium">Origin</span>
                  <span className="font-semibold text-slate-700">{item.origin}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-medium">Destination</span>
                  <span className="font-semibold text-slate-700">{item.destination}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-medium">Estimated Arrival</span>
                  <span className="font-semibold text-slate-700">{item.eta}</span>
                </div>
                {item.notifier && (
                  <div className="flex items-center justify-between text-slate-500 pt-1.5 border-t border-slate-50">
                    <span className="font-medium">Notifier Contact</span>
                    <span className="font-semibold text-slate-600 flex items-center space-x-1">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{item.notifier}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Flow visualization */}
              <div className="flex items-center justify-between relative pt-2">
                <div className="flex flex-col items-center z-10">
                  <span className="h-5 w-5 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center ring-1 ring-blue-500" />
                  <span className="text-[10px] font-semibold text-slate-600 mt-1">Origin</span>
                </div>
                <div className="flex-1 h-0.5 bg-blue-200 mx-2 relative top-[-10px]" />
                <div className="flex flex-col items-center z-10">
                  <span className="h-5 w-5 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center ring-1 ring-blue-500 animate-pulse" />
                  <span className="text-[10px] font-semibold text-slate-600 mt-1">Transit</span>
                </div>
                <div className="flex-1 h-0.5 bg-slate-100 mx-2 relative top-[-10px]" />
                <div className="flex flex-col items-center z-10">
                  <span className="h-5 w-5 rounded-full bg-slate-200 border-4 border-white flex items-center justify-center ring-1 ring-slate-100" />
                  <span className="text-[10px] font-semibold text-slate-400 mt-1">Destination</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Track Shipment Modal */}
      {isTrackShipmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setTrackShipmentOpen(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden z-10 mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-2 text-blue-600">
                <Ship className="h-5 w-5" />
                <h3 className="font-semibold text-slate-800 text-base">Track New Shipment</h3>
              </div>
              <button onClick={() => setTrackShipmentOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleStartTracking} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Shipment Type</label>
                <select
                  className="block w-full border border-slate-200 bg-white rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500"
                  value={shipmentType}
                  onChange={(e) => setShipmentType(e.target.value)}
                >
                  <option value="Ocean Shipment">Ocean Shipment</option>
                  <option value="Air Freight">Air Freight</option>
                  <option value="Road Transportation">Road Transportation</option>
                  <option value="Rail Shipment">Rail Shipment</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Tracking Name / Container / BL No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MSCU9938210"
                  className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  value={trackingName}
                  onChange={(e) => setTrackingName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Notifier Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. notify@client.com"
                  className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  value={notifier}
                  onChange={(e) => setNotifier(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTrackShipmentOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-xs flex items-center space-x-2"
                >
                  <span>Start Track</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
