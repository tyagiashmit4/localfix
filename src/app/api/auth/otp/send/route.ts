import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { phone, purpose } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Check user existence based on purpose
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (purpose === 'login' || purpose === 'reset') {
      if (!user) {
        return NextResponse.json({ error: 'No account found with this phone number.' }, { status: 404 });
      }
    } else if (purpose === 'signup') {
      if (user) {
        return NextResponse.json({ error: 'Phone number already registered.' }, { status: 400 });
      }
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if Twilio is configured
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    const isTwilioConfigured = !!(twilioSid && twilioAuthToken && twilioPhone);

    if (isTwilioConfigured) {
      // Store token securely in Prisma DB with a 5-minute expiration
      const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
      
      // Delete old verification tokens for this phone number
      await prisma.verificationToken.deleteMany({
        where: { identifier: phone }
      }).catch(() => {});

      await prisma.verificationToken.create({
        data: {
          identifier: phone,
          token: otp,
          expires
        }
      });

      // Construct request to Twilio REST API
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const basicAuth = btoa(`${twilioSid}:${twilioAuthToken}`);
      
      const body = new URLSearchParams({
        To: phone,
        From: twilioPhone,
        Body: `Your AuraServe verification code is: ${otp}. Do not share this code.`,
      });

      const response = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Twilio Send SMS Error response:', errorData);
        throw new Error('Twilio SMS dispatch failed.');
      }

      return NextResponse.json({
        success: true,
        message: 'A verification code has been sent to your phone number.',
      });
    } else {
      // Dev/Fallback simulation mode
      // Store token in database anyway so verification endpoint can also use it
      const expires = new Date(Date.now() + 5 * 60 * 1000);
      await prisma.verificationToken.deleteMany({
        where: { identifier: phone }
      }).catch(() => {});

      await prisma.verificationToken.create({
        data: {
          identifier: phone,
          token: otp,
          expires
        }
      });

      return NextResponse.json({
        success: true,
        otp,
        message: `Simulated SMS sent! Your verification code is ${otp}`,
      });
    }
  } catch (error) {
    console.error('OTP Send error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

