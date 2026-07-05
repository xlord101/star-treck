import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('API Error contacts GET:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, role, address } = body;

    if (!name || !email || !role || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newContact = await prisma.contact.create({
      data: {
        name,
        email,
        role,
        address,
      },
    });

    return NextResponse.json(newContact);
  } catch (error: unknown) {
    console.error('API Error contacts POST:', error);
    if (error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}
