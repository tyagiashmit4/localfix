import { NextResponse } from 'next/server';
import { triggerPusherEvent } from '@/lib/pusher';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, senderId, senderName, textEn, textHi } = body;

    if (!bookingId || !senderId || !senderName || (!textEn && !textHi)) {
      return NextResponse.json({ error: 'Missing required chat parameters' }, { status: 400 });
    }

    const payload = {
      id: 'msg_' + Date.now() + '_' + Math.floor(Math.random() * 100000),
      bookingId,
      senderId,
      senderName,
      textEn: textEn || '',
      textHi: textHi || textEn || '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Broadcast the chat message in real time to the booking-specific Pusher channel
    const pusherDispatched = await triggerPusherEvent(`chat-${bookingId}`, 'message', payload);

    return NextResponse.json({
      success: true,
      message: 'Message dispatched successfully.',
      dispatchedLive: pusherDispatched,
      data: payload,
    });
  } catch (error: any) {
    console.error('Error dispatching chat message:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
