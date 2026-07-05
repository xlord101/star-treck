'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Boxes, Plus, X, Search, Move3d, Scale } from 'lucide-react';

export default function PackagesPage() {
  const { packages, addPackage } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !length || !width || !height || !maxWeight) {
      alert('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addPackage({
        name,
        length: parseFloat(length),
        width: parseFloat(width),
        height: parseFloat(height),
        max_weight: parseFloat(maxWeight)
      });

      // Clear Form & Close
      setName('');
      setLength('');
      setWidth('');
      setHeight('');
      setMaxWeight('');
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save packaging specifications.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPackages = packages.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Packages</h1>
          <p className="text-sm text-slate-500">Manage packing specifications, pallet sizing, and boxes.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Specification</span>
        </button>
      </div>

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-hidden focus:border-blue-500 transition-all placeholder:text-slate-400"
            placeholder="Search package types by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Package Specs Directory */}
      {filteredPackages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-xs">
          <div className="h-12 w-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Boxes className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-700">No packaging specifications</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery 
              ? `No specifications match your search "${searchQuery}".`
              : "Create packaging presets to automate load calculations and container fills."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Specification Type</th>
                  <th className="px-6 py-4 text-center">Dimensions (L × W × H) mm</th>
                  <th className="px-6 py-4 text-right">Max Weight Capacity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPackages.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                        <Boxes className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-slate-800">{p.name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-center text-slate-600">
                      {p.length} × {p.width} × {p.height} mm
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">{p.max_weight.toLocaleString()} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Specification Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden z-10 mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-2 text-blue-600">
                <Boxes className="h-5 w-5" />
                <h3 className="font-semibold text-slate-800 text-base">New Package Specification</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPackageSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Preset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standard Pallet"
                  className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Dimensions Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                  <Move3d className="h-3.5 w-3.5" />
                  <span>Outer Dimensions (mm)</span>
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">Length</label>
                    <input
                      type="number"
                      required
                      placeholder="L"
                      className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 text-center"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">Width</label>
                    <input
                      type="number"
                      required
                      placeholder="W"
                      className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 text-center"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">Height</label>
                    <input
                      type="number"
                      required
                      placeholder="H"
                      className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 text-center"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Weight Section */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center space-x-1">
                  <Scale className="h-3.5 w-3.5" />
                  <span>Max Weight Capacity (kg)</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1500"
                  className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  value={maxWeight}
                  onChange={(e) => setMaxWeight(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  {isSubmitting ? 'Adding...' : 'Save Spec'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
