import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/options';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email;
    const userId = (session.user as { id?: string }).id;

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let parsedNotifications = [];
    try {
      if (user.notifications) {
        parsedNotifications = JSON.parse(user.notifications);
      }
    } catch (e) {
      console.error('Failed to parse user notifications JSON', e);
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      walletBalance: user.walletBalance,
      notifications: parsedNotifications,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const email = session.user.email;
    const userId = (session.user as { id?: string }).id;

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const dataToUpdate: {
      name?: string;
      email?: string;
      phone?: string;
      walletBalance?: number;
      notifications?: string;
    } = {};

    if (body.name !== undefined) dataToUpdate.name = body.name;
    if (body.email !== undefined) dataToUpdate.email = body.email;
    if (body.phone !== undefined) dataToUpdate.phone = body.phone;
    if (body.walletBalance !== undefined) {
      dataToUpdate.walletBalance = parseFloat(body.walletBalance);
    }
    if (body.notifications !== undefined) {
      dataToUpdate.notifications = JSON.stringify(body.notifications);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate,
    });

    let parsedNotifications = [];
    try {
      if (updatedUser.notifications) {
        parsedNotifications = JSON.parse(updatedUser.notifications);
      }
    } catch (e) {
      console.error('Failed to parse updated user notifications JSON', e);
    }

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      walletBalance: updatedUser.walletBalance,
      notifications: parsedNotifications,
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      const target = (error.meta?.target as string[]) || [];
      const field = target.includes('email') ? 'Email' : target.includes('phone') ? 'Phone number' : 'Field';
      return NextResponse.json({ error: `${field} is already in use by another account.` }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
