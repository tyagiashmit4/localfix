import { NextResponse } from 'next/server';
import { SERVICE_CATEGORIES } from '../../../app/data';

export async function GET() {
  try {
    return NextResponse.json(SERVICE_CATEGORIES);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
