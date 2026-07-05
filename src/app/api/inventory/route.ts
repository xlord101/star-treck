import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('API Error inventory GET:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory items' }, { status: 500 });
  }
}
