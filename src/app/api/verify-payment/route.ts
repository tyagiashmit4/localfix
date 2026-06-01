import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(req: Request) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing required payment verification fields' }, { status: 400 });
    }

    // Verify signature using HMAC-SHA256
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
    }

    // Signature matches, payment is verified
    return NextResponse.json({ success: true, message: 'Payment verified successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
