import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...body,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error(`Error updating booking ${await params.then(p => p.id)}:`, error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
