import { PrismaClient } from '@prisma/client';
import { MOCK_PROVIDERS, INITIAL_BOOKINGS, MOCK_REVIEWS } from '../src/app/data';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed Providers
  for (const provider of MOCK_PROVIDERS) {
    await prisma.provider.upsert({
      where: { id: provider.id },
      update: {},
      create: {
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

  // 2. Seed Bookings
  for (const booking of INITIAL_BOOKINGS) {
    await prisma.booking.upsert({
      where: { id: booking.id },
      update: {},
      create: {
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
        notes: booking.notes || null,
        appliedPromo: booking.appliedPromo || null,
        paymentStatus: booking.paymentStatus,
      },
    });
  }

  // 3. Seed Reviews
  for (const review of MOCK_REVIEWS) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: {},
      create: {
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

  // Add initial support tickets
  const tickets = [
    { id: 'T-901', subjectEn: 'Booking delay for Plumber', subjectHi: 'प्लंबर बुकिंग में देरी की समस्या', status: 'open', category: 'booking', date: '2026-05-19' },
    { id: 'T-900', subjectEn: 'Incorrect billing simulation', subjectHi: 'गलत बिलिंग सिमुलेशन', status: 'resolved', category: 'payment', date: '2026-05-15' }
  ];

  for (const ticket of tickets) {
    await prisma.supportTicket.upsert({
      where: { id: ticket.id },
      update: {},
      create: {
        id: ticket.id,
        subjectEn: ticket.subjectEn,
        subjectHi: ticket.subjectHi,
        status: ticket.status,
        category: ticket.category,
        date: ticket.date,
      },
    });
  }

  // 5. Seed Demo Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const demoUsers = [
    { email: 'admin@localfix.com', name: 'Admin User', role: 'ADMIN', phone: '9999999999' },
    { email: 'vendor@localfix.com', name: 'Ramesh Kumar Sharma', role: 'PROVIDER', phone: '8888888888' },
    { email: 'customer@localfix.com', name: 'Abhishek Tyagi', role: 'CUSTOMER', phone: '7777777777' },
  ];

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        phone: user.phone
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        password: hashedPassword,
        phone: user.phone,
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
