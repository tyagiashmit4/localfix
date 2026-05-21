'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store/useStore';
import { Provider } from '../../app/data';

export default function SEOSimulatorPage() {
  const router = useRouter();

  const {
    providers,
    setSelectedProvider,
    cities,
    serviceCategories
  } = useStore();

  const [seoService, setSeoService] = useState('electrician');
  const [seoCity, setSeoCity] = useState('aligarh');

  const handleBookProvider = (p: Provider) => {
    setSelectedProvider(p);
    router.push(`/providers/${p.id}`);
  };

  const handleInstantMatch = () => {
    const cityName = cities.find(c => c.id === seoCity)?.nameEn || seoCity;
    alert(`Success! Our smart matching algorithms are scanning providers in ${cityName} for this requirement.`);
  };

  const activeCategory = serviceCategories.find(c => c.id === seoService);
  const activeCity = cities.find(c => c.id === seoCity);

  return (
    <div className="space-y-8 mt-4">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">Dynamic Google SEO Pages Simulator</h2>
        <p className="text-slate-500 text-xs leading-relaxed max-w-2xl font-medium">
          Startup expansion relies heavily on hyper-local search discovery. Select combinations below to preview SEO Landing Pages compiled dynamically for Tier 2/3 Indian cities.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {/* Select service */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600">Select Service Category</label>
            <select
              value={seoService}
              onChange={(e) => setSeoService(e.target.value)}
              className="w-full text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              {serviceCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nameEn}</option>
              ))}
            </select>
          </div>

          {/* Select city */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600">Select Target City</label>
            <select
              value={seoCity}
              onChange={(e) => setSeoCity(e.target.value)}
              className="w-full text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              {cities.map(c => (
                <option key={c.id} value={c.id}>{c.nameEn}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Generated SEO page mockup preview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
          <span>Google Search Index Mockup Preview</span>
          <span className="text-emerald-600 font-extrabold lowercase">
            https://localfix.in/{seoService}-{seoCity}
          </span>
        </div>

        {/* Actual Landing layout */}
        <div className="p-8 space-y-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
              Indexed keyword page
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Best {activeCategory?.nameEn} in {activeCity?.nameEn} — 100% Verified Local Experts
            </h1>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
              Looking for a trusted {activeCategory?.nameEn} in {activeCity?.nameEn}? LocalFix matches you with ITI certified and Aadhaar verified {activeCategory?.nameEn}s at flat hourly rates. Book directly on WhatsApp or Call in under 40 minutes.
            </p>
          </div>

          {/* Targeted provider suggestions */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900">
              Recommended {activeCategory?.nameEn}s in {activeCity?.nameEn}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers
                .filter(p => p.category === seoService && p.city === seoCity)
                .map(p => (
                  <div key={p.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <span className="block font-bold text-slate-800 text-xs">{p.name}</span>
                        <span className="block text-[10px] text-slate-400 capitalize">
                          {p.experience} years experience • {p.rating}★
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookProvider(p)}
                      className="py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                    >
                      Book now
                    </button>
                  </div>
                ))}

              {providers.filter(p => p.category === seoService && p.city === seoCity).length === 0 && (
                <div className="col-span-full py-4 text-center text-xs text-slate-400 italic font-semibold">
                  No trade experts registered in this category for {activeCity?.nameEn} yet.
                </div>
              )}
            </div>
          </div>

          {/* Fast Booking form simulation */}
          <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl max-w-xl space-y-4">
            <div>
              <span className="font-extrabold text-slate-800 text-sm block">Quick book {activeCategory?.nameEn}</span>
              <span className="text-[10px] text-slate-400 font-semibold block">Submit your requirement to trigger local matches</span>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter mobile phone number..."
                className="flex-1 text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
              <button
                onClick={handleInstantMatch}
                className="py-2 px-4 bg-blue-600 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer"
              >
                Instant Match Request
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
