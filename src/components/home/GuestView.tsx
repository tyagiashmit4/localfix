'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Smartphone, 
  Zap, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Provider } from '../../app/data';
import { useStore } from '../../store/useStore';
import HeaderBanner from '../common/HeaderBanner';

interface GuestViewProps {
  onOpenBecomeProvider: () => void;
}

export default function GuestView({ onOpenBecomeProvider }: GuestViewProps) {
  const router = useRouter();
  const { lang, selectedCity, providers, initiateBooking, serviceCategories, t } = useStore();

  const getAIRecommendations = () => {
    return [...providers]
      .filter(p => p.city === selectedCity)
      .map(p => ({
        provider: p,
        score: p.rating * 1.5 + (p.experience / 3) + (p.aadhaarVerified ? 1.5 : 0)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.provider);
  };

  const handleSelectCategory = (catId: string) => {
    useStore.setState({ currentCategory: catId });
    router.push('/providers');
  };

  const handleBookNow = (provider: Provider) => {
    initiateBooking(provider);
    router.push('/booking');
  };

  const getCategoryEmoji = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return '⚡';
      case 'Droplet': return '💧';
      case 'Wind': return '💨';
      case 'BookOpen': return '📚';
      case 'Sparkles': return '✨';
      case 'Paintbrush': return '🎨';
      case 'Filter': return '🚰';
      case 'Hammer': return '🔨';
      case 'Laptop': return '💻';
      case 'Cctv': return '📹';
      default: return '🔧';
    }
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* Sub-nav search header banner */}
      <HeaderBanner />

      {/* HERO HERO SECTION REDESIGN */}
      <section className="relative rounded-[2.5rem] bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-8 md:p-12 lg:p-16 text-white overflow-hidden shadow-2xl border border-indigo-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(99,102,241,0.15),transparent_40%)]"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 text-xs font-black border border-blue-500/20 backdrop-blur-sm animate-pulse">
              <Award className="w-4 h-4 text-amber-400" />
              <span>100% Biometric & Aadhaar Verified Local Experts</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-blue-200">
              {t('tagline')}
            </h1>
            
            <p className="text-slate-300 text-base md:text-lg max-w-xl font-medium leading-relaxed">
              {t('subtagline')}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => router.push('/categories')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/35 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>{t('findServices')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={onOpenBecomeProvider}
                className="px-8 py-4 bg-white/10 hover:bg-white/15 backdrop-blur-md text-white font-bold rounded-2xl border border-white/10 shadow-lg hover:border-white/20 transition-all transform active:scale-95 cursor-pointer"
              >
                {t('becomeProvider')}
              </button>
            </div>

            {/* Micro stats dashboard */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
              <div>
                <span className="block text-3xl font-black text-blue-400">5+</span>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Active Cities</span>
              </div>
              <div>
                <span className="block text-3xl font-black text-emerald-400">200+</span>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Local Partners</span>
              </div>
              <div>
                <span className="block text-3xl font-black text-amber-400">4.9★</span>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Average Trust Rating</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-[2rem] p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl relative">
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-lg ring-4 ring-slate-900">
                ₹
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-extrabold text-white text-sm">Live Verification Monitor</span>
                  <span className="text-[10px] text-emerald-400 font-black bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Active Secure
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50">
                    <img src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&auto=format&fit=crop&q=80" className="w-10 h-10 rounded-full object-cover" alt="Ramesh" />
                    <div>
                      <span className="block text-xs font-bold text-white">Ramesh Kumar (Electrician)</span>
                      <span className="block text-[10px] text-emerald-400 font-medium">Aadhaar verified • Aligarh</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" className="w-10 h-10 rounded-full object-cover" alt="Suresh" />
                    <div>
                      <span className="block text-xs font-bold text-white">Suresh Yadav (Plumber)</span>
                      <span className="block text-[10px] text-emerald-400 font-medium">Biometrics passed • Agra</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-500/20 rounded-2xl text-xs space-y-1 shadow-md">
                  <div className="flex justify-between font-bold text-white">
                    <span>Direct WhatsApp Chat</span>
                    <span className="text-emerald-400">⚡ Fast</span>
                  </div>
                  <p className="text-[10px] text-slate-300">Cut out middleman commissions completely. Work directly with your expert.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {t('popularCategories')}
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">{t('popularSub')}</p>
          </div>
          <button 
            onClick={() => router.push('/categories')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:shadow-md transition-all cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {serviceCategories.slice(0, 5).map(cat => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="group p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer text-center space-y-4"
            >
              <div className="inline-flex p-4 bg-slate-50 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 rounded-2xl transition-colors text-2xl font-bold">
                {getCategoryEmoji(cat.icon)}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                  {lang === 'en' ? cat.nameEn : cat.nameHi}
                </h3>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{cat.providerCount} Experts</span>
              </div>
              <div className="pt-3 border-t border-slate-50 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">{t('pricing')}</span>
                <span className="font-black text-slate-800">₹{cat.startingPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI RECOMMENDATIONS WIDGET */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 md:p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden border border-indigo-950">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-3xl space-y-4 mb-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>{t('aiRecommendations')}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight">
            {lang === 'en' ? 'Local Smart Match Assistant' : 'स्थानीय स्मार्ट मैच सहायक'}
          </h3>
          <p className="text-slate-300 text-xs md:text-sm">{t('aiSlogan')}</p>
        </div>

        {/* Recommendations list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {getAIRecommendations().map(rec => (
            <div key={rec.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between hover:bg-white/10 transition-colors">
              <div>
                <div className="flex items-center gap-3">
                  <img src={rec.avatar} alt={rec.name} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                  <div>
                    <span className="block text-xs font-black text-white leading-tight">{rec.name}</span>
                    <span className="block text-[9px] text-indigo-300 font-extrabold uppercase mt-0.5">
                      {lang === 'en' 
                        ? serviceCategories.find(c => c.id === rec.category)?.nameEn 
                        : serviceCategories.find(c => c.id === rec.category)?.nameHi}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 text-[11px] text-slate-300">
                  <div className="flex items-center text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-current mr-0.5" />
                    <span>{rec.rating}</span>
                  </div>
                  <div>•</div>
                  <div>{rec.experience} {t('years')} {t('experience')}</div>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-black">₹{rec.pricePerHr}/hr</span>
                <button 
                  onClick={() => handleBookNow(rec)}
                  className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black rounded-lg transition-colors cursor-pointer"
                >
                  {t('bookNowButton')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="space-y-8 text-center max-w-4xl mx-auto">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {t('howItWorks')}
          </h2>
          <p className="text-slate-500 text-sm font-medium">{t('howItWorksSub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {[
            { step: 1, title: t('step1Title'), desc: t('step1Desc') },
            { step: 2, title: t('step2Title'), desc: t('step2Desc') },
            { step: 3, title: t('step3Title'), desc: t('step3Desc') },
          ].map(s => (
            <div key={s.step} className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm mx-auto">
                {s.step}
              </div>
              <h3 className="font-extrabold text-sm text-slate-950">{s.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-white rounded-[2rem] border border-slate-200/80 p-8 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-200/80 pb-6 lg:pb-0 lg:pr-6 flex flex-col justify-center">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t('whyChooseUs')}</h2>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            We designed a platform to remove hurdles for small cities. Direct contact numbers, verified local experts, and 0% booking fees.
          </p>
          <div className="pt-2">
            <span className="inline-flex px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-black">
              ₹0 Platform Commissions
            </span>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2.5">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl inline-flex">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-950">{t('why1Title')}</h4>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">{t('why1Desc')}</p>
          </div>
          <div className="space-y-2.5">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl inline-flex">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-950">{t('why2Title')}</h4>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">{t('why2Desc')}</p>
          </div>
          <div className="space-y-2.5">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl inline-flex">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-950">{t('why3Title')}</h4>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">{t('why3Desc')}</p>
          </div>
        </div>
      </section>

      {/* DOWNLOAD APK AD BANNER */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 md:p-12 text-white grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_80%,rgba(255,255,255,0.06),transparent_30%)]"></div>
        <div className="md:col-span-8 space-y-4 relative z-10">
          <h3 className="text-2xl md:text-3xl font-black tracking-tight">
            {t('downloadApp')}
          </h3>
          <p className="text-blue-100 text-xs md:text-sm font-medium max-w-xl">
            {t('downloadSub')}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={() => alert("Lightweight APK Download Initiated! Package Size: 6.8MB. Optimized for 4G/5G mobile devices.")}
              className="py-3 px-6 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all transform active:scale-95 cursor-pointer"
            >
              <span>Download APK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[10px] text-blue-200 flex items-center font-bold">
              ★ Google Play Protect Verified
            </span>
          </div>
        </div>
        <div className="md:col-span-4 flex justify-center relative z-10">
          <div className="w-32 h-32 bg-white p-2.5 rounded-2xl flex items-center justify-center border-4 border-blue-500 shadow-md">
            <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-[10px] text-slate-500 font-bold text-center gap-1.5">
              <span className="text-[42px] leading-none">📱</span>
              <span>Scan QR Code</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
