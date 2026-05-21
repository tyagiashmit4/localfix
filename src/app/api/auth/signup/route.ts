import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, phone, password, isSocial } = await request.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    // Check if phone already exists
    const existingPhone = await prisma.user.findUnique({
      where: { phone },
    });

    if (isSocial) {
      if (existingEmail || existingPhone) {
        const existingUser = existingEmail || existingPhone;
        return NextResponse.json({
          success: true,
          message: 'Social user already registered. Proceeding to sign in.',
          user: {
            id: existingUser?.id,
            name: existingUser?.name,
            email: existingUser?.email,
            phone: existingUser?.phone,
            role: existingUser?.role,
          },
        });
      }
    } else {
      if (existingEmail) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }
      if (existingPhone) {
        return NextResponse.json({ error: 'Phone number already registered' }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'CUSTOMER', // Default role
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful! You can now log in.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
