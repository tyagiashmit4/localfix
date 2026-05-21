'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import HeaderBanner from '../../components/common/HeaderBanner';
import CategoryIcon from '../../components/common/CategoryIcon';

export default function CategoriesPage() {
  const router = useRouter();
  
  const {
    lang,
    selectedCity,
    setCurrentCategory,
    setSearchQuery,
    cities,
    serviceCategories,
    t
  } = useStore();

  const handleSelectCategory = (catId: string) => {
    setCurrentCategory(catId);
    setSearchQuery('');
    router.push('/providers');
  };

  const currentCityName = cities.find(c => c.id === selectedCity);
  const cityLabel = lang === 'en' 
    ? `Browse all verified home tasks in ${currentCityName?.nameEn || selectedCity}`
    : `${currentCityName?.nameHi || selectedCity} में उपलब्ध सभी सत्यापित गृह कार्य देखें`;

  return (
    <div className="space-y-6">
      <HeaderBanner />

      <div className="space-y-8 mt-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push('/')} 
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'en' ? 'Service Categories' : 'सेवा श्रेणियां'}
            </h2>
            <p className="text-slate-500 text-xs font-semibold">
              {cityLabel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceCategories.map(cat => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="p-6 bg-white rounded-3xl border border-slate-200/80 hover-glow cursor-pointer flex gap-4 transition-all"
            >
              <div className="p-4 bg-blue-50 rounded-2xl h-14 w-14 flex items-center justify-center shrink-0">
                <CategoryIcon iconName={cat.icon} className="w-8 h-8 text-blue-600" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900">
                    {lang === 'en' ? cat.nameEn : cat.nameHi}
                  </h3>
                  <span className="text-xs font-bold text-slate-500">{cat.providerCount} Experts</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {lang === 'en' ? cat.descriptionEn : cat.descriptionHi}
                </p>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold">{t('pricing')} </span>
                    <span className="text-slate-800 font-extrabold">₹{cat.startingPrice}</span>
                  </div>
                  <span className="text-blue-600 font-extrabold flex items-center gap-1">
                    <span>Book expert</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
