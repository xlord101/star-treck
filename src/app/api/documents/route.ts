import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const docs = await prisma.document.findMany({
      orderBy: { updated_at: 'desc' },
    });
    return NextResponse.json(docs);
  } catch (error) {
    console.error('API Error documents GET:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doc_name, doc_type, linked_shipment, created_by } = body;

    if (!doc_name || !doc_type || !created_by) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newDoc = await prisma.document.create({
      data: {
        doc_name,
        doc_type,
        linked_shipment,
        created_by,
      },
    });

    return NextResponse.json(newDoc);
  } catch (error) {
    console.error('API Error documents POST:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
