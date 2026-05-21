'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  AlertTriangle
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Booking } from '../../app/data';

export default function SOSPortal() {
  const router = useRouter();
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);
  
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
          <button onClick={() => router.push('/dashboard')} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl">
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
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">
              <MapPin className="w-5 h-5" /> Professional Tracking
            </Link>
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">
              <Clock className="w-5 h-5" /> Service History
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">
              <Settings className="w-5 h-5" /> Settings
            </Link>
          </nav>
        </div>

        <div className="space-y-2 border-t border-slate-200 pt-4">
          <button onClick={handleDispatch} className="w-full flex items-center justify-center gap-2 px-3 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-sm font-bold shadow-md transition-colors cursor-pointer">
            Call Dispatch
          </button>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">
            <ShieldAlert className="w-5 h-5" /> Safety Protocols
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </Link>
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
    </div>
  );
}
