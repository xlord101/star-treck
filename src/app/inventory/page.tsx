'use client';

import { useStore } from '@/store/useStore';
import { 
  Package, 
  Home, 
  ShoppingCart, 
  ArrowLeftRight, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export default function InventoryPage() {
  const { activeTabInventory, setActiveTabInventory, inventoryItems } = useStore();

  // Dynamic calculations
  const totalStock = inventoryItems.reduce((sum, item) => sum + item.stock, 0);
  const lowStockCount = inventoryItems.filter(item => item.status === 'Low Stock' || item.stock < 50).length;
  
  // Distinct warehouses list
  const uniqueWarehouses = Array.from(new Set(inventoryItems.map(item => item.warehouse)));
  const warehouseCount = uniqueWarehouses.length || 2; // Fallback to 2

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory</h1>
          <p className="text-sm text-slate-500">Manage warehouses, goods, and purchase orders.</p>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Items</span>
            <Package className="h-4 w-4" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">{totalStock.toLocaleString()} kg</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Across all products</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-red-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-red-600">{lowStockCount}</h3>
            <p className="text-[10px] text-red-400 mt-0.5">Needs urgent reorder</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Warehouses</span>
            <Home className="h-4 w-4" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">{warehouseCount}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Active depots</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <ShoppingCart className="h-4 w-4" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">45</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Purchase + Sales</p>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Stock Moves</span>
            <ArrowLeftRight className="h-4 w-4" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">182</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Past 30 days</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {[
          { id: 'items', label: 'Inventory Items', icon: Package },
          { id: 'warehouses', label: 'Warehouses', icon: Home },
          { id: 'orders', label: 'Orders', icon: ShoppingCart },
          { id: 'movements', label: 'Stock Movements', icon: ArrowLeftRight },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabInventory(tab.id as 'items' | 'warehouses' | 'orders' | 'movements')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 transition-colors duration-200 -mb-px flex items-center space-x-2 cursor-pointer ${
              activeTabInventory === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <tab.icon className="h-4 w-4 text-slate-400" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs">
        {activeTabInventory === 'items' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-base">Inventory Item Directory</h3>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Item Name</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Warehouse</th>
                    <th className="px-4 py-3 text-right">Available Stock</th>
                    <th className="px-4 py-3 text-right">Unit Value</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventoryItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800">{item.name}</td>
                      <td className="px-4 py-3 font-mono text-xs">{item.sku}</td>
                      <td className="px-4 py-3 text-slate-500">{item.warehouse}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-700">{item.stock.toLocaleString()} kg</td>
                      <td className="px-4 py-3 text-right text-slate-500">${item.unit_value.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.status === 'In Stock' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTabInventory === 'warehouses' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Warehouse Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/30 flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm">Mumbai Central (WH1)</h4>
                  <p className="text-xs text-slate-400">Sector 5, Kalamboli, Navi Mumbai, MH</p>
                  <p className="text-xs font-semibold text-slate-600 pt-2">Capacity: 75% utilised</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
              <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/30 flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm">Delhi Okhla (WH2)</h4>
                  <p className="text-xs text-slate-400">Phase III, Okhla Industrial Area, New Delhi</p>
                  <p className="text-xs font-semibold text-slate-600 pt-2">Capacity: 20% utilised</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </div>
          </div>
        )}

        {activeTabInventory === 'orders' && (
          <div className="p-8 text-center text-slate-500">
            <ShoppingCart className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No active purchase orders</p>
            <p className="text-xs text-slate-400 mt-0.5">Track inbound purchase lists here.</p>
          </div>
        )}

        {activeTabInventory === 'movements' && (
          <div className="p-8 text-center text-slate-500">
            <ArrowLeftRight className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No recent stock movements</p>
            <p className="text-xs text-slate-400 mt-0.5">A history of items moved or shipped will show here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
