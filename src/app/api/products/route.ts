import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error products GET:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, sku, hs_code, price, weight } = body;

    if (!name || !sku || !hs_code || price === undefined || weight === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        sku,
        hs_code,
        price: parseFloat(price),
        weight: parseFloat(weight),
      },
    });

    return NextResponse.json(newProduct);
  } catch (error: unknown) {
    console.error('API Error products POST:', error);
    if (error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'SKU already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
