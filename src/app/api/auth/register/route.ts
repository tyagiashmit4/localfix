import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password, role = 'CUSTOMER' } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with 100 bonus wallet balance as per schema defaults
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        emailVerified: null,
      }
    });

    // Generate Verification Token
    const token = crypto.randomUUID();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 hours expiry

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires
      }
    });

    // Send email via nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // We can assume localhost or derive from req headers for host
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const verifyLink = `${protocol}://${host}/api/auth/verify-email?token=${token}`;

    const mailOptions = {
      from: `"LocalFix Security" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Verify your LocalFix Account',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">Welcome to LocalFix, ${name}!</h2>
          <p>Please verify your email address to activate your account and receive your ₹100 welcome bonus.</p>
          <div style="margin: 30px 0;">
            <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email Address</a>
          </div>
          <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="font-size: 11px; color: #999; word-break: break-all;">${verifyLink}</p>
          <p style="font-size: 12px; color: #666; margin-top: 20px;">This link will expire in 24 hours.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Registration successful! Please check your email to verify your account.', user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
