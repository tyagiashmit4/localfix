'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Award, 
  Check, 
  Star, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

interface PageProps {
  params: Promise<{ providerId: string }>;
}

export default function ProviderProfilePage({ params }: PageProps) {
  const router = useRouter();
  const { providerId } = use(params);
  const { data: session } = useSession();

  const {
    lang,
    selectedCity,
    providers,
    reviews,
    initiateBooking,
    serviceCategories,
    t
  } = useStore();

  const selectedProvider = providers.find(p => p.id === providerId);

  if (!selectedProvider) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
        <p className="text-slate-500 font-bold">Provider not found or loaded yet.</p>
        <button 
          onClick={() => router.push('/providers')}
          className="py-2 px-4 bg-blue-600 text-white rounded-xl font-bold cursor-pointer"
        >
          Back to Listings
        </button>
      </div>
    );
  }

  const handleSelectSimilar = (pId: string) => {
    router.push(`/providers/${pId}`);
  };

  const handleBookNow = () => {
    if (!session) {
      router.push(`/login?callbackUrl=/providers/${providerId}`);
      return;
    }
    initiateBooking(selectedProvider);
    router.push('/booking');
  };

  const categoryLabel = lang === 'en' 
    ? serviceCategories.find(c => c.id === selectedProvider.category)?.nameEn 
    : serviceCategories.find(c => c.id === selectedProvider.category)?.nameHi;

  const certsList = lang === 'en' 
    ? selectedProvider.certificationsEn 
    : selectedProvider.certificationsHi;

  return (
    <div className="space-y-8 mt-4">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => router.push('/providers')} 
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-slate-400">Back to Listings</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Main Body */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Banner block */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="h-44 w-full bg-slate-900 relative">
              <img 
                src={selectedProvider.coverImage} 
                alt="cover"
                className="w-full h-full object-cover opacity-80" 
              />
            </div>
            
            {/* Profile overlay details */}
            <div className="p-6 relative pt-14">
              <div className="absolute -top-12 left-6">
                <img 
                  src={selectedProvider.avatar} 
                  alt={selectedProvider.name}
                  className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md" 
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-black text-slate-900">{selectedProvider.name}</h2>
                    {selectedProvider.aadhaarVerified && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('biometricStatus')}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-blue-600 capitalize mt-1">
                    {categoryLabel} • {selectedProvider.experience} {t('years')} {t('experience')}
                  </p>
                </div>

                {/* Direct action buttons */}
                <div className="flex gap-2">
                  <a
                    href={`tel:${selectedProvider.phone}`}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t('callButton')}</span>
                  </a>
                  <a
                    href={selectedProvider.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>{t('whatsappButton')}</span>
                  </a>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6 border-t border-slate-100 pt-5 space-y-2">
                <h4 className="font-extrabold text-sm text-slate-900">About Me / Bio</h4>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  {lang === 'en' ? selectedProvider.bioEn : selectedProvider.bioHi}
                </p>
              </div>
            </div>
          </div>

          {/* Service area tags & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Areas */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{t('serviceAreas')}</span>
              </h4>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Active Coordinates</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedProvider.areas.map((a, i) => (
                  <span key={i} className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Accreditations */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span>{t('certifications')}</span>
              </h4>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Govt / ITI Licenses</p>
              <ul className="space-y-2 text-xs text-slate-600">
                {certsList.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Profile Portfolio Gallery */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900">Work Logs & Gallery</h4>
            {selectedProvider.gallery.length === 0 ? (
              <p className="text-xs text-slate-400">No work pictures uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {selectedProvider.gallery.map((img, i) => (
                  <div key={i} className="h-32 rounded-2xl overflow-hidden border border-slate-200">
                    <img src={img} alt="work gallery" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ratings & reviews breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
            <h4 className="font-extrabold text-sm text-slate-900">Customer Ratings Breakdown</h4>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
              <div className="text-center">
                <span className="text-4xl font-black text-slate-900 block">{selectedProvider.rating}</span>
                <div className="flex items-center justify-center text-amber-500 gap-0.5 mt-1">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-[11px] text-slate-400 font-semibold block mt-1.5">
                  {selectedProvider.reviewsCount} total ratings
                </span>
              </div>

              {/* Progress bars breakdown */}
              <div className="flex-1 w-full space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-8 font-bold text-slate-600">5 star</span>
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[85%] rounded-full"></div>
                  </div>
                  <span className="w-8 font-bold text-slate-400 text-right">85%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 font-bold text-slate-600">4 star</span>
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[10%] rounded-full"></div>
                  </div>
                  <span className="w-8 font-bold text-slate-400 text-right">10%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 font-bold text-slate-600">3 star</span>
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[5%] rounded-full"></div>
                  </div>
                  <span className="w-8 font-bold text-slate-400 text-right">5%</span>
                </div>
              </div>
            </div>

            {/* Customer feedback list */}
            <div className="space-y-4">
              {reviews.filter(r => r.providerId === selectedProvider.id).map(r => (
                <div key={r.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 text-xs">{r.customerName}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{r.date}</span>
                  </div>
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {lang === 'en' ? r.commentEn : r.commentHi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Sidebar Booking widgets */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{t('pricing')}</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-slate-900">₹{selectedProvider.pricePerHr}</span>
                <span className="text-xs font-semibold text-slate-500">/hr flat rate</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50/50 rounded-2xl space-y-2 text-xs text-slate-600 border border-blue-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900">Direct Worker Booking</span>
              </div>
              <p className="leading-relaxed">Verify on call, coordinate materials needed directly on chat. No commission fees added!</p>
            </div>

            <button
              onClick={handleBookNow}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/10 transition-all text-sm transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('bookNowButton')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Similar providers nearby list */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900">{t('similarProviders')}</h4>
            
            <div className="space-y-4">
              {providers
                .filter(p => p.category === selectedProvider.category && p.id !== selectedProvider.id && p.city === selectedCity)
                .slice(0, 2)
                .map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => handleSelectSimilar(p.id)}
                    className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-xl transition-colors border border-slate-50"
                  >
                    <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <span className="block text-xs font-bold text-slate-800">{p.name}</span>
                      <span className="block text-[10px] text-slate-400 capitalize">{p.experience} yrs • ₹{p.pricePerHr}/hr</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom mini component
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97-1.861-1.868-4.339-2.897-6.97-2.899-5.437 0-9.862 4.37-9.866 9.801-.001 1.685.454 3.328 1.317 4.77l-.995 3.635 3.714-.988zm11.233-7.234c-.33-.165-1.951-.963-2.253-1.074-.303-.11-.523-.165-.743.165-.22.33-.853 1.074-1.046 1.294-.192.22-.385.247-.715.082-1.802-.902-3.14-1.539-4.394-3.694-.33-.566.33-.526.946-1.758.104-.22.052-.413-.026-.578-.078-.165-.743-1.79-1.018-2.453-.268-.646-.54-.557-.743-.568-.192-.01-.413-.012-.633-.012-.22 0-.578.082-.88 0-.303-.082-1.98-.33-2.253-2.254-.165-1.074.88-1.597.88-1.597.247.743.495 1.432.743 1.956.247.523.578.853.908 1.266 1.83 2.118 3.518 2.87 5.753 3.71.605.228 1.157.18 1.59.115.485-.072 1.951-.798 2.226-1.569.276-.77.276-1.432.193-1.569-.083-.138-.303-.22-.633-.385z" />
    </svg>
  );
}
