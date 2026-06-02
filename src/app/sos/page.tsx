'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { 
  Home, 
  Activity, 
  MapPin, 
  Clock, 
  Settings, 
  Phone, 
  ShieldAlert, 
  LogOut,
  Zap,
  Home as HomeIcon,
  Flame,
  Lock,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Droplet,
  ShieldCheck,
  Check,
  X,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Booking } from '../../app/data';

export default function SOSPortal() {
  const router = useRouter();
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);
  const [toast, setToast] = useState<{ messageEn: string; messageHi: string } | null>(null);
  const [showSafetyScreen, setShowSafetyScreen] = useState(false);
  const [safetyProtocols, setSafetyProtocols] = useState<any[]>([]);
  const [loadingSafety, setLoadingSafety] = useState(false);
  const [safetyError, setSafetyError] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [activeSafetyCategory, setActiveSafetyCategory] = useState<string>('all');

  // Fetch Safety Protocols from API
  useEffect(() => {
    if (showSafetyScreen) {
      setLoadingSafety(true);
      setSafetyError(null);
      fetch('/api/safety-protocols')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSafetyProtocols(data.protocols);
          } else {
            setSafetyError('Failed to load safety protocols.');
          }
        })
        .catch((err) => {
          console.error(err);
          setSafetyError('Failed to fetch safety protocols.');
        })
        .finally(() => {
          setLoadingSafety(false);
        });
    }
  }, [showSafetyScreen]);

  const toggleCheckedStep = (stepKey: string) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  const handleSafetyProtocols = () => {
    // 1. Store notification in dynamic profile db
    addNotification(
      'Safety protocols active. Emergency services are on standby.',
      'सुरक्षा प्रोटोकॉल सक्रिय हैं। आपातकालीन सेवाएं तैयार हैं।'
    );

    // 2. Set visual in-app toast state
    setToast({
      messageEn: 'Safety protocols active. Emergency services are on standby.',
      messageHi: 'सुरक्षा प्रोटोकॉल सक्रिय हैं। आपातकालीन सेवाएं तैयार हैं।'
    });

    // 3. Open full-screen safety dashboard screen
    setShowSafetyScreen(true);

    // 4. Trigger native browser local notification (if granted)
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('LocalFix SOS Safety Active', {
          body: 'Safety protocols are active. Emergency services are on standby.',
          icon: '/favicon.ico',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('LocalFix SOS Safety Active', {
              body: 'Safety protocols are active. Emergency services are on standby.',
              icon: '/favicon.ico',
            });
          }
        });
      }
    }
  };

  // Auto close toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  const {
    lang,
    selectedCity,
    providers,
    createBooking,
    addNotification,
    emergencyStep,
    setEmergencyStep,
    emergencyProgress,
    setEmergencyProgress,
    emergencyProvider,
    setEmergencyProvider,
  } = useStore();

  // Reset emergency state when entering the portal
  useEffect(() => {
    setEmergencyStep('idle');
    setEmergencyProgress(0);
    setEmergencyProvider(null);
  }, [setEmergencyStep, setEmergencyProgress, setEmergencyProvider]);

  // Simulated radar for finding provider
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (emergencyStep === 'searching') {
      interval = setInterval(() => {
        setEmergencyProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            
            const category = 
              selectedEmergency === 'electrical' ? 'electrician' :
              selectedEmergency === 'pipe' ? 'plumber' :
              selectedEmergency === 'gas' ? 'plumber' :
              selectedEmergency === 'lockout' ? 'carpenter' : 'electrician';
              
            const candidates = providers.filter(
              p => p.city === selectedCity && p.category === category
            );
            const matched = candidates.length > 0 ? candidates[0] : providers[0];
            setEmergencyProvider(matched);

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
              price: matched.pricePerHr + 200, 
              notes: `CRITICAL EMERGENCY SOS ACTIVE: Dispatched immediately for ${selectedEmergency}.`,
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
      }, 300);
    }
    return () => clearInterval(interval);
  }, [emergencyStep, selectedCity, providers, createBooking, addNotification, setEmergencyProgress, setEmergencyProvider, setEmergencyStep, selectedEmergency]);

  const handleDispatch = () => {
    if (!selectedEmergency) {
      alert("Please select an emergency type first.");
      return;
    }
    setEmergencyStep('searching');
  };

  const emergencies = [
    { id: 'electrical', title: 'Electrical Short Circuit', desc: 'High priority. Risk of fire or shock. Immediate isolation required.', icon: <Zap className="w-6 h-6 text-red-500" />, iconBg: 'bg-red-100' },
    { id: 'pipe', title: 'Burst Pipe / Major Leak', desc: 'Prevent major structural damage and flooding.', icon: <HomeIcon className="w-6 h-6 text-blue-600" />, iconBg: 'bg-blue-100' },
    { id: 'gas', title: 'Gas Leakage', desc: 'Critical safety risk. Evacuate if smell is strong.', icon: <Flame className="w-6 h-6 text-red-600" />, iconBg: 'bg-red-100' },
    { id: 'lockout', title: 'Lockout / Security Issue', desc: 'Unable to access premises or security breach detected.', icon: <Lock className="w-6 h-6 text-blue-700" />, iconBg: 'bg-blue-100' },
  ];

  if (emergencyStep === 'matched' && emergencyProvider) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-xl border border-slate-200">
          <div className="inline-flex p-4 bg-green-100 rounded-full text-green-600 mb-4 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Responder Dispatched!</h2>
          <p className="text-slate-600 text-sm mb-6">Expert is arriving at your default location in 15-20 minutes.</p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4 text-left mb-6">
            <img src={emergencyProvider.avatar} alt={emergencyProvider.name} className="w-16 h-16 rounded-full object-cover border-2 border-red-500" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">{emergencyProvider.name}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">Verified</span>
              </div>
              <p className="text-xs text-slate-500 capitalize">{emergencyProvider.category}</p>
              <div className="flex items-center gap-2 mt-1">
                <a href={`tel:${emergencyProvider.phone}`} className="flex items-center gap-1 text-xs font-bold text-blue-600">
                  <Phone className="w-3.5 h-3.5" /> {emergencyProvider.phone}
                </a>
              </div>
            </div>
          </div>
          <button onClick={() => router.push('/?tab=bookings')} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl">
            Track Live Dispatch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 w-full overflow-hidden absolute inset-0">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-100 border-r border-slate-200 flex flex-col justify-between py-6 px-4 hidden md:flex shrink-0">
        <div>
          <div className="mb-10 px-2 cursor-pointer" onClick={() => router.push('/')}>
            <h1 className="text-2xl font-black text-blue-700 tracking-tight leading-tight">
              Emergency<br/>Portal
            </h1>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Priority Service Active</p>
          </div>

          <nav className="space-y-1.5">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">
              <Home className="w-5 h-5" /> Home
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-sm shadow-blue-500/20">
              <Activity className="w-5 h-5" /> My Emergencies
            </Link>
            <Link href="/?tab=bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">
              <MapPin className="w-5 h-5" /> Professional Tracking
            </Link>
            <Link href="/?tab=bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">
              <Clock className="w-5 h-5" /> Service History
            </Link>
            <Link href="/?tab=settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">
              <Settings className="w-5 h-5" /> Settings
            </Link>
          </nav>
        </div>

        <div className="space-y-2 border-t border-slate-200 pt-4">
          <button onClick={handleDispatch} className="w-full flex items-center justify-center gap-2 px-3 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-sm font-bold shadow-md transition-colors cursor-pointer">
            Call Dispatch
          </button>
          <button onClick={handleSafetyProtocols} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer">
            <ShieldAlert className="w-5 h-5" /> Safety Protocols
          </button>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* HEADER BANNER */}
          <div className="bg-slate-800 rounded-[2rem] p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-center relative overflow-hidden shadow-xl">
            <div className="z-10 max-w-lg space-y-4">
              <div className="inline-flex px-3 py-1 bg-red-950/50 border border-red-500/30 text-red-400 text-[10px] font-black tracking-widest uppercase rounded-full">
                CRITICAL SYSTEM STATUS: ACTIVE
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">SOS: Get Help Now</h2>
              <p className="text-slate-300 text-sm md:text-base font-medium">
                Professional dispatch in under 5 minutes. Our emergency network is standing by to secure your home.
              </p>
            </div>
            
            {/* GLOWING RED HELP ICON */}
            <div className="relative mt-8 md:mt-0 z-10 flex flex-col items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-4 border-red-500 shadow-[0_0_80px_rgba(220,38,38,0.6)] animate-pulse cursor-pointer" onClick={handleDispatch}>
              <AlertTriangle className="w-14 h-14 text-white mb-1" />
              <span className="text-white font-black tracking-widest uppercase text-lg">HELP</span>
            </div>
            
            {/* Background pattern/glow */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-red-600/20 to-transparent blur-3xl rounded-full translate-x-1/4"></div>
          </div>

          {/* EMERGENCY TYPES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">What is your emergency?</h3>
              {emergencyStep === 'searching' ? (
                 <span className="px-4 py-1.5 bg-blue-100 text-blue-700 font-bold text-xs rounded-full animate-pulse">Dispatching... {emergencyProgress}%</span>
              ) : (
                <button onClick={handleDispatch} className="px-4 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold text-xs rounded-full transition-colors cursor-pointer">
                  Tap to Dispatch
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {emergencies.map((em) => (
                <div 
                  key={em.id} 
                  onClick={() => {
                    if (emergencyStep !== 'searching') setSelectedEmergency(em.id);
                  }}
                  className={`p-6 bg-white rounded-3xl border transition-all cursor-pointer ${selectedEmergency === em.id ? 'border-blue-500 ring-4 ring-blue-500/20 shadow-md' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${em.iconBg}`}>
                    {em.icon}
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-lg mb-2">{em.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{em.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            
            {/* Live Map Area */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Live Professional Network</h3>
              <div className="relative w-full h-72 bg-slate-300 rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
                {/* Simulated map background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40" 
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'40\' height=\'40\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 40 0 L 0 0 0 40\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grid)\' /%3E%3C/svg%3E")' }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-400 to-transparent"></div>
                
                {/* Pill */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-xs font-bold text-slate-800 border border-slate-200">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  12 Professionals Nearby
                </div>
                
                {/* Simulated markers */}
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg shadow-blue-500/50"></div>
                <div className="absolute top-1/2 left-2/3 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg shadow-blue-500/50"></div>
                <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg shadow-blue-500/50"></div>
              </div>
            </div>

            {/* Steps & Dispatch */}
            <div className="space-y-4">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">While Waiting...</h3>
              <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 flex flex-col h-72">
                <div className="flex-1 space-y-6">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-blue-500/30">1</div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-sm">Cut Power/Gas</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">Locate and turn off the main switch or valve immediately.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-blue-500/30">2</div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-sm">Stay Clear</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">Move away from standing water or exposed wiring.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-blue-500/30">3</div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-sm">Gather IDs</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">Have your digital resident ID ready for the arriving professional.</p>
                    </div>
                  </div>
                </div>
                
                <button onClick={handleDispatch} className="w-full flex items-center justify-center gap-3 py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-2xl shadow-md transition-all mt-4 cursor-pointer">
                  <PhoneCall className="w-5 h-5" />
                  Call Emergency Dispatch
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Visual In-App Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-auto transition-all duration-300 transform scale-100 opacity-100">
          <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] border border-slate-800 flex items-start gap-3.5 relative overflow-hidden ring-1 ring-white/10">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldAlert className="w-5 h-5 animate-pulse text-emerald-400" />
            </div>
            <div className="flex-1 space-y-1">
              <h5 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-2">
                {lang === 'en' ? 'Safety Protocols Active' : 'सुरक्षा प्रोटोकॉल सक्रिय'}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h5>
              <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                {lang === 'en' ? toast.messageEn : toast.messageHi}
              </p>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-800 transition-all active:scale-95 shrink-0"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* FULL-SCREEN SAFETY PROTOCOLS SCREEN OVERLAY */}
      {showSafetyScreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex justify-end animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white h-full flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-300">
            
            {/* Pulsing red SOS accent bar at top */}
            <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse"></div>

            {/* HEADER */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shadow-inner danger-glow">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    {lang === 'en' ? 'SOS Safety Isolation Guides' : 'एसओएस सुरक्षा अलगाव दिशानिर्देश'}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase mt-0.5">
                    {lang === 'en' ? 'Real-time API Secured guidelines' : 'वास्तविक समय एपीआई सुरक्षित दिशानिर्देश'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowSafetyScreen(false)}
                className="p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CATEGORY SELECTOR TABS */}
            <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
              {['all', 'electrical', 'gas', 'plumbing', 'general'].map((cat) => {
                const labelEn = cat === 'all' ? 'All Guides' : cat === 'electrical' ? 'Electrical' : cat === 'gas' ? 'Gas Leak' : cat === 'plumbing' ? 'Plumbing' : 'Security Checks';
                const labelHi = cat === 'all' ? 'सभी मार्गदर्शिकाएँ' : cat === 'electrical' ? 'बिजली' : cat === 'gas' ? 'गैस रिसाव' : cat === 'plumbing' ? 'नलसाजी' : 'सुरक्षा जाँच';
                const isActive = activeSafetyCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveSafetyCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-slate-950 text-white shadow-md' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {lang === 'en' ? labelEn : labelHi}
                  </button>
                );
              })}
            </div>

            {/* DYNAMIC SCROLLABLE LIST OF PROTOCOLS */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingSafety ? (
                // SKELETON LOADERS
                <div className="space-y-6 animate-pulse">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-2xl"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-full"></div>
                        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                        <div className="h-3 bg-slate-200 rounded w-4/5"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : safetyError ? (
                // ERROR VIEW
                <div className="py-12 text-center space-y-3">
                  <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-full">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-800">{safetyError}</h4>
                  <button 
                    onClick={() => {
                      setLoadingSafety(true);
                      fetch('/api/safety-protocols')
                        .then(res => res.json())
                        .then(d => setSafetyProtocols(d.protocols))
                        .catch(() => setSafetyError('Failed to load safety protocols.'))
                        .finally(() => setLoadingSafety(false));
                    }}
                    className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
                  >
                    Retry Loading
                  </button>
                </div>
              ) : (
                // GUIDELINES LISTING
                safetyProtocols
                  .filter(p => activeSafetyCategory === 'all' || p.category === activeSafetyCategory)
                  .map((proto) => {
                    // Helper to get matching Lucide icon dynamic rendering
                    const renderProtoIcon = (iconName: string) => {
                      const props = { className: "w-5 h-5" };
                      if (iconName === 'Zap') return <Zap {...props} className="w-5 h-5 text-amber-500" />;
                      if (iconName === 'Flame') return <Flame {...props} className="w-5 h-5 text-red-500" />;
                      if (iconName === 'Droplet') return <Droplet {...props} className="w-5 h-5 text-blue-500" />;
                      return <ShieldCheck {...props} className="w-5 h-5 text-emerald-500" />;
                    };

                    const steps = lang === 'en' ? proto.stepsEn : proto.stepsHi;
                    const title = lang === 'en' ? proto.titleEn : proto.titleHi;
                    
                    const severityColors = 
                      proto.severity === 'critical' ? 'bg-red-50 text-red-700 border-red-200/50' : 
                      proto.severity === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200/50' : 
                      'bg-blue-50 text-blue-700 border-blue-200/50';

                    return (
                      <div 
                        key={proto.id}
                        className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        {/* Title Section */}
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                              {renderProtoIcon(proto.icon)}
                            </div>
                            <h4 className="font-extrabold text-slate-900 text-sm md:text-base leading-tight">{title}</h4>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border tracking-wider ${severityColors}`}>
                            {proto.severity}
                          </span>
                        </div>

                        {/* Interactive Steps Checklist */}
                        <div className="p-5 space-y-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                            {lang === 'en' ? 'Actions Checklist' : 'कार्रवाई चेकलिस्ट'}
                          </p>
                          {steps.map((step: string, idx: number) => {
                            const stepKey = `${proto.id}_${idx}`;
                            const isChecked = !!checkedSteps[stepKey];
                            return (
                              <div 
                                key={idx}
                                onClick={() => toggleCheckedStep(stepKey)}
                                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer active:scale-[0.99] select-none ${
                                  isChecked 
                                    ? 'bg-emerald-50/40 border-emerald-300/60 text-emerald-900 shadow-sm' 
                                    : 'bg-slate-50/50 border-slate-150 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                <div className={`w-5 h-5 shrink-0 rounded-lg flex items-center justify-center border transition-all ${
                                  isChecked 
                                    ? 'bg-emerald-500 border-emerald-500 text-white scale-110 shadow-sm shadow-emerald-500/20' 
                                    : 'bg-white border-slate-300 text-transparent'
                                }`}>
                                  <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                                </div>
                                <span className={`text-xs font-semibold leading-relaxed transition-all ${
                                  isChecked ? 'line-through text-emerald-800/60 font-medium' : ''
                                }`}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* SAFETY ASSURANCE FOOTER */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/80 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                <p className="text-xs text-slate-500 font-bold leading-normal">
                  {lang === 'en' 
                    ? 'Emergency services have been isolated for your sector. Help is actively dispatched.' 
                    : 'आपके क्षेत्र के लिए आपातकालीन सेवाएं सक्रिय कर दी गई हैं। सहायता भेजी जा रही है।'}
                </p>
              </div>
              <a 
                href="tel:+919988776655" 
                className="w-full flex items-center justify-center gap-2 py-4 bg-red-700 hover:bg-red-800 text-white font-black text-sm rounded-2xl shadow-lg transition-all transform active:scale-95 cursor-pointer shadow-red-700/25"
              >
                <PhoneCall className="w-4 h-4" />
                {lang === 'en' ? 'Direct Hotline: Call Emergency Desk' : 'डायरेक्ट हॉटलाइन: इमरजेंसी डेस्क पर कॉल करें'}
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
