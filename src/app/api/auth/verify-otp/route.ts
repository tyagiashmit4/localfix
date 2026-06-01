import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { phone, email, otp } = await req.json();

    if (!otp) {
      return NextResponse.json({ error: 'OTP is required' }, { status: 400 });
    }
    if (!phone && !email) {
      return NextResponse.json({ error: 'Phone or Email is required' }, { status: 400 });
    }

    // Find the latest OTP record
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        OR: [
          { phone: phone || undefined },
          { email: email || undefined }
        ],
        otp,
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    // Mark as verified by deleting the record
    await prisma.otpVerification.delete({
      where: { id: otpRecord.id }
    });

    return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
