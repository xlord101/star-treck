'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { parseAIShipmentPrompt } from '@/lib/aiParser';
import { X, Sparkles, AlertCircle } from 'lucide-react';

export default function CreateShipmentModal() {
  const { isCreateShipmentOpen, setCreateShipmentOpen, addShipment, incrementTokens } = useStore();

  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiError, setAiError] = useState('');

  // Manual form state
  const [transactionType, setTransactionType] = useState<'Export' | 'Import'>('Export');
  const [transportMode, setTransportMode] = useState<string>('SEA');
  const [shipmentType, setShipmentType] = useState<string>('FCL');
  const [shipmentName, setShipmentName] = useState('');
  const [shipmentNumber, setShipmentNumber] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState('');

  if (!isCreateShipmentOpen) return null;

  const handleAiAnalyze = () => {
    if (!aiPrompt.trim()) {
      setAiError('Please enter a description for the shipment.');
      return;
    }
    setAiError('');
    try {
      const parsed = parseAIShipmentPrompt(aiPrompt);
      
      // Auto fill manual fields
      setTransactionType(parsed.type_of_transaction);
      setTransportMode(parsed.mode_of_transport);
      setShipmentType(parsed.type_of_shipment);
      setShipmentName(parsed.shipment_name);
      setShipmentNumber(parsed.shipment_number);

      // Simulate Token spend
      const promptTokens = Math.floor(100 + aiPrompt.length * 1.5);
      const completionTokens = Math.floor(150 + Math.random() * 50);
      incrementTokens(promptTokens, completionTokens);

      setAiSuccessMessage('AI successfully analyzed prompt! Check the manually populated details.');
      setTimeout(() => setAiSuccessMessage(''), 4000);

      // Switch to manual tab for review
      setActiveTab('manual');
    } catch {
      setAiError('Failed to parse the prompt. Try writing a simpler instruction.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipmentName.trim() || !shipmentNumber.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addShipment({
        shipment_name: shipmentName,
        shipment_number: shipmentNumber,
        mode_of_transport: transportMode,
        type_of_shipment: shipmentType,
        status: 'Draft',
      });
      
      // Reset state and close modal
      setShipmentName('');
      setShipmentNumber('');
      setAiPrompt('');
      setCreateShipmentOpen(false);
    } catch (error) {
      console.error(error);
      alert('Failed to save shipment. Make sure the shipment number is unique.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setCreateShipmentOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-2xl overflow-hidden z-10 transition-all transform scale-100 duration-300 mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-slate-800 text-lg">Create Shipment</h3>
          </div>
          <button 
            onClick={() => setCreateShipmentOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 bg-white">
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors duration-200 -mb-px flex items-center space-x-2 ${
              activeTab === 'ai'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>AI Assistant</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors duration-200 -mb-px ${
              activeTab === 'manual'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Fill Details Manually
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {activeTab === 'ai' ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 flex items-start space-x-3">
                <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">AI Assistant:</span> Type a natural language request to automatically populate shipment details.
                  <div className="mt-2 text-xs text-blue-600/90 font-mono italic">
                    {"Example: \"Initiate a new export shipment by sea with FCL named UAE Milk Consignment with number EXP-2026-003\""}
                  </div>
                </div>
              </div>

              {aiError && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-800 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Type message</label>
                <textarea
                  rows={4}
                  className="block w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/30"
                  placeholder="Describe your shipment (e.g. Mode of transport, FCL/LCL, shipment name, tracking details...)"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAiAnalyze}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-xs"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze with AI</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              {aiSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-sm text-emerald-800 flex items-center space-x-2">
                  <span className="font-semibold">✨ Success:</span>
                  <span>{aiSuccessMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Transaction Type */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Type of Transaction</label>
                  <div className="flex space-x-3">
                    {['Export', 'Import'].map((type) => (
                      <label 
                        key={type}
                        className={`flex-1 flex items-center justify-center py-2 px-3 border rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ${
                          transactionType === type
                            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                            : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="transactionType"
                          className="sr-only"
                          checked={transactionType === type}
                          onChange={() => setTransactionType(type as 'Export' | 'Import')}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type of Shipment */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Type of Shipment</label>
                  <div className="flex space-x-3">
                    {['LCL', 'FCL'].map((type) => (
                      <label 
                        key={type}
                        className={`flex-1 flex items-center justify-center py-2 px-3 border rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ${
                          shipmentType === type
                            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                            : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipmentType"
                          className="sr-only"
                          checked={shipmentType === type}
                          onChange={() => setShipmentType(type)}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mode of Transport */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Mode of Transport</label>
                <div className="grid grid-cols-4 gap-2">
                  {['SEA', 'AIR', 'ROAD', 'RAIL'].map((mode) => (
                    <label 
                      key={mode}
                      className={`flex items-center justify-center py-2.5 px-3 border rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                        transportMode === mode
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                          : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="transportMode"
                        className="sr-only"
                        checked={transportMode === mode}
                        onChange={() => setTransportMode(mode)}
                      />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shipment Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Shipment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Milk Powder - UAE Consignment"
                  className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={shipmentName}
                  onChange={(e) => setShipmentName(e.target.value)}
                />
              </div>

              {/* Shipment Number */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Shipment Number / Booking Ref</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EXP-2026-001"
                  className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={shipmentNumber}
                  onChange={(e) => setShipmentNumber(e.target.value)}
                />
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateShipmentOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors shadow-xs"
                >
                  {isSubmitting ? 'Saving...' : 'Save Shipment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
