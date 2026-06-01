import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

// Initialize Razorpay SDK
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export async function POST(req: Request) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, currency = 'INR', receipt } = body;

    // Validate amount
    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Amount is required and must be at least 100 paise' }, { status: 400 });
    }

    const orderOptions = {
      amount: amount, // Amount should already be in paise
      currency,
      receipt: receipt || `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
