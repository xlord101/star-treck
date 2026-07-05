'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Package, Plus, X, Search, DollarSign, Scale } from 'lucide-react';

export default function ProductsPage() {
  const { products, addProduct } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [hsCode, setHsCode] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim() || !hsCode.trim() || !price || !weight) {
      alert('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addProduct({
        name,
        sku,
        hs_code: hsCode,
        price: parseFloat(price),
        weight: parseFloat(weight)
      });

      // Clear Form & Close
      setName('');
      setSku('');
      setHsCode('');
      setPrice('');
      setWeight('');
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to add product. SKU might be already in use.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.hs_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Products</h1>
          <p className="text-sm text-slate-500">Configure product catalogs, HS codes, and export configurations.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
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
            placeholder="Search products by SKU or HS Code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Products Directory Grid/Table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-xs">
          <div className="h-12 w-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-700">No products found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery 
              ? `No products match your search "${searchQuery}".`
              : "Add items to your catalog to quickly draft invoices with default HS codes and weights."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">SKU Code</th>
                  <th className="px-6 py-4">HS Code</th>
                  <th className="px-6 py-4 text-right">Price per unit</th>
                  <th className="px-6 py-4 text-right">Unit Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                        <Package className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-slate-800">{p.name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{p.sku}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{p.hs_code}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">${p.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-slate-500 text-xs">{p.weight} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden z-10 mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-2 text-blue-600">
                <Package className="h-5 w-5" />
                <h3 className="font-semibold text-slate-800 text-base">Add New Product</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Milk Powder"
                  className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">SKU Reference</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SKU-MP-001"
                  className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white font-mono"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">HS Harmonized Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0402.10"
                  className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white font-mono"
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase flex items-center space-x-1">
                    <DollarSign className="h-3 w-3" />
                    <span>Unit Price (USD)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase flex items-center space-x-1">
                    <Scale className="h-3 w-3" />
                    <span>Weight (kg)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="0.0"
                    className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
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
                  {isSubmitting ? 'Adding...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
