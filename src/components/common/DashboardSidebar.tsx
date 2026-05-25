'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

interface DashboardSidebarProps {
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  userName: string;
  userSubtitle: string;
  avatarUrl?: string;
  links: SidebarLink[];
  bottomLinks?: SidebarLink[];
}

export default function DashboardSidebar({
  role,
  userName,
  userSubtitle,
  avatarUrl,
  links,
  bottomLinks
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const roleColors = {
    CUSTOMER: { accent: 'bg-blue-600', ring: 'ring-blue-500/20', label: 'Customer', tagBg: 'bg-blue-50 text-blue-700', iconBg: 'bg-blue-100 text-blue-700' },
    PROVIDER: { accent: 'bg-emerald-600', ring: 'ring-emerald-500/20', label: 'Provider', tagBg: 'bg-emerald-50 text-emerald-700', iconBg: 'bg-emerald-100 text-emerald-700' },
    ADMIN: { accent: 'bg-slate-900', ring: 'ring-slate-500/20', label: 'Admin', tagBg: 'bg-red-50 text-red-700', iconBg: 'bg-red-100 text-red-700' },
  };

  const colors = roleColors[role];

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
        
        {/* Brand header */}
        <div className={`${colors.accent} px-5 py-5`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-extrabold text-sm block leading-tight">
                Aura<span className="opacity-80">Serve</span>
              </span>
              <span className="text-white/60 text-[9px] font-bold uppercase tracking-wider">{colors.label} Portal</span>
            </div>
          </div>
        </div>

        {/* User profile card */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName} className="w-10 h-10 rounded-full object-cover border-2 border-slate-200" />
            ) : (
              <div className={`w-10 h-10 rounded-full ${colors.iconBg} flex items-center justify-center font-bold text-sm`}>
                {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="block text-sm font-extrabold text-slate-900 truncate">{userName}</span>
              <span className="block text-[10px] text-slate-400 font-medium truncate">{userSubtitle}</span>
            </div>
          </div>
          <span className={`mt-3 inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${colors.tagBg}`}>
            {colors.label} Account
          </span>
        </div>

        {/* Navigation links */}
        <nav className="px-3 py-3 space-y-0.5">
          {links.map((link, idx) => {
            const isTabMatch = link.href.includes(`tab=${activeTab}`) || 
              (activeTab === 'overview' && !link.href.includes('tab='));
            const isActive = isTabMatch;
            return (
              <Link
                key={`${link.label}-${idx}`}
                href={link.href}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? `${colors.accent} text-white shadow-sm`
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white/80' : 'text-slate-400'}>{link.icon}</span>
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : `${link.badgeColor || 'bg-slate-100 text-slate-500'}`
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom links (Settings, Logout etc.) */}
        {bottomLinks && bottomLinks.length > 0 && (
          <div className="px-3 py-3 border-t border-slate-100 space-y-0.5">
            {bottomLinks.map((link, idx) => {
              const isActive = link.href.includes(`tab=${activeTab}`);
              return (
                <Link
                  key={`${link.label}-${idx}`}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? `${colors.accent} text-white shadow-sm`
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
