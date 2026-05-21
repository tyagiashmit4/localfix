'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-slate-50">
      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg animate-pulse">
        <ShieldCheck className="w-6 h-6" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
          Redirecting to your hub...
        </span>
      </div>
    </div>
  );
}
