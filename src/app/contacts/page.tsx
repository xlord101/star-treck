'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Users, Plus, X, Search, Mail } from 'lucide-react';

export default function ContactsPage() {
  const { contacts, addContact } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Buyer');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !role || !address.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addContact({
        name,
        email,
        role,
        address
      });

      // Clear Form & Close
      setName('');
      setEmail('');
      setRole('Buyer');
      setAddress('');
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to add contact. Email address might be already in use.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contacts</h1>
          <p className="text-sm text-slate-500">Manage buyers, consignees, freight forwarders, and custom brokers.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Contact</span>
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
            placeholder="Search contacts by name, role or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Contacts List Directory */}
      {filteredContacts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-xs">
          <div className="h-12 w-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-700">No contacts found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery 
              ? `No contacts match your search "${searchQuery}".`
              : "Add profiles to quickly reference exporter, consignee or notifier details in shipping documents."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Company / Individual</th>
                  <th className="px-6 py-4">Email Contact</th>
                  <th className="px-6 py-4">Role Classification</th>
                  <th className="px-6 py-4">Physical Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContacts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                        <Users className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-slate-800">{c.name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 flex items-center space-x-1.5 pt-4">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{c.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        c.role === 'Buyer' ? 'bg-indigo-50 text-indigo-700' :
                        c.role === 'Consignee' ? 'bg-blue-50 text-blue-700' :
                        c.role === 'Forwarder' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {c.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate" title={c.address}>
                      {c.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden z-10 mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-2 text-blue-600">
                <Users className="h-5 w-5" />
                <h3 className="font-semibold text-slate-800 text-base">Add New Contact</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddContactSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Contact Name / Company</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Al-Mansoori Distributors"
                  className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. contact@almansoori.ae"
                  className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white font-mono"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Role Type</label>
                <select
                  className="block w-full border border-slate-200 bg-white rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Buyer">Buyer</option>
                  <option value="Consignee">Consignee</option>
                  <option value="Forwarder">Freight Forwarder</option>
                  <option value="Broker">Customs Broker</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Physical Address</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Street details, Zone, City, Country"
                  className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white resize-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                  {isSubmitting ? 'Adding...' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
