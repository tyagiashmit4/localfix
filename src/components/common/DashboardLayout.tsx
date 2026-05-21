'use client';

import React from 'react';

interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardLayout({ sidebar, children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-2">
      {sidebar}
      <div className="flex-1 min-w-0 space-y-6">
        {children}
      </div>
    </div>
  );
}
