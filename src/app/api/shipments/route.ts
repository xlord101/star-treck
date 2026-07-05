import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const shipments = await prisma.shipment.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(shipments);
  } catch (error) {
    console.error('API Error shipments GET:', error);
    return NextResponse.json({ error: 'Failed to fetch shipments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shipment_name, shipment_number, mode_of_transport, type_of_shipment, status } = body;

    if (!shipment_name || !shipment_number || !mode_of_transport || !type_of_shipment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newShipment = await prisma.shipment.create({
      data: {
        shipment_name,
        shipment_number,
        mode_of_transport,
        type_of_shipment,
        status: status || 'Draft',
      },
    });

    return NextResponse.json(newShipment);
  } catch (error) {
    console.error('API Error shipments POST:', error);
    // Handle unique constraint check
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Shipment number already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idStr = searchParams.get('id');
    if (!idStr) {
      return NextResponse.json({ error: 'Missing shipment ID' }, { status: 400 });
    }
    const id = parseInt(idStr);

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Missing status field' }, { status: 400 });
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedShipment);
  } catch (error) {
    console.error('API Error shipments PATCH:', error);
    return NextResponse.json({ error: 'Failed to update shipment status' }, { status: 500 });
  }
}
