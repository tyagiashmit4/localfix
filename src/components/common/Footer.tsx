'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '../../store/useStore';

export default function Footer() {
  const { lang, setSelectedCity, cities, t } = useStore();

  return (
    <footer className="bg-slate-900 text-white py-12 px-4 md:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
              LF
            </div>
            <span className="text-lg font-black text-slate-100">LocalFix</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Empowering local service technicians, painters, teachers and plumbers across Tier-2 & Tier-3 cities in India. Direct, verified and completely commission free.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link href="/" className="hover:text-white transition-colors cursor-pointer">
                Marketplace Home
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-white transition-colors cursor-pointer">
                All Categories
              </Link>
            </li>
            <li>
              <Link href="/providers" className="hover:text-white transition-colors cursor-pointer">
                Local Experts list
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white transition-colors cursor-pointer">
                Track My Bookings
              </Link>
            </li>
          </ul>
        </div>

        {/* Core Cities */}
        <div>
          <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4">Cities covered</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            {cities.map(c => (
              <li 
                key={c.id} 
                onClick={() => setSelectedCity(c.id)} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                {lang === 'en' ? c.nameEn : c.nameHi} Coordinates
              </li>
            ))}
          </ul>
        </div>

        {/* Support Contacts */}
        <div>
          <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4">Worker Helpdesk</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>📞 1800-419-LFIX (Toll Free)</li>
            <li>📧 partner-support@localfix.in</li>
            <li>📍 LocalFix Regional Office: Civil Lines, Aligarh</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
        {t('footerText')}
      </div>
    </footer>
  );
}
