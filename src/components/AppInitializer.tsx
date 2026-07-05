'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const { 
    fetchShipments, 
    fetchDocuments, 
    fetchUsers,
    fetchProducts,
    fetchContacts,
    fetchPackages,
    fetchInventoryItems
  } = useStore();

  useEffect(() => {
    // Initial fetch
    fetchShipments();
    fetchDocuments();
    fetchUsers();
    fetchProducts();
    fetchContacts();
    fetchPackages();
    fetchInventoryItems();
  }, [
    fetchShipments, 
    fetchDocuments, 
    fetchUsers, 
    fetchProducts, 
    fetchContacts, 
    fetchPackages, 
    fetchInventoryItems
  ]);

  return <>{children}</>;
}
