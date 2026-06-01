import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const reviews = await prisma.review.findMany();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { providerId, customerName, rating, commentEn, commentHi } = body;

    if (!providerId || !customerName || rating === undefined) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 });
    }

    const reviewId = 'r_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
    const date = new Date().toISOString().split('T')[0];

    // 1. Create the new review in the SQLite database
    const newReview = await prisma.review.create({
      data: {
        id: reviewId,
        providerId,
        customerName,
        rating: Number(rating),
        commentEn: commentEn || '',
        commentHi: commentHi || commentEn || '',
        date,
      },
    });

    // 2. Fetch all reviews for this provider to compute dynamic metrics
    const providerReviews = await prisma.review.findMany({
      where: { providerId },
    });

    const reviewsCount = providerReviews.length;
    const totalRating = providerReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = Math.round((totalRating / reviewsCount) * 10) / 10; // Round to 1 decimal place

    // 3. Update the Provider record with new stats in Prisma
    await prisma.provider.update({
      where: { id: providerId },
      data: {
        rating: averageRating,
        reviewsCount,
      },
    });

    return NextResponse.json({
      success: true,
      review: newReview,
      providerStats: {
        rating: averageRating,
        reviewsCount,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to submit review' }, { status: 500 });
  }
}
