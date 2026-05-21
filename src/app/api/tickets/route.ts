import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tickets = await prisma.supportTicket.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTicket = await prisma.supportTicket.create({
      data: {
        id: body.id,
        subjectEn: body.subjectEn,
        subjectHi: body.subjectHi,
        status: body.status || 'open',
        category: body.category,
        date: body.date,
      },
    });
    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
