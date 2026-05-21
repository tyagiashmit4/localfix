import { NextResponse } from 'next/server';
import { CITIES } from '../../../app/data';

export async function GET() {
  try {
    return NextResponse.json(CITIES);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}
