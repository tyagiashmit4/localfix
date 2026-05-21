import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Fields can be updated individually
    const updateData: Prisma.ProviderUpdateInput = {};
    
    if (body.pricePerHr !== undefined) updateData.pricePerHr = Number(body.pricePerHr);
    if (body.experience !== undefined) updateData.experience = Number(body.experience);
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.whatsapp !== undefined) updateData.whatsapp = body.whatsapp;
    if (body.bioEn !== undefined) updateData.bioEn = body.bioEn;
    if (body.bioHi !== undefined) updateData.bioHi = body.bioHi;
    if (body.city !== undefined) updateData.city = body.city;
    
    if (body.areas !== undefined) {
      updateData.areas = typeof body.areas === 'string' ? body.areas : JSON.stringify(body.areas);
    }
    if (body.certificationsEn !== undefined) {
      updateData.certificationsEn = typeof body.certificationsEn === 'string' ? body.certificationsEn : JSON.stringify(body.certificationsEn);
    }
    if (body.certificationsHi !== undefined) {
      updateData.certificationsHi = typeof body.certificationsHi === 'string' ? body.certificationsHi : JSON.stringify(body.certificationsHi);
    }
    if (body.gallery !== undefined) {
      updateData.gallery = typeof body.gallery === 'string' ? body.gallery : JSON.stringify(body.gallery);
    }
    if (body.aadhaarVerified !== undefined) {
      updateData.aadhaarVerified = Boolean(body.aadhaarVerified);
    }
    if (body.completedJobs !== undefined) {
      updateData.completedJobs = Number(body.completedJobs);
    }

    const updatedProvider = await prisma.provider.update({
      where: { id },
      data: updateData,
    });

    // Parse JSON arrays back before returning
    const formattedProvider = {
      ...updatedProvider,
      certificationsEn: JSON.parse(updatedProvider.certificationsEn),
      certificationsHi: JSON.parse(updatedProvider.certificationsHi),
      areas: JSON.parse(updatedProvider.areas),
      gallery: JSON.parse(updatedProvider.gallery),
    };

    return NextResponse.json(formattedProvider);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`Error updating provider:`, err);
    return NextResponse.json({ error: err.message || 'Failed to update provider' }, { status: 500 });
  }
}
