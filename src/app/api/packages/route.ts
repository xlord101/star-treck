import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(packages);
  } catch (error) {
    console.error('API Error packages GET:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, length, width, height, max_weight } = body;

    if (!name || length === undefined || width === undefined || height === undefined || max_weight === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPkg = await prisma.package.create({
      data: {
        name,
        length: parseFloat(length),
        width: parseFloat(width),
        height: parseFloat(height),
        max_weight: parseFloat(max_weight),
      },
    });

    return NextResponse.json(newPkg);
  } catch (error) {
    console.error('API Error packages POST:', error);
    return NextResponse.json({ error: 'Failed to create package spec' }, { status: 500 });
  }
}
