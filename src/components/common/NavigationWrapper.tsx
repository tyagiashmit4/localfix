'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { useStore } from '../../store/useStore';
import { useEffect } from 'react';

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSOS = pathname?.startsWith('/sos');
  const isLogin = pathname?.startsWith('/login');
  const isMinimalLayout = isSOS || isLogin;
  const fetchInitialData = useStore((state) => state.fetchInitialData);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <>
      {!isMinimalLayout && <Navbar />}
      <main className={isMinimalLayout ? "flex-1 w-full bg-slate-50" : "max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex-1"}>
        {children}
      </main>
      {!isMinimalLayout && <Footer />}
    </>
  );
}
