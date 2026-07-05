import { create } from 'zustand';

export interface Shipment {
  id: number;
  shipment_name: string;
  shipment_number: string;
  mode_of_transport: string;
  type_of_shipment: string;
  status: string;
  created_at: string;
}

export interface Document {
  id: number;
  doc_name: string;
  doc_type: string;
  linked_shipment: string | null;
  created_by: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  hs_code: string;
  price: number;
  weight: number;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
}

export interface Package {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
  max_weight: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  unit_value: number;
  status: string;
}

interface AppState {
  // Data State
  shipments: Shipment[];
  documents: Document[];
  users: User[];
  products: Product[];
  contacts: Contact[];
  packages: Package[];
  inventoryItems: InventoryItem[];
  
  // UI Loading State
  isLoading: boolean;

  // Modal & Drawer Open States
  isCreateShipmentOpen: boolean;
  isTrackShipmentOpen: boolean;
  isNewUserOpen: boolean;
  isTemplateGalleryOpen: boolean;
  isDocumentEditorOpen: boolean;
  isMobileSidebarOpen: boolean;
  selectedTemplate: string | null;

  // Navigation / Tabs State
  activeTabExportDocs: 'my-docs' | 'doc-studio';
  activeTabInventory: 'items' | 'warehouses' | 'orders' | 'movements';
  activeTabSettings: 'account' | 'team' | 'usage' | 'workflow';
  
  // AI Tokens State
  inputTokens: number;
  outputTokens: number;
  tokenSpendHistory: { date: string; spend: number }[];

  // Global Search State
  globalSearchQuery: string;

  // Actions
  setGlobalSearchQuery: (query: string) => void;
  setCreateShipmentOpen: (open: boolean) => void;
  setTrackShipmentOpen: (open: boolean) => void;
  setNewUserOpen: (open: boolean) => void;
  setTemplateGalleryOpen: (open: boolean) => void;
  setDocumentEditorOpen: (open: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setSelectedTemplate: (template: string | null) => void;
  
  setActiveTabExportDocs: (tab: 'my-docs' | 'doc-studio') => void;
  setActiveTabInventory: (tab: 'items' | 'warehouses' | 'orders' | 'movements') => void;
  setActiveTabSettings: (tab: 'account' | 'team' | 'usage' | 'workflow') => void;

  // API Integration Actions
  fetchShipments: () => Promise<void>;
  addShipment: (shipment: Omit<Shipment, 'id' | 'created_at'>) => Promise<Shipment>;
  updateShipmentStatus: (id: number, status: string) => Promise<void>;

  fetchDocuments: () => Promise<void>;
  addDocument: (doc: Omit<Document, 'id' | 'updated_at'>) => Promise<Document>;

  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<User>;

  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;

  fetchContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, 'id'>) => Promise<Contact>;

  fetchPackages: () => Promise<void>;
  addPackage: (pkg: Omit<Package, 'id'>) => Promise<Package>;

  fetchInventoryItems: () => Promise<void>;

  incrementTokens: (input: number, output: number) => void;
}

export const useStore = create<AppState>((set) => ({
  shipments: [],
  documents: [],
  users: [],
  products: [],
  contacts: [],
  packages: [],
  inventoryItems: [],
  isLoading: false,

  isCreateShipmentOpen: false,
  isTrackShipmentOpen: false,
  isNewUserOpen: false,
  isTemplateGalleryOpen: false,
  isDocumentEditorOpen: false,
  isMobileSidebarOpen: false,
  selectedTemplate: null,

  activeTabExportDocs: 'my-docs',
  activeTabInventory: 'items',
  activeTabSettings: 'account',

  inputTokens: 3000,
  outputTokens: 1400,
  tokenSpendHistory: [
    { date: 'Mon', spend: 200 },
    { date: 'Tue', spend: 400 },
    { date: 'Wed', spend: 150 },
    { date: 'Thu', spend: 600 },
    { date: 'Fri', spend: 350 },
    { date: 'Sat', spend: 800 },
    { date: 'Sun', spend: 500 },
  ],

  globalSearchQuery: '',

  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),
  setCreateShipmentOpen: (open) => set({ isCreateShipmentOpen: open }),
  setTrackShipmentOpen: (open) => set({ isTrackShipmentOpen: open }),
  setNewUserOpen: (open) => set({ isNewUserOpen: open }),
  setTemplateGalleryOpen: (open) => set({ isTemplateGalleryOpen: open }),
  setDocumentEditorOpen: (open) => set({ isDocumentEditorOpen: open }),
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),

  setActiveTabExportDocs: (tab) => set({ activeTabExportDocs: tab }),
  setActiveTabInventory: (tab) => set({ activeTabInventory: tab }),
  setActiveTabSettings: (tab) => set({ activeTabSettings: tab }),

  fetchShipments: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/shipments');
      if (res.ok) {
        const data = await res.json();
        set({ shipments: data });
      }
    } catch (e) {
      console.error('Error fetching shipments:', e);
    } finally {
      set({ isLoading: false });
    }
  },

  addShipment: async (shipment) => {
    const res = await fetch('/api/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shipment),
    });
    if (!res.ok) {
      throw new Error('Failed to create shipment');
    }
    const newShipment = await res.json();
    set((state) => ({ shipments: [newShipment, ...state.shipments] }));
    return newShipment;
  },

  updateShipmentStatus: async (id, status) => {
    const res = await fetch(`/api/shipments?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      set((state) => ({
        shipments: state.shipments.map((s) => (s.id === id ? { ...s, status } : s)),
      }));
    }
  },

  fetchDocuments: async () => {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        set({ documents: data });
      }
    } catch (e) {
      console.error('Error fetching documents:', e);
    }
  },

  addDocument: async (doc) => {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    if (!res.ok) {
      throw new Error('Failed to create document');
    }
    const newDoc = await res.json();
    set((state) => ({ documents: [newDoc, ...state.documents] }));
    return newDoc;
  },

  fetchUsers: async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        set({ users: data });
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  },

  addUser: async (user) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      throw new Error('Failed to create user');
    }
    const newUser = await res.json();
    set((state) => ({ users: [...state.users, newUser] }));
    return newUser;
  },

  fetchProducts: async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        set({ products: data });
      }
    } catch (e) {
      console.error('Error fetching products:', e);
    }
  },

  addProduct: async (product) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      throw new Error('Failed to create product');
    }
    const newProduct = await res.json();
    set((state) => ({ products: [newProduct, ...state.products] }));
    return newProduct;
  },

  fetchContacts: async () => {
    try {
      const res = await fetch('/api/contacts');
      if (res.ok) {
        const data = await res.json();
        set({ contacts: data });
      }
    } catch (e) {
      console.error('Error fetching contacts:', e);
    }
  },

  addContact: async (contact) => {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!res.ok) {
      throw new Error('Failed to create contact');
    }
    const newContact = await res.json();
    set((state) => ({ contacts: [newContact, ...state.contacts] }));
    return newContact;
  },

  fetchPackages: async () => {
    try {
      const res = await fetch('/api/packages');
      if (res.ok) {
        const data = await res.json();
        set({ packages: data });
      }
    } catch (e) {
      console.error('Error fetching packages:', e);
    }
  },

  addPackage: async (pkg) => {
    const res = await fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pkg),
    });
    if (!res.ok) {
      throw new Error('Failed to create package spec');
    }
    const newPkg = await res.json();
    set((state) => ({ packages: [newPkg, ...state.packages] }));
    return newPkg;
  },

  fetchInventoryItems: async () => {
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) {
        const data = await res.json();
        set({ inventoryItems: data });
      }
    } catch (e) {
      console.error('Error fetching inventory items:', e);
    }
  },

  incrementTokens: (input, output) => {
    set((state) => {
      const newInput = state.inputTokens + input;
      const newOutput = state.outputTokens + output;
      const history = [...state.tokenSpendHistory];
      if (history.length > 0) {
        history[history.length - 1].spend += Math.round((input + output) / 10);
      }
      return {
        inputTokens: newInput,
        outputTokens: newOutput,
        tokenSpendHistory: history,
      };
    });
  },
}));
