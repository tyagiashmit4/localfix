import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Fast2SMS API URL
const FAST2SMS_URL = 'https://www.fast2sms.com/dev/bulkV2';

export async function POST(req: Request) {
  try {
    const { phone, email } = await req.json();

    if (!phone && !email) {
      return NextResponse.json({ error: 'Phone or email is required' }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in DB, expires in 5 minutes
    await prisma.otpVerification.create({
      data: {
        phone: phone || null,
        email: email || null,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      }
    });

    let phoneSuccess = false;
    let emailSuccess = false;

    // Send SMS via Fast2SMS
    if (phone && process.env.FAST2SMS_API_KEY) {
      try {
        const response = await fetch(FAST2SMS_URL, {
          method: 'POST',
          headers: {
            'authorization': process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'q',
            message: `Your LocalFix verification code is ${otp}. It will expire in 5 minutes.`,
            language: 'english',
            flash: 0,
            numbers: phone,
          })
        });
        
        const data = await response.json();
        if (data.return) {
          phoneSuccess = true;
        } else {
          console.error('Fast2SMS Error:', data);
        }
      } catch (smsError) {
        console.error('Failed to send SMS:', smsError);
      }
    }

    // Send Email via Nodemailer (Gmail App Password)
    if (email && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: `"LocalFix" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: 'Your LocalFix Verification Code',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">LocalFix Verification</h2>
              <p>Your one-time password (OTP) to register is:</p>
              <div style="background-color: #f1f5f9; padding: 15px; border-radius: 10px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; color: #0f172a;">
                ${otp}
              </div>
              <p style="color: #64748b; font-size: 12px; margin-top: 20px;">This code will expire in 5 minutes. Please do not share this code with anyone.</p>
            </div>
          `,
        });
        emailSuccess = true;
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }

    // Since we want this to work even without keys during dev, we'll return the OTP in the response for localhost/dev
    // In production, we would NOT return the OTP in the response.
    const isDev = process.env.NODE_ENV === 'development';
    
    return NextResponse.json({
      message: 'OTP sent successfully',
      phoneSuccess,
      emailSuccess,
      // For development purposes, return the OTP if keys are missing
      devOtp: isDev && (!phoneSuccess && !emailSuccess) ? otp : undefined
    });

  } catch (error) {
    console.error('Error in send-otp:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
