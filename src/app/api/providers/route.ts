import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const category = searchParams.get('category');

    const where: Prisma.ProviderWhereInput = {};
    if (city) where.city = city;
    if (category) where.category = category;

    const providers = await prisma.provider.findMany({
      where,
    });

    // Parse the JSON stringified arrays back to arrays for the frontend
    const formattedProviders = providers.map((p) => ({
      ...p,
      certificationsEn: JSON.parse(p.certificationsEn),
      certificationsHi: JSON.parse(p.certificationsHi),
      areas: JSON.parse(p.areas),
      gallery: JSON.parse(p.gallery),
    }));

    return NextResponse.json(formattedProviders);
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 });
  }
}
