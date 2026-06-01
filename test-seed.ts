import { PrismaClient } from '@prisma/client';
import {
  CITIES,
  SERVICE_CATEGORIES,
  MOCK_PROVIDERS,
  INITIAL_BOOKINGS,
  MOCK_REVIEWS,
} from './src/app/data';

const prisma = new PrismaClient();

async function run() {
  try {
    console.log('Seeding database...');

    // Clear existing data
    await prisma.review.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.provider.deleteMany({});
    await prisma.serviceCategory.deleteMany({});
    await prisma.city.deleteMany({});

    // Seed Cities
    console.log('Seeding Cities...');
    for (const city of CITIES) {
      await prisma.city.create({
        data: {
          id: city.id,
          nameEn: city.nameEn,
          nameHi: city.nameHi,
        },
      });
    }

    // Seed Categories
    console.log('Seeding Categories...');
    for (const category of SERVICE_CATEGORIES) {
      await prisma.serviceCategory.create({
        data: {
          id: category.id,
          nameEn: category.nameEn,
          nameHi: category.nameHi,
          icon: category.icon,
          startingPrice: category.startingPrice,
          providerCount: category.providerCount,
          rating: category.rating,
          descriptionEn: category.descriptionEn,
          descriptionHi: category.descriptionHi,
        },
      });
    }

    // Seed Providers
    console.log('Seeding Providers...');
    for (const provider of MOCK_PROVIDERS) {
      await prisma.provider.create({
        data: {
          id: provider.id,
          name: provider.name,
          avatar: provider.avatar,
          coverImage: provider.coverImage,
          category: provider.category,
          experience: provider.experience,
          rating: provider.rating,
          reviewsCount: provider.reviewsCount,
          pricePerHr: provider.pricePerHr,
          aadhaarVerified: provider.aadhaarVerified,
          phone: provider.phone,
          whatsapp: provider.whatsapp,
          bioEn: provider.bioEn,
          bioHi: provider.bioHi,
          certificationsEn: JSON.stringify(provider.certificationsEn),
          certificationsHi: JSON.stringify(provider.certificationsHi),
          completedJobs: provider.completedJobs,
          city: provider.city,
          areas: JSON.stringify(provider.areas),
          gallery: JSON.stringify(provider.gallery),
        },
      });
    }

    // Seed Bookings
    console.log('Seeding Bookings...');
    for (const booking of INITIAL_BOOKINGS) {
      const providerExists = await prisma.provider.findUnique({
        where: { id: booking.providerId },
      });

      if (providerExists) {
        await prisma.booking.create({
          data: {
            id: booking.id,
            customerName: booking.customerName,
            customerPhone: booking.customerPhone,
            customerAddress: booking.customerAddress,
            city: booking.city,
            serviceCategory: booking.serviceCategory,
            providerId: booking.providerId,
            providerName: booking.providerName,
            providerAvatar: booking.providerAvatar,
            date: booking.date,
            timeSlot: booking.timeSlot,
            status: booking.status,
            price: booking.price,
            notes: booking.notes || '',
            appliedPromo: booking.appliedPromo || '',
            paymentStatus: booking.paymentStatus,
          },
        });
      }
    }

    // Seed Reviews
    console.log('Seeding Reviews...');
    for (const review of MOCK_REVIEWS) {
      const providerExists = await prisma.provider.findUnique({
        where: { id: review.providerId },
      });

      if (providerExists) {
        await prisma.review.create({
          data: {
            id: review.id,
            providerId: review.providerId,
            customerName: review.customerName,
            rating: review.rating,
            commentEn: review.commentEn,
            commentHi: review.commentHi,
            date: review.date,
          },
        });
      }
    }

    console.log('Database seeded successfully!');
  } catch(e) {
    console.error('ERROR:', e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
