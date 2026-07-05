'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { 
  FileText, 
  Plus, 
  Search, 
  MoreVertical, 
  Grid, 
  FileSignature, 
  Sparkles,
  Link as LinkIcon,
  Trash2,
  X,
  Upload
} from 'lucide-react';

interface LineItem {
  id: number;
  description: string;
  hsCode: string;
  qty: number;
  unitPrice: number;
}

const templates = [
  'Bill of Lading', 
  'Certificate of Origin', 
  'Commercial Invoice', 
  'Packing List', 
  'Proforma Invoice', 
  'Declaration of Origin', 
  'Bill of Exchange', 
  'Quotation', 
  'Phytosanitary Certificate', 
  'Non Asbestos Declaration', 
  'Forwarding Instruction', 
  'Shipping Document'
];

function getRandomInvoiceId() {
  return Math.floor(1000 + Math.random() * 9000);
}

export default function ExportDocsPage() {
  const { 
    documents, 
    addDocument, 
    shipments,
    activeTabExportDocs,
    setActiveTabExportDocs,
    isTemplateGalleryOpen,
    setTemplateGalleryOpen,
    isDocumentEditorOpen,
    setDocumentEditorOpen,
    selectedTemplate,
    setSelectedTemplate
  } = useStore();

  const [docSearchQuery, setDocSearchQuery] = useState('');
  
  // Document Editor Fields
  const [exporter, setExporter] = useState('Shree Krishna Exports Ltd.');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [blNumber, setBlNumber] = useState('');
  const [consignee, setConsignee] = useState('');
  const [dispatchMethod, setDispatchMethod] = useState('SEA');
  const [shipmentType, setShipmentType] = useState('FCL');
  const [portLoading, setPortLoading] = useState('');
  const [portDischarge, setPortDischarge] = useState('');
  const [linkedShipment, setLinkedShipment] = useState('');
  const [signatoryCompany, setSignatoryCompany] = useState('Shree Krishna Exports Ltd.');
  const [signatureName, setSignatureName] = useState('');

  // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, description: 'Premium Milk Powder', hsCode: '0402.10', qty: 500, unitPrice: 4.5 }
  ]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now(), description: '', hsCode: '', qty: 1, unitPrice: 0 }
    ]);
  };

  const removeLineItem = (id: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: number, field: keyof LineItem, val: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  };

  const handleCreateDocClick = () => {
    setSelectedTemplate(null);
    setTemplateGalleryOpen(true);
  };

  const selectTemplate = (templateName: string) => {
    setSelectedTemplate(templateName);
    setTemplateGalleryOpen(false);
    
    // Automatically generate invoice number & prefill details
    const rand = getRandomInvoiceId();
    setInvoiceNumber(`INV-2026-${rand}`);
    
    // Default linked shipment if any shipments exist
    if (shipments.length > 0) {
      setLinkedShipment(shipments[0].shipment_name);
    }
    
    setDocumentEditorOpen(true);
  };

  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber.trim()) {
      alert('Invoice number is required');
      return;
    }

    try {
      await addDocument({
        doc_name: `${selectedTemplate || 'Document'} - ${invoiceNumber}.pdf`,
        doc_type: selectedTemplate || 'Commercial Invoice',
        linked_shipment: linkedShipment || null,
        created_by: 'Shree Krishna'
      });

      // Reset Form states
      setInvoiceNumber('');
      setBlNumber('');
      setConsignee('');
      setPortLoading('');
      setPortDischarge('');
      setLinkedShipment('');
      setSignatureName('');
      setLineItems([{ id: 1, description: 'Premium Milk Powder', hsCode: '0402.10', qty: 500, unitPrice: 4.5 }]);

      // Close editor
      setDocumentEditorOpen(false);
      setActiveTabExportDocs('my-docs');
    } catch (err) {
      console.error(err);
      alert('Error creating document.');
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.doc_name.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
    doc.doc_type.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
    (doc.linked_shipment && doc.linked_shipment.toLowerCase().includes(docSearchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Export Docs</h1>
          <p className="text-sm text-slate-500">Draft, configure and link logistics documents.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTabExportDocs('my-docs')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 transition-colors duration-200 -mb-px ${
            activeTabExportDocs === 'my-docs'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Documents
        </button>
        <button
          onClick={() => setActiveTabExportDocs('doc-studio')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 transition-colors duration-200 -mb-px flex items-center space-x-2 ${
            activeTabExportDocs === 'doc-studio'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Grid className="h-4 w-4 text-slate-400" />
          <span>Document Studio</span>
        </button>
      </div>

      {/* Content Area */}
      {activeTabExportDocs === 'my-docs' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          {/* Action Row */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative max-w-sm flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                placeholder="Search documents..."
                value={docSearchQuery}
                onChange={(e) => setDocSearchQuery(e.target.value)}
              />
            </div>

            <button
              onClick={handleCreateDocClick}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-xs shrink-0 self-end sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Create Document</span>
            </button>
          </div>

          {/* Datatable */}
          {filteredDocs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">No documents found</p>
              <p className="text-xs text-slate-400 mt-1">Select Document Studio or click Create Document to design templates.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Document</th>
                    <th className="px-6 py-4">Linked Shipment</th>
                    <th className="px-6 py-4">Created By</th>
                    <th className="px-6 py-4">Updated On</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 leading-none mb-1">{doc.doc_name}</p>
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md">
                            {doc.doc_type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {doc.linked_shipment ? (
                          <div className="flex items-center space-x-1.5 text-blue-600 font-semibold">
                            <LinkIcon className="h-3.5 w-3.5 text-blue-500" />
                            <span>{doc.linked_shipment}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unlinked</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{doc.created_by}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(doc.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Document Studio Tab */
        <div className="space-y-6">
          {/* Start Creating block */}
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-bold text-slate-800 text-lg flex items-center justify-center md:justify-start space-x-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <span>Start Creating Templates</span>
              </h3>
              <p className="text-sm text-slate-500 max-w-lg">
                Design official documents like Commercial Invoices, Packing Lists and Bill of Ladings linked directly to active shipments.
              </p>
            </div>
            <button
              onClick={() => setTemplateGalleryOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all shrink-0"
            >
              Start Creating
            </button>
          </div>

          {/* Quick Guide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-2">
              <span className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center">1</span>
              <h4 className="font-semibold text-slate-800 text-sm">Select Template</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Choose from our industry-approved templates for export procedures.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-2">
              <span className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm flex items-center justify-center">2</span>
              <h4 className="font-semibold text-slate-800 text-sm">Fill & Pre-populate</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Pre-populate details from shipment files or fill details manually in the editor.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-2">
              <span className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm flex items-center justify-center">3</span>
              <h4 className="font-semibold text-slate-800 text-sm">Sign & Save</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Add signatures and save documents straight to your cloud storage.</p>
            </div>
          </div>
        </div>
      )}

      {/* Template Gallery Modal */}
      {isTemplateGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setTemplateGalleryOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-4xl overflow-hidden z-10 mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-base">Select Document Template</h3>
              <button onClick={() => setTemplateGalleryOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
              {templates.map((temp) => (
                <button
                  key={temp}
                  onClick={() => selectTemplate(temp)}
                  className="bg-slate-50 hover:bg-blue-50/40 border border-slate-200 hover:border-blue-400 p-4 rounded-xl text-center flex flex-col items-center justify-center space-y-2 group transition-all duration-200 hover:shadow-xs"
                >
                  <div className="p-3 bg-white border border-slate-100 text-slate-400 group-hover:text-blue-600 rounded-lg group-hover:scale-105 transition-all">
                    <FileText className="h-5 w-5 shrink-0" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 leading-tight block">{temp}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Document Editor Overlay Modal */}
      {isDocumentEditorOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 overflow-y-auto no-print-container">
          {/* Editor Header Bar (Hidden during printing) */}
          <div className="no-print bg-[#0B192C] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-45 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">{selectedTemplate} Workspace</h3>
                <p className="text-xs text-slate-400">Inline WYSIWYG Document Editor (A4 Page)</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setDocumentEditorOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-350 font-semibold text-xs rounded-lg transition-colors border border-slate-700 cursor-pointer"
              >
                Back to Logs
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <FileSignature className="h-3.5 w-3.5" />
                <span>Finalize & Print PDF</span>
              </button>
              <button
                type="button"
                onClick={handleSaveDocument}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Save to Database
              </button>
            </div>
          </div>

          {/* Interactive A4 Sheet Area */}
          <div className="flex-1 py-10 px-4 flex justify-center bg-slate-100 print:bg-white print:p-0 print:py-0">
            <div className="print-page-container w-full max-w-[794px] md:w-[794px] min-h-[1123px] bg-white border border-slate-200 print:border-none shadow-xl print:shadow-none p-6 sm:p-12 print:p-0 flex flex-col justify-between aspect-[1/1.4142] relative text-slate-800 font-sans">
              
              {/* Top Document Header */}
              <div>
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
                  <div className="space-y-2">
                    <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      SK
                    </div>
                    <div className="text-xs text-slate-500 font-semibold uppercase">Official Shipping Document</div>
                  </div>
                  <div className="text-right space-y-1">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">{selectedTemplate || 'Commercial Invoice'}</h2>
                    <p className="text-xs text-slate-400 font-mono">Invoice Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Exporter & Invoice Details Info Grid */}
                <div className="grid grid-cols-2 gap-8 text-xs mb-8">
                  {/* Left Column: Parties */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exporter / Shipper</label>
                      <textarea
                        rows={2}
                        className="w-full font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-slate-50/50 outline-hidden transition-all py-1 resize-none font-sans"
                        value={exporter}
                        onChange={(e) => setExporter(e.target.value)}
                        placeholder="Exporter name & address details"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consignee (Bill To)</label>
                      <textarea
                        rows={3}
                        required
                        className="w-full font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-slate-50/50 outline-hidden transition-all py-1 resize-none font-sans"
                        value={consignee}
                        onChange={(e) => setConsignee(e.target.value)}
                        placeholder="Name and address of consignee / buyer"
                      />
                    </div>
                  </div>

                  {/* Right Column: References */}
                  <div className="space-y-3.5 border-l border-slate-100 pl-8">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoice Number</span>
                      <input
                        type="text"
                        required
                        className="font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 text-right w-40 outline-hidden py-0.5"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">B/L or AWB Number</span>
                      <input
                        type="text"
                        placeholder="e.g. BL-99321"
                        className="font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 text-right w-40 outline-hidden py-0.5"
                        value={blNumber}
                        onChange={(e) => setBlNumber(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Linked Shipment</span>
                      <select
                        className="font-semibold text-slate-700 bg-transparent border border-slate-200 hover:border-slate-350 rounded px-1.5 py-0.5 text-right w-44 outline-hidden no-print"
                        value={linkedShipment}
                        onChange={(e) => setLinkedShipment(e.target.value)}
                      >
                        <option value="">-- Select Shipment --</option>
                        {shipments.map((s) => (
                          <option key={s.id} value={s.shipment_name}>
                            {s.shipment_name}
                          </option>
                        ))}
                      </select>
                      {/* Read only view for printing */}
                      <span className="hidden print:inline font-semibold text-slate-800">{linkedShipment || 'Unlinked'}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dispatch Method</span>
                      <select
                        className="font-semibold text-slate-700 bg-transparent border border-slate-200 hover:border-slate-350 rounded px-1.5 py-0.5 text-right w-32 outline-hidden no-print"
                        value={dispatchMethod}
                        onChange={(e) => setDispatchMethod(e.target.value)}
                      >
                        <option value="SEA">SEA</option>
                        <option value="AIR">AIR</option>
                        <option value="ROAD">ROAD</option>
                        <option value="RAIL">RAIL</option>
                      </select>
                      <span className="hidden print:inline font-semibold text-slate-800">{dispatchMethod}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shipment Type</span>
                      <select
                        className="font-semibold text-slate-700 bg-transparent border border-slate-200 hover:border-slate-350 rounded px-1.5 py-0.5 text-right w-32 outline-hidden no-print"
                        value={shipmentType}
                        onChange={(e) => setShipmentType(e.target.value)}
                      >
                        <option value="FCL">FCL</option>
                        <option value="LCL">LCL</option>
                      </select>
                      <span className="hidden print:inline font-semibold text-slate-800">{shipmentType}</span>
                    </div>
                  </div>
                </div>

                {/* Ports Info */}
                <div className="grid grid-cols-2 gap-8 text-xs mb-8 bg-slate-50/55 print:bg-transparent border border-slate-100 print:border-none rounded-xl p-4 print:p-0">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Port of Loading</label>
                    <input
                      type="text"
                      placeholder="Port of origin"
                      className="font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 w-full outline-hidden py-0.5"
                      value={portLoading}
                      onChange={(e) => setPortLoading(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 border-l border-slate-150/40 print:border-none pl-8 print:pl-0">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Port of Discharge</label>
                    <input
                      type="text"
                      placeholder="Port of destination"
                      className="font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 w-full outline-hidden py-0.5"
                      value={portDischarge}
                      onChange={(e) => setPortDischarge(e.target.value)}
                    />
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Description of Goods</th>
                        <th className="px-4 py-3 w-28">HS Code</th>
                        <th className="px-4 py-3 w-20 text-right">Qty</th>
                        <th className="px-4 py-3 w-24 text-right">Unit Price</th>
                        <th className="px-4 py-3 w-28 text-right">Amount</th>
                        <th className="px-4 py-3 w-10 text-center no-print"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {lineItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 print:hover:bg-transparent">
                          <td className="px-4 py-1.5">
                            <input
                              type="text"
                              required
                              placeholder="Describe items inline..."
                              className="w-full bg-transparent border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-slate-50/50 rounded p-1 text-xs text-slate-800"
                              value={item.description}
                              onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-1.5">
                            <input
                              type="text"
                              placeholder="HS Code"
                              className="w-full bg-transparent border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-slate-50/50 rounded p-1 text-xs text-slate-800 font-mono"
                              value={item.hsCode}
                              onChange={(e) => updateLineItem(item.id, 'hsCode', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-1.5">
                            <input
                              type="number"
                              required
                              min="1"
                              className="w-full bg-transparent border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-slate-50/50 rounded p-1 text-xs text-right text-slate-800"
                              value={item.qty}
                              onChange={(e) => updateLineItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                            />
                          </td>
                          <td className="px-4 py-1.5">
                            <input
                              type="number"
                              required
                              step="0.01"
                              min="0"
                              className="w-full bg-transparent border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-slate-50/50 rounded p-1 text-xs text-right text-slate-800"
                              value={item.unitPrice}
                              onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td className="px-4 py-1.5 text-right font-bold text-slate-900">
                            ${(item.qty * item.unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-1.5 text-center no-print">
                            <button
                              type="button"
                              onClick={() => removeLineItem(item.id)}
                              disabled={lineItems.length <= 1}
                              className="p-1 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-20"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50/50 font-bold border-t border-slate-200 text-slate-800">
                        <td colSpan={4} className="px-4 py-3 text-right uppercase tracking-wider text-[10px] text-slate-400">Total Invoice Value (USD)</td>
                        <td className="px-4 py-3 text-right text-sm text-slate-900 border-l border-slate-200 bg-slate-100/30">
                          ${calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="no-print"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-start no-print">
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/50 border border-blue-100 rounded-lg transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Item Line</span>
                  </button>
                </div>
              </div>

              {/* Bottom Signatures Block */}
              <div className="border-t border-slate-250 pt-6 mt-auto">
                <div className="grid grid-cols-2 gap-8 text-xs items-end">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signatory Company</label>
                      <input
                        type="text"
                        className="font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-350 focus:border-blue-500 w-full outline-hidden py-0.5"
                        value={signatoryCompany}
                        onChange={(e) => setSignatoryCompany(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Authorized Signatory Name</label>
                      <input
                        type="text"
                        placeholder="Authorized individual"
                        className="font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-350 focus:border-blue-500 w-full outline-hidden py-0.5"
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Cursive Signature Preview Block */}
                  <div className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/20 text-center relative h-28 group print:border-none">
                    {signatureName ? (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 block no-print">Authorized Signature</span>
                        <div 
                          className="text-2xl text-blue-800 font-semibold"
                          style={{ fontFamily: "'Brush Script MT', cursive, sans-serif" }}
                        >
                          {signatureName}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 text-slate-400 no-print font-medium">
                        <Upload className="h-5 w-5 mx-auto opacity-70 mb-1" />
                        <span className="text-[10px] font-semibold block">Signature generated automatically</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
