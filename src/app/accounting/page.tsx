'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { DollarSign, Cpu, ArrowRight, CheckCircle2, X, RefreshCw, Layers } from 'lucide-react';

export default function AccountingPage() {
  const { documents } = useStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientId, setClientId] = useState('');
  const [orgId, setOrgId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId.trim() || !orgId.trim()) {
      alert('Please fill out all fields.');
      return;
    }
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setIsModalOpen(false);
    }, 1200);
  };

  const handleDisconnect = () => {
    if (confirm('Are you sure you want to disconnect Zoho Books?')) {
      setIsConnected(false);
      setClientId('');
      setOrgId('');
    }
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  // Filter Commercial Invoices
  const invoices = documents.filter(d => d.doc_type === 'Commercial Invoice');

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Accounting</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Synchronise invoices, calculate duties and file financial statements in real time.
        </p>
      </div>

      {!isConnected ? (
        /* Disconnected State */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 md:p-12 text-center flex flex-col items-center space-y-8 mt-6">
          
          {/* SVG Illustration - Person on a laptop */}
          <div className="w-64 h-48 relative flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 overflow-hidden">
            {/* Laptop body */}
            <div className="absolute bottom-10 w-32 h-20 bg-[#0B192C] rounded-lg border-2 border-slate-700 shadow-md flex items-center justify-center">
              {/* Screen Content */}
              <div className="w-[110px] h-[64px] bg-slate-900 rounded flex flex-col p-1.5 space-y-1">
                <div className="h-1.5 w-1/2 bg-blue-500 rounded" />
                <div className="h-1.5 w-full bg-slate-700 rounded" />
                <div className="h-1.5 w-2/3 bg-slate-700 rounded" />
                <div className="flex items-center space-x-1 mt-auto">
                  <div className="h-3 w-3 bg-emerald-500 rounded-full flex items-center justify-center text-[6px] text-white font-bold">$</div>
                  <div className="h-2 w-10 bg-slate-800 rounded" />
                </div>
              </div>
            </div>
            {/* Keyboard / base */}
            <div className="absolute bottom-7 w-36 h-3 bg-slate-600 rounded-b-md border-b-2 border-slate-800" />
            
            {/* Decorative floating shapes */}
            <div className="absolute top-12 left-10 p-2 bg-blue-50 text-blue-600 rounded-full border border-blue-100 shadow-xs animate-bounce" style={{ animationDuration: '4s' }}>
              <DollarSign className="h-4 w-4" />
            </div>
            <div className="absolute top-8 right-12 p-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 shadow-xs">
              <span className="text-[10px] font-bold">+24%</span>
            </div>
            <div className="absolute bottom-14 right-8 p-2 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 shadow-xs">
              <Cpu className="h-4 w-4" />
            </div>
          </div>

          {/* Integration Call to action */}
          <div className="max-w-md space-y-4">
            <div className="space-y-1">
              <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                Integrations
              </span>
              <h3 className="text-lg font-bold text-slate-800 pt-2">Set Up Accounting for Your Business</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect Zoho Books to sync line items, invoice files, tax structures, and customer profiles immediately with Freightnaut.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <span>Connect Zoho Books</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Connected State */
        <div className="space-y-6 mt-6 animate-fade-in">
          {/* Integration Header Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-800 text-base">Zoho Books Integration</h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">CONNECTED</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Connected Organization: <span className="font-mono text-slate-600">{orgId}</span></p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="flex items-center space-x-1.5 px-3 py-2 border border-slate-200 hover:border-slate-350 rounded-lg text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
              <button
                onClick={handleDisconnect}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-700 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                Disconnect
              </button>
            </div>
          </div>

          {/* Sync status for Invoices */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                <Layers className="h-4.5 w-4.5 text-blue-600" />
                <span>Invoice Synchronization Logs</span>
              </h4>
              <span className="text-xs text-slate-400 font-semibold">{invoices.length} commercial invoice(s) found</span>
            </div>

            {invoices.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 bg-slate-50/50 rounded-xl">
                <p className="text-xs font-semibold text-slate-600">No invoices generated yet</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Go to Document Studio to draft and save Commercial Invoices.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-50 rounded-xl">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Document Name</th>
                      <th className="px-4 py-3">Linked Shipment</th>
                      <th className="px-4 py-3">Drafted By</th>
                      <th className="px-4 py-3 text-right">Estimated Total</th>
                      <th className="px-4 py-3 text-center">Sync Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-800">{inv.doc_name}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono">{inv.linked_shipment || 'Unlinked'}</td>
                        <td className="px-4 py-3">{inv.created_by}</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-800">$48,500.00</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                            isSyncing 
                              ? 'bg-amber-50 text-amber-600' 
                              : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {isSyncing ? 'PENDING' : 'SYNCHRONIZED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Connect API Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden z-10 mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-2 text-blue-600">
                <Cpu className="h-5 w-5" />
                <h3 className="font-semibold text-slate-800 text-base">Connect Zoho Books API</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConnectSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Zoho Organization ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ORG-9938120"
                  className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white font-mono"
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Client ID (Credentials)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1000.A4B8C1D9..."
                  className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white font-mono"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-700 leading-normal">
                Connecting Zoho Books allows Freightnaut to synchronize line items, customers list and export invoices automatically to your books.
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  {isConnecting ? 'Connecting...' : 'Authorize & Connect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
