'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { 
  User, 
  Users, 
  Cpu, 
  Settings, 
  Plus, 
  X, 
  ShieldAlert
} from 'lucide-react';

export default function SettingsPage() {
  const { 
    users, 
    addUser, 
    activeTabSettings, 
    setActiveTabSettings,
    isNewUserOpen,
    setNewUserOpen,
    inputTokens,
    outputTokens,
    tokenSpendHistory
  } = useStore();

  // New User Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Admin');
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    setIsSubmittingUser(true);
    try {
      await addUser({
        name: `${firstName} ${lastName}`,
        email,
        role,
      });

      // Clear fields and close
      setFirstName('');
      setLastName('');
      setEmail('');
      setRole('Admin');
      setNewUserOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to add user. Email might be already in use.');
    } finally {
      setIsSubmittingUser(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500">Configure team roles, profile settings and AI spend logs.</p>
      </div>

      {/* Grid Layout: Left Tab List & Right Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Sub-nav */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-visible border-b md:border-b-0 border-slate-200 gap-1 pb-2 md:pb-0 shrink-0">
          {[
            { id: 'account', label: 'Account', icon: User },
            { id: 'team', label: 'Team & Members', icon: Users },
            { id: 'usage', label: 'AI Usage & Spend', icon: Cpu },
            { id: 'workflow', label: 'Workflows', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabSettings(tab.id as 'account' | 'team' | 'usage' | 'workflow')}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shrink-0 text-left ${
                activeTabSettings === tab.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <tab.icon className="h-4.5 w-4.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Details Panel */}
        <div className="md:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs">
          
          {/* Account Tab */}
          {activeTabSettings === 'account' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-3">Account Profile</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Organization Name</label>
                  <input
                    type="text"
                    disabled
                    className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50/50 text-slate-500 cursor-not-allowed"
                    value="Shree Krishna Exports Ltd."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Primary Contact Email</label>
                  <input
                    type="text"
                    disabled
                    className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50/50 text-slate-500 cursor-not-allowed"
                    value="shree@freightnaut.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTabSettings === 'team' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <h3 className="text-base font-bold text-slate-800">Team Management</h3>
                <button
                  onClick={() => setNewUserOpen(true)}
                  className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-2 rounded-lg transition-colors shadow-2xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New User</span>
                </button>
              </div>

              {/* Members Datatable */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email Address</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {users.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-semibold text-slate-800">{member.name}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{member.email}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs font-semibold">{member.role}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Usage Tab */}
          {activeTabSettings === 'usage' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-3">AI Assistant Token Spend</h3>
              
              {/* Token stats strip */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Input Tokens Used</span>
                  <div className="flex items-baseline space-x-1.5 pt-1">
                    <span className="text-xl font-bold text-slate-800">{(inputTokens / 1000).toFixed(1)}K</span>
                    <span className="text-xs text-slate-400">/ 1,000,000</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(inputTokens / 1000000) * 100}%` }} />
                  </div>
                </div>

                <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Output Tokens Used</span>
                  <div className="flex items-baseline space-x-1.5 pt-1">
                    <span className="text-xl font-bold text-slate-800">{(outputTokens / 1000).toFixed(1)}K</span>
                    <span className="text-xs text-slate-400">/ 1,000,000</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${(outputTokens / 1000000) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Line chart plotting Token Spend over 7 days */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Spend Over Last 7 Days</h4>
                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tokenSpendHistory}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ background: '#0B192C', border: 'none', borderRadius: '8px', color: '#fff', fontSize: 11 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="spend" 
                        stroke="#2563eb" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 1 }}
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Workflow Tab */}
          {activeTabSettings === 'workflow' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-3 font-semibold">Workflow Settings</h3>
              <div className="flex items-center space-x-3 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
                <ShieldAlert className="h-5 w-5 text-blue-600 shrink-0" />
                <span className="font-medium">No external webhooks configured yet.</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* New User Modal */}
      {isNewUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setNewUserOpen(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden z-10 mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-2 text-blue-600">
                <Users className="h-5 w-5" />
                <h3 className="font-semibold text-slate-800 text-base">Add New Team Member</h3>
              </div>
              <button onClick={() => setNewUserOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John"
                    className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Doe"
                    className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john.doe@company.com"
                  className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">System Role</label>
                <select
                  className="block w-full border border-slate-200 bg-white rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Operator">Operator</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNewUserOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-xs"
                >
                  {isSubmittingUser ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
