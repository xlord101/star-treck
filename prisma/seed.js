/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create User
  const user = await prisma.user.upsert({
    where: { email: 'shree@freightnaut.com' },
    update: {},
    create: {
      name: 'Shree Krishna',
      email: 'shree@freightnaut.com',
      role: 'Admin',
    },
  });
  console.log('User created/found:', user);

  // Create Shipments
  const shipments = [
    {
      shipment_name: 'Milk Powder - UAE Consignment',
      shipment_number: 'EXP-2026-001',
      mode_of_transport: 'SEA',
      type_of_shipment: 'FCL',
      status: 'Draft',
    },
    {
      shipment_name: 'milk',
      shipment_number: 'EXP-2026-002',
      mode_of_transport: 'ROAD',
      type_of_shipment: 'LCL',
      status: 'Draft',
    },
  ];

  for (const s of shipments) {
    await prisma.shipment.upsert({
      where: { shipment_number: s.shipment_number },
      update: {},
      create: s,
    });
  }

  // Create initial Document
  await prisma.document.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      doc_name: 'Commercial Invoice - UAE Consignment.pdf',
      doc_type: 'Commercial Invoice',
      linked_shipment: 'Milk Powder - UAE Consignment',
      created_by: 'Shree Krishna',
    },
  });

  // Create Products
  const products = [
    { name: 'Premium Milk Powder', sku: 'SKU-MP-001', hs_code: '0402.10', price: 4.5, weight: 25.0 },
    { name: 'Whole Milk Powder', sku: 'SKU-MP-002', hs_code: '0402.20', price: 4.8, weight: 25.0 },
    { name: 'Skimmed Milk Powder', sku: 'SKU-MP-003', hs_code: '0402.10.10', price: 4.2, weight: 20.0 }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: p,
    });
  }

  // Create Contacts (Buyers/Consignees)
  const contacts = [
    { name: 'UAE Logistics Corp', email: 'info@uaelogistics.ae', role: 'Buyer', address: 'Plot 41-B, Jebel Ali Free Zone, Dubai, UAE' },
    { name: 'Al-Mansoori Distributors', email: 'orders@almansoori.co.ae', role: 'Consignee', address: 'Sheikh Zayed Rd, Abu Dhabi, UAE' },
    { name: 'Mumbai Customs House Brokerage', email: 'mumbai@customsbroker.in', role: 'Broker', address: 'Fort, Mumbai, India' }
  ];

  for (const c of contacts) {
    await prisma.contact.upsert({
      where: { email: c.email },
      update: {},
      create: c,
    });
  }

  // Create Packages
  const packages = [
    { name: 'Standard Euro Pallet', length: 1200.0, width: 800.0, height: 144.0, max_weight: 1500.0 },
    { name: 'Heavy Carton Box', length: 600.0, width: 400.0, height: 400.0, max_weight: 50.0 }
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { id: pkg.name === 'Standard Euro Pallet' ? 1 : 2 },
      update: {},
      create: pkg,
    });
  }

  // Create Inventory Items
  const inventory = [
    { name: 'Premium Milk Powder', sku: 'SKU-MP-001', warehouse: 'Mumbai Central (WH1)', stock: 850, unit_value: 4.5, status: 'In Stock' },
    { name: 'Whole Milk Powder', sku: 'SKU-MP-002', warehouse: 'Mumbai Central (WH1)', stock: 380, unit_value: 4.8, status: 'In Stock' },
    { name: 'Skimmed Milk Powder', sku: 'SKU-MP-003', warehouse: 'Delhi Okhla (WH2)', stock: 10, unit_value: 4.2, status: 'Low Stock' }
  ];

  for (const inv of inventory) {
    await prisma.inventoryItem.upsert({
      where: { id: inv.sku === 'SKU-MP-001' ? 1 : (inv.sku === 'SKU-MP-002' ? 2 : 3) },
      update: {},
      create: inv,
    });
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
