'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import GuestView from '../components/home/GuestView';
import CustomerView from '../components/home/CustomerView';
import ProviderView from '../components/home/ProviderView';
import AdminView from '../components/home/AdminView';
import BecomeProviderModal from '../components/common/BecomeProviderModal';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [isBecomeProviderOpen, setIsBecomeProviderOpen] = useState(false);
  const userRole = (session?.user as { role?: string })?.role;

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Admin view
  if (status === 'authenticated' && userRole === 'ADMIN') {
    return <AdminView />;
  }

  // Provider view
  if (status === 'authenticated' && userRole === 'PROVIDER') {
    return <ProviderView />;
  }

  // Customer view
  if (status === 'authenticated' && userRole === 'CUSTOMER') {
    return (
      <>
        <CustomerView onOpenBecomeProvider={() => setIsBecomeProviderOpen(true)} />
        <BecomeProviderModal 
          isOpen={isBecomeProviderOpen} 
          onClose={() => setIsBecomeProviderOpen(false)} 
        />
      </>
    );
  }

  // Guest view
  return (
    <>
      <GuestView onOpenBecomeProvider={() => setIsBecomeProviderOpen(true)} />
      <BecomeProviderModal 
        isOpen={isBecomeProviderOpen} 
        onClose={() => setIsBecomeProviderOpen(false)} 
      />
    </>
  );
}
