'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  AlertTriangle, 
  Check, 
  Activity, 
  CheckCircle2, 
  Phone 
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Booking } from '../../app/data';

export default function EmergencyModal() {
  const router = useRouter();
  
  const {
    lang,
    selectedCity,
    providers,
    createBooking,
    addNotification,
    emergencyActive,
    cities,
    setEmergencyActive,
    emergencyStep,
    setEmergencyStep,
    emergencyProgress,
    setEmergencyProgress,
    emergencyProvider,
    setEmergencyProvider,
    t
  } = useStore();

  // Run simulated coordination scan radar when emergencyStep is 'searching'
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (emergencyActive && emergencyStep === 'searching') {
      interval = setInterval(() => {
        setEmergencyProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            
            // Select nearest expert based on city / category
            const candidates = providers.filter(
              p => p.city === selectedCity && (p.category === 'electrician' || p.category === 'plumber')
            );
            const matched = candidates.length > 0 ? candidates[0] : providers[0];
            setEmergencyProvider(matched);

            // Add emergency booking to dynamic bookings history
            const newBooking: Booking = {
              id: 'SOS-' + Date.now(),
              customerName: 'Abhishek Tyagi',
              customerPhone: '+91 99887 76655',
              customerAddress: 'Flat 402, Royal Residency, Ramghat Road',
              city: selectedCity,
              serviceCategory: matched.category,
              providerId: matched.id,
              providerName: matched.name,
              providerAvatar: matched.avatar,
              date: new Date().toISOString().split('T')[0],
              timeSlot: 'ASAP (within 30 mins)',
              status: 'accepted',
              price: matched.pricePerHr + 200, // Emergency surcharge ₹200
              notes: 'CRITICAL EMERGENCY SOS ACTIVE: Dispatched immediately.',
              paymentStatus: 'pending'
            };

            createBooking(newBooking).then(() => {
              addNotification(
                `🚨 EMERGENCY SOS: ${matched.name} dispatched to your location!`,
                `🚨 आपातकालीन एसओएस: ${matched.name} को आपके स्थान पर भेज दिया गया है!`
              );
              setEmergencyStep('matched');
            });

            return 100;
          }
          return prev + 10;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [emergencyActive, emergencyStep, selectedCity, providers, createBooking, addNotification, setEmergencyProgress, setEmergencyProvider, setEmergencyStep]);

  if (!emergencyActive) return null;

  const handleTrackDispatch = () => {
    setEmergencyActive(false);
    setEmergencyStep('idle');
    setEmergencyProgress(0);
    router.push('/?tab=bookings');
  };

  const handleClose = () => {
    setEmergencyActive(false);
    setEmergencyStep('idle');
    setEmergencyProgress(0);
  };

  return (
    <div onClick={handleClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md transition-all duration-300">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg p-8 rounded-3xl bg-white border-2 border-red-500 shadow-2xl text-center overflow-hidden danger-glow">
        
        {/* Pulsing red SOS rings in background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-100 rounded-full animate-ping-slow -z-10 opacity-30"></div>
        
        <button 
          type="button"
          onClick={handleClose} 
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {emergencyStep === 'idle' && (
          <div>
            <div className="inline-flex p-4 bg-red-100 rounded-full text-red-600 mb-4 animate-bounce">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
              {lang === 'en' ? 'LocalFix SOS Emergency Dispatch' : 'लोकलफिक्स आपातकालीन एसओएस प्रेषण'}
            </h3>
            <p className="text-slate-600 text-sm mb-6">
              {t('emergencyDesc')}
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left mb-6 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>{lang === 'en' ? 'Direct dispatch nearest electrician or plumber' : 'निकटतम बिजली मिस्त्री या नलसाज का सीधा प्रेषण'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>{lang === 'en' ? 'Standard ₹200 emergency response surcharge applies' : 'मानक ₹200 आपातकालीन प्रतिक्रिया अधिभार लागू'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>{lang === 'en' ? 'Guaranteed response under 30 minutes' : '30 मिनट के भीतर गारंटीड प्रतिक्रिया'}</span>
              </div>
            </div>

            <button
              onClick={() => setEmergencyStep('searching')}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Activity className="w-5 h-5 animate-pulse" />
              {lang === 'en' ? 'Activate Rapid SOS Dispatch' : 'रैपिड एसओएस प्रेषण सक्रिय करें'}
            </button>
          </div>
        )}

        {emergencyStep === 'searching' && (
          <div className="py-6">
            <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-2 bg-red-50 rounded-full flex items-center justify-center animate-pulse">
                <RadioSignalIcon className="w-12 h-12 text-red-600 animate-pulse" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">
              {lang === 'en' ? 'Scanning Coordinates...' : 'स्थान निर्देशांक स्कैनिंग...'}
            </h4>
            <p className="text-slate-500 text-sm mb-6">
              {lang === 'en' 
                ? `Locating active providers in ${cities.find(c => c.id === selectedCity)?.nameEn || selectedCity}...` 
                : `${cities.find(c => c.id === selectedCity)?.nameHi || selectedCity} में सक्रिय प्रदाताओं का पता लगाया जा रहा है...`
              }
            </p>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-red-600 h-full rounded-full transition-all duration-300" style={{ width: `${emergencyProgress}%` }}></div>
            </div>
            <div className="text-right text-xs font-bold text-red-600 mt-2">
              {emergencyProgress}%
            </div>
          </div>
        )}

        {emergencyStep === 'matched' && emergencyProvider && (
          <div>
            <div className="inline-flex p-4 bg-green-100 rounded-full text-green-600 mb-4">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
              {lang === 'en' ? 'SOS Responder Dispatched!' : 'एसओएस प्रत्युत्तरकर्ता रवाना!'}
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              {lang === 'en' ? `Expert is arriving at your default location in 15-20 minutes.` : `विशेषज्ञ 15-20 मिनट में आपके डिफ़ॉल्ट स्थान पर पहुंच रहे हैं।`}
            </p>

            {/* Provider SOS card details */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4 text-left mb-6">
              <img src={emergencyProvider.avatar} alt={emergencyProvider.name} className="w-16 h-16 rounded-full object-cover border-2 border-red-500" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900">{emergencyProvider.name}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                    {t('verified')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 capitalize">{emergencyProvider.category} • {emergencyProvider.experience} {t('years')} {t('experience')}</p>
                <div className="flex items-center gap-2 mt-1">
                  <a href={`tel:${emergencyProvider.phone}`} className="flex items-center gap-1 text-xs font-bold text-blue-600">
                    <Phone className="w-3.5 h-3.5" /> {emergencyProvider.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a
                href={emergencyProvider.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4" />
                {lang === 'en' ? 'WhatsApp Chat' : 'व्हाट्सएप चैट'}
              </a>
              <button
                onClick={handleTrackDispatch}
                className="py-3 px-4 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-sm shadow-md cursor-pointer"
              >
                {lang === 'en' ? 'Track Live Dispatch' : 'रवाना ट्रैक करें'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------- CUSTOM SVG MINI COMPONENT ASSETS -----------------
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97-1.861-1.868-4.339-2.897-6.97-2.899-5.437 0-9.862 4.37-9.866 9.801-.001 1.685.454 3.328 1.317 4.77l-.995 3.635 3.714-.988zm11.233-7.234c-.33-.165-1.951-.963-2.253-1.074-.303-.11-.523-.165-.743.165-.22.33-.853 1.074-1.046 1.294-.192.22-.385.247-.715.082-1.802-.902-3.14-1.539-4.394-3.694-.33-.566.33-.526.946-1.758.104-.22.052-.413-.026-.578-.078-.165-.743-1.79-1.018-2.453-.268-.646-.54-.557-.743-.568-.192-.01-.413-.012-.633-.012-.22 0-.578.082-.88 0-.303-.082-1.98-.33-2.253-2.254-.165-1.074.88-1.597.88-1.597.247.743.495 1.432.743 1.956.247.523.578.853.908 1.266 1.83 2.118 3.518 2.87 5.753 3.71.605.228 1.157.18 1.59.115.485-.072 1.951-.798 2.226-1.569.276-.77.276-1.432.193-1.569-.083-.138-.303-.22-.633-.385z" />
    </svg>
  );
}

function RadioSignalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
  );
}
