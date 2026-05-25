'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ArrowLeft, 
  Map, 
  Activity, 
  Filter, 
  AlertCircle, 
  Star, 
  Heart, 
  Phone, 
  Check 
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import HeaderBanner from '../../components/common/HeaderBanner';

export default function ProvidersPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    lang,
    selectedCity,
    searchQuery,
    setSearchQuery,
    currentCategory,
    setCurrentCategory,
    providers,
    cities,
    serviceCategories,
    savedProviderIds,
    setSavedProviderIds,
    addNotification,
    initiateBooking,
    filterMinExperience,
    setFilterMinExperience,
    filterMaxPrice,
    setFilterMaxPrice,
    sortBy,
    setSortBy,
    isMapView,
    setIsMapView,
    t
  } = useStore();

  // Filter & Sort Providers
  const filteredProviders = providers.filter(p => {
    const matchesCategory = currentCategory ? p.category === currentCategory : true;
    const matchesCity = p.city === selectedCity;
    const matchesExperience = p.experience >= filterMinExperience;
    const matchesPrice = p.pricePerHr <= filterMaxPrice;
    
    // Search query match
    const textToSearch = `${p.name} ${p.bioEn} ${p.bioHi} ${p.category}`.toLowerCase();
    const matchesSearch = searchQuery ? textToSearch.includes(searchQuery.toLowerCase()) : true;

    return matchesCategory && matchesCity && matchesExperience && matchesPrice && matchesSearch;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'experience') return b.experience - a.experience;
    if (sortBy === 'priceAsc') return a.pricePerHr - b.pricePerHr;
    if (sortBy === 'priceDesc') return b.pricePerHr - a.pricePerHr;
    return 0;
  });

  // Saved Providers toggle
  const toggleSaveProvider = (id: string) => {
    if (savedProviderIds.includes(id)) {
      setSavedProviderIds(prev => prev.filter(item => item !== id));
      addNotification("Provider removed from favorites", "पसंदीदा सूची से प्रदाता को हटाया गया");
    } else {
      setSavedProviderIds(prev => [...prev, id]);
      addNotification("Provider saved to favorites", "प्रदाता को पसंदीदा सूची में सहेजा गया");
    }
  };

  const handleSelectProvider = (providerId: string) => {
    const matched = providers.find(p => p.id === providerId);
    if (matched) {
      useStore.setState({ selectedProvider: matched });
      router.push(`/providers/${providerId}`);
    }
  };

  const currentCategoryName = currentCategory
    ? (lang === 'en' 
        ? serviceCategories.find(c => c.id === currentCategory)?.nameEn 
        : serviceCategories.find(c => c.id === currentCategory)?.nameHi)
    : (lang === 'en' ? 'All Active Providers' : 'सभी सक्रिय प्रदाता');

  return (
    <div className="space-y-6">
      <HeaderBanner />

      <div className="space-y-6 mt-4">
        {/* Top header path */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setCurrentCategory(null);
                router.push('/');
              }} 
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 capitalize leading-tight">
                {currentCategoryName}
              </h2>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">
                {lang === 'en' 
                  ? `Showing ${sortedProviders.length} active trade professionals` 
                  : `दिखाए जा रहे हैं ${sortedProviders.length} सक्रिय व्यापार पेशेवर`
                }
              </p>
            </div>
          </div>

          {/* Map view toggle */}
          <button
            onClick={() => setIsMapView(!isMapView)}
            className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5 hover:bg-slate-50 transition-colors self-start cursor-pointer"
          >
            <Map className="w-4 h-4 text-emerald-600" />
            <span>
              {isMapView 
                ? (lang === 'en' ? 'Hide Map Grid' : 'नक्शा छिपाएं') 
                : (lang === 'en' ? 'Show Map View' : 'नक्शा देखें')
              }
            </span>
          </button>
        </div>

        {/* DYNAMIC MAP COMPONENT SIMULATOR */}
        {isMapView && (
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-3xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-extrabold">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>Real-time GPS Coordinate Simulator</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase">
                Active Radar
              </span>
            </div>
            
            <div className="h-64 bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
              {/* Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
              
              {/* Radar Scan animation ring */}
              <div className="absolute w-56 h-56 border-2 border-emerald-500/20 rounded-full animate-ping-slow"></div>

              <span className="text-white text-xs font-extrabold z-10 px-3 py-1 bg-slate-800/80 rounded-lg absolute bottom-4">
                {lang === 'en' 
                  ? `Showing coordinates in ${cities.find(c => c.id === selectedCity)?.nameEn || selectedCity}` 
                  : `${cities.find(c => c.id === selectedCity)?.nameHi || selectedCity} में समन्वय दिखा रहा है`
                }
              </span>

              {/* Provider dots mapped on coordinates */}
              {sortedProviders.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProvider(p.id)}
                  className="absolute group cursor-pointer"
                  style={{
                    top: `${30 + (idx * 20) % 50}%`,
                    left: `${20 + (idx * 25) % 65}%`
                  }}
                >
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-400 bg-blue-600 overflow-hidden shadow-md">
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-9 bg-slate-900 text-white text-[9px] font-bold py-0.5 px-2 rounded-md whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    {p.name} • ₹{p.pricePerHr}/hr
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FILTERS AND SORT WORKSPACE */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-700 text-sm font-extrabold">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filters Workspace</span>
            </div>
            <button
              onClick={() => { 
                setFilterMinExperience(0); 
                setFilterMaxPrice(1000); 
                setSortBy('rating'); 
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Reset filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            {/* Price range */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">Max Pricing: ₹{filterMaxPrice}/hr</label>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={filterMaxPrice}
                onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Experience filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">Min Experience: {filterMinExperience} years</label>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={filterMinExperience}
                onChange={(e) => setFilterMinExperience(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sorting */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'experience' | 'priceAsc' | 'priceDesc')}
                className="w-full text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="rating">Rating (Highest first)</option>
                <option value="experience">Experience (Years first)</option>
                <option value="priceAsc">Price (Low to High)</option>
                <option value="priceDesc">Price (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* LISTINGS CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedProviders.length === 0 ? (
            <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-4">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">No active experts match your filter</h3>
                <p className="text-slate-400 text-xs mt-1">Try resetting the experience scales or increasing the max budget filter.</p>
              </div>
              <button 
                onClick={() => { setFilterMinExperience(0); setFilterMaxPrice(1000); setSearchQuery(''); }}
                className="py-2.5 px-6 bg-slate-950 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Reset Search Parameters
              </button>
            </div>
          ) : (
            sortedProviders.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover-glow transition-all flex flex-col justify-between">
                <div>
                  {/* Avatar name badge details */}
                  <div className="flex gap-4">
                    <img src={p.avatar} alt={p.name} className="w-16 h-16 rounded-full object-cover border border-slate-100" />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 
                          onClick={() => handleSelectProvider(p.id)}
                          className="font-extrabold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                        >
                          {p.name}
                        </h3>
                        {p.aadhaarVerified && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-50 text-green-700 border border-green-200">
                            <Check className="w-2.5 h-2.5" />
                            <span>{t('verified')}</span>
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-slate-400 font-semibold capitalize">
                        {lang === 'en' 
                          ? serviceCategories.find(c => c.id === p.category)?.nameEn 
                          : serviceCategories.find(c => c.id === p.category)?.nameHi
                        } • {p.experience} {t('years')} {t('experience')}
                      </p>

                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                        <span className="font-extrabold text-slate-800">{p.rating}</span>
                        <span className="text-slate-400">({p.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio excerpt */}
                  <p className="text-slate-500 text-xs leading-relaxed mt-4 line-clamp-2">
                    {lang === 'en' ? p.bioEn : p.bioHi}
                  </p>

                  {/* Areas tags */}
                  <div className="flex flex-wrap gap-1 mt-4">
                    {p.areas.map((a, i) => (
                      <span key={i} className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Lower call actions */}
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">{t('pricing')}</span>
                    <span className="text-base font-extrabold text-slate-900">₹{p.pricePerHr}/hr</span>
                  </div>

                  <div className="flex items-center gap-2">
                    
                    {/* Favorite button */}
                    <button
                      onClick={() => toggleSaveProvider(p.id)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        savedProviderIds.includes(p.id) 
                          ? 'bg-rose-50 border-rose-200 text-rose-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-rose-500'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>

                    <a
                      href={`tel:${p.phone}`}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Call' : 'कॉल'}</span>
                    </a>

                    <a
                      href={p.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Chat' : 'व्हाट्सएप'}</span>
                    </a>

                    <button
                      onClick={() => {
                        if (!session) {
                          router.push('/login?callbackUrl=/providers');
                          return;
                        }
                        initiateBooking(p);
                        router.push('/booking');
                      }}
                      className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
                    >
                      {t('bookNowButton')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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
