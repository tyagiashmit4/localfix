import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { triggerPusherEvent } from '@/lib/pusher';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // We expect the frontend to pass the complete booking object or the necessary fields
    const newBooking = await prisma.booking.create({
      data: {
        id: body.id,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerAddress: body.customerAddress,
        city: body.city,
        serviceCategory: body.serviceCategory,
        providerId: body.providerId,
        providerName: body.providerName,
        providerAvatar: body.providerAvatar,
        date: body.date,
        timeSlot: body.timeSlot,
        status: body.status || 'pending',
        price: body.price,
        notes: body.notes,
        appliedPromo: body.appliedPromo,
        paymentStatus: body.paymentStatus || 'pending',
      },
    });

    // Broadcast live new booking event via Pusher for real-time provider dispatches
    await triggerPusherEvent('bookings', 'new-booking', newBooking);

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

