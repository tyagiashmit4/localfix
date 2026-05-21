import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { phone, otp, generatedOtp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone number and verification code are required' }, { status: 400 });
    }

    // Check if we are in live/database verification mode
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    const isTwilioConfigured = !!(twilioSid && twilioAuthToken && twilioPhone);

    // If twilio is configured, we MUST verify using the database tokens
    if (isTwilioConfigured) {
      const tokenRecord = await prisma.verificationToken.findFirst({
        where: {
          identifier: phone,
          token: otp,
        },
      });

      if (!tokenRecord) {
        return NextResponse.json({ error: 'Incorrect verification code. Please check and try again.' }, { status: 400 });
      }

      if (new Date() > tokenRecord.expires) {
        // Delete expired token
        await prisma.verificationToken.delete({
          where: { token: tokenRecord.token },
        }).catch(() => {});

        return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
      }

      // Successful verification - delete token so it cannot be reused
      await prisma.verificationToken.delete({
        where: { token: tokenRecord.token },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully.',
      });
    } else {
      // Fallback/simulated mode
      // If client supplied generatedOtp, verify it. Otherwise fallback to database token.
      if (generatedOtp) {
        if (otp === generatedOtp) {
          return NextResponse.json({
            success: true,
            message: 'OTP verified successfully (simulated).',
          });
        }
      }

      // Check DB token as well in mock mode to support database-level testing
      const tokenRecord = await prisma.verificationToken.findFirst({
        where: {
          identifier: phone,
          token: otp,
        },
      });

      if (tokenRecord && new Date() <= tokenRecord.expires) {
        await prisma.verificationToken.delete({
          where: { token: tokenRecord.token },
        }).catch(() => {});

        return NextResponse.json({
          success: true,
          message: 'OTP verified successfully.',
        });
      }

      return NextResponse.json({ error: 'Incorrect verification code. Please check and try again.' }, { status: 400 });
    }
  } catch (error) {
    console.error('OTP Verification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
