import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/options';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in first.' }, { status: 401 });
    }

    const {
      phone,
      whatsapp,
      category,
      experience,
      pricePerHr,
      bioEn,
      bioHi,
      areas,
      certificationsEn,
      certificationsHi,
      city,
    } = await request.json();

    if (!phone || !category || !pricePerHr || !city) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Find user in the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Update user's role to PROVIDER
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'PROVIDER' },
    });

    // 3. Create or update Provider entry
    // We map the Provider's ID to the User's ID so they are linked
    const provider = await prisma.provider.upsert({
      where: { id: user.id },
      update: {
        name: user.name || 'Provider Partner',
        category,
        experience: Number(experience) || 0,
        pricePerHr: Number(pricePerHr),
        phone,
        whatsapp: whatsapp || phone,
        bioEn: bioEn || '',
        bioHi: bioHi || bioEn || '',
        city,
        areas: JSON.stringify(areas || []),
        certificationsEn: JSON.stringify(certificationsEn || []),
        certificationsHi: JSON.stringify(certificationsHi || []),
        // keep other fields
      },
      create: {
        id: user.id,
        name: user.name || 'Provider Partner',
        avatar: user.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
        category,
        experience: Number(experience) || 0,
        rating: 5.0,
        reviewsCount: 0,
        pricePerHr: Number(pricePerHr),
        aadhaarVerified: false, // Starts as false until admin approves
        phone,
        whatsapp: whatsapp || phone,
        bioEn: bioEn || '',
        bioHi: bioHi || bioEn || '',
        completedJobs: 0,
        city,
        areas: JSON.stringify(areas || []),
        certificationsEn: JSON.stringify(certificationsEn || []),
        certificationsHi: JSON.stringify(certificationsHi || []),
        gallery: JSON.stringify([]),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully registered as a Provider!',
      provider,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Error in provider registration:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
