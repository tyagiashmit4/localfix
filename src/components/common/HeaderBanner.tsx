'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MapPin, Search, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function HeaderBanner() {
  const router = useRouter();
  const pathname = usePathname();

  const {
    lang,
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    cities,
    t
  } = useStore();

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (pathname !== '/providers') {
      router.push('/providers');
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-4 md:px-8 text-white shadow-md rounded-2xl mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-200 tracking-wider uppercase block">
            {t('tagline')}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <span className="text-lg font-extrabold">
              {lang === 'en' ? 'Marketplace in' : 'मार्केटप्लेस में'}
            </span>
            
            {/* Custom Styled City selector */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-blue-800 text-white font-extrabold border-0 rounded-lg px-2.5 py-1 text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none cursor-pointer"
            >
              {cities.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {lang === 'en' ? c.nameEn : c.nameHi}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Smart Search Bar widget */}
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 placeholder-slate-400 font-medium rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3.5 p-0.5 rounded-full bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
