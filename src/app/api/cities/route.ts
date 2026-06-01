import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cities = await prisma.city.findMany();
    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { nameEn, nameHi } = body;

    if (!nameEn || !nameHi) {
      return NextResponse.json({ error: 'Missing nameEn or nameHi' }, { status: 400 });
    }

    const cityId = nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    const newCity = await prisma.city.create({
      data: {
        id: cityId,
        nameEn,
        nameHi,
      }
    });

    return NextResponse.json(newCity, { status: 201 });
  } catch (error) {
    console.error('Error adding city:', error);
    return NextResponse.json({ error: 'Failed to add city' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing city id' }, { status: 400 });
    }

    await prisma.city.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'City deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting city:', error);
    return NextResponse.json({ error: 'Failed to delete city' }, { status: 500 });
  }
}
