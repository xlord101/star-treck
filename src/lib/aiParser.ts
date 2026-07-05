export interface ParsedShipment {
  type_of_transaction: 'Export' | 'Import';
  mode_of_transport: 'SEA' | 'AIR' | 'ROAD' | 'RAIL';
  type_of_shipment: 'LCL' | 'FCL';
  shipment_name: string;
  shipment_number: string;
}

export function parseAIShipmentPrompt(text: string): ParsedShipment {
  const lowerText = text.toLowerCase();

  // 1. Transaction Type
  let type_of_transaction: 'Export' | 'Import' = 'Export';
  if (lowerText.includes('import') || lowerText.includes('inbound') || lowerText.includes('receive')) {
    type_of_transaction = 'Import';
  }

  // 2. Mode of Transport
  let mode_of_transport: 'SEA' | 'AIR' | 'ROAD' | 'RAIL' = 'SEA';
  if (lowerText.includes('air') || lowerText.includes('plane') || lowerText.includes('flight')) {
    mode_of_transport = 'AIR';
  } else if (lowerText.includes('road') || lowerText.includes('truck') || lowerText.includes('highway') || lowerText.includes('car')) {
    mode_of_transport = 'ROAD';
  } else if (lowerText.includes('rail') || lowerText.includes('train')) {
    mode_of_transport = 'RAIL';
  } else if (lowerText.includes('sea') || lowerText.includes('ocean') || lowerText.includes('ship') || lowerText.includes('vessel')) {
    mode_of_transport = 'SEA';
  }

  // 3. Type of Shipment
  let type_of_shipment: 'LCL' | 'FCL' = 'FCL';
  if (lowerText.includes('lcl') || lowerText.includes('less than container') || lowerText.includes('groupage')) {
    type_of_shipment = 'LCL';
  } else if (lowerText.includes('fcl') || lowerText.includes('full container') || lowerText.includes('fcl shipment')) {
    type_of_shipment = 'FCL';
  }

  // 4. Shipment Name Extraction
  let shipment_name = '';
  // Try patterns like: named "name", named 'name', named [name], named name
  const nameQuotesMatch = text.match(/named\s+["']([^"']+)["']/i) || 
                          text.match(/called\s+["']([^"']+)["']/i) ||
                          text.match(/consignment\s+["']([^"']+)["']/i);
  if (nameQuotesMatch && nameQuotesMatch[1]) {
    shipment_name = nameQuotesMatch[1].trim();
  } else {
    // Try to match "named X" or "called X" where X is a few words
    const nameMatch = text.match(/named\s+([A-Za-z0-9\s\-]{3,30})(?=\s+(?:with|by|at|for|to|on|$))/i) ||
                      text.match(/called\s+([A-Za-z0-9\s\-]{3,30})(?=\s+(?:with|by|at|for|to|on|$))/i) ||
                      text.match(/shipment\s+of\s+([A-Za-z0-9\s\-]{3,30})(?=\s+(?:with|by|at|for|to|on|$))/i);
    if (nameMatch && nameMatch[1]) {
      shipment_name = nameMatch[1].trim();
    }
  }

  if (!shipment_name) {
    // Fallbacks
    if (lowerText.includes('milk')) {
      shipment_name = 'Milk Powder Consignment';
    } else if (lowerText.includes('electronics')) {
      shipment_name = 'Electronics Shipping Cargo';
    } else if (lowerText.includes('furniture')) {
      shipment_name = 'Furniture Export Unit';
    } else {
      shipment_name = 'New Cargo Shipment';
    }
  }

  // 5. Shipment Number Extraction
  let shipment_number = '';
  // Match things like EXP-1234, IMP-2026-99, EXP202611, or arbitrary code
  const numMatch = text.match(/\b([A-Z]{3,4}-?[0-9]{3,4}-?[0-9]{0,4})\b/i) ||
                   text.match(/number\s+([A-Za-z0-9\-]{4,15})\b/i) ||
                   text.match(/code\s+([A-Za-z0-9\-]{4,15})\b/i);
  
  if (numMatch && numMatch[1]) {
    shipment_number = numMatch[1].toUpperCase().trim();
  } else {
    // Generate a default code
    const prefix = type_of_transaction === 'Export' ? 'EXP' : 'IMP';
    const rand = Math.floor(10000 + Math.random() * 90000);
    shipment_number = `${prefix}-2026-${rand}`;
  }

  return {
    type_of_transaction,
    mode_of_transport,
    type_of_shipment,
    shipment_name,
    shipment_number,
  };
}
