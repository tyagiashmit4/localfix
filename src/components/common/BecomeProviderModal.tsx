'use client';

import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  MapPin, 
  UserCheck, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  ShieldCheck, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useStore } from '../../store/useStore';

interface BecomeProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BecomeProviderModal({ isOpen, onClose }: BecomeProviderModalProps) {
  const { data: session, update: updateSession } = useSession();
  const { addNotification, cities, serviceCategories } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [category, setCategory] = useState('electrician');
  const [experience, setExperience] = useState('3');
  const [pricePerHr, setPricePerHr] = useState('249');
  const [city, setCity] = useState('aligarh');
  const [areas, setAreas] = useState('Civil Lines, Ramghat Road');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bioEn, setBioEn] = useState('');
  const [bioHi, setBioHi] = useState('');
  const [certifications, setCertifications] = useState('ITI Certified Electrician');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) {
      const rate = Number(pricePerHr);
      if (!pricePerHr || isNaN(rate) || rate < 99 || rate > 1000) {
        setError('Please enter a valid hourly rate between ₹99 and ₹1000.');
        return;
      }
      const exp = Number(experience);
      if (!experience || isNaN(exp) || exp < 0 || exp > 50) {
        setError('Please enter a valid experience between 0 and 50 years.');
        return;
      }
    } else if (step === 2) {
      if (!areas.trim() || areas.trim().length < 5) {
        setError('Please specify valid service areas (minimum 5 characters).');
        return;
      }
    } else if (step === 3) {
      const cleanPhone = phone.trim();
      if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
        setError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
        return;
      }
      if (whatsapp.trim() && !/^[6-9]\d{9}$/.test(whatsapp.trim())) {
        setError('Please enter a valid 10-digit WhatsApp mobile number.');
        return;
      }
      if (!bioEn.trim() || bioEn.trim().length < 15) {
        setError('Please write a slightly longer English bio (minimum 15 characters).');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanAadhaar = aadhaarNumber.replace(/\s+/g, '');
    if (!/^\d{12}$/.test(cleanAadhaar)) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    if (!aadhaarFile) {
      setError('Please upload your Aadhaar Card Front Scan document.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        phone,
        whatsapp: whatsapp || phone,
        category,
        experience: Number(experience),
        pricePerHr: Number(pricePerHr),
        bioEn,
        bioHi: bioHi || bioEn,
        areas: areas.split(',').map(a => a.trim()).filter(Boolean),
        certificationsEn: certifications.split(',').map(c => c.trim()).filter(Boolean),
        certificationsHi: certifications.split(',').map(c => c.trim()).filter(Boolean),
        city,
        aadhaarNumber,
      };

      const res = await fetch('/api/providers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register as provider');
      }

      addNotification(
        'Congratulations! You are now registered as a Provider Partner.',
        'बधाई हो! अब आप एक प्रदाता भागीदार के रूप में पंजीकृत हैं।'
      );

      // Force NextAuth to reload and update session token
      await updateSession();
      
      setLoading(false);
      onClose();
      // Reload page to re-render role-specific website view
      window.location.reload();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'An error occurred during registration.';
      setError(errMsg);
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white flex justify-between items-center relative">
          <div className="absolute top-0 right-0 p-8 bg-white/5 rounded-full blur-2xl"></div>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <h3 className="text-lg font-extrabold tracking-tight">Become an AuraServe Partner</h3>
            </div>
            <p className="text-blue-100 text-xs mt-0.5">Set up your business profile and earn 100% of your bookings!</p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 grid grid-cols-4 gap-2">
          {[
            { step: 1, label: 'Service', icon: <Briefcase className="w-3.5 h-3.5" /> },
            { step: 2, label: 'Location', icon: <MapPin className="w-3.5 h-3.5" /> },
            { step: 3, label: 'Profile', icon: <FileText className="w-3.5 h-3.5" /> },
            { step: 4, label: 'Verification', icon: <UserCheck className="w-3.5 h-3.5" /> },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === item.step 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-4 ring-blue-50' 
                  : step > item.step 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-200 text-slate-500'
              }`}>
                {step > item.step ? '✓' : item.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                step === item.step ? 'text-blue-600' : 'text-slate-400'
              }`}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Modal body & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* STEP 1: Service Details */}
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-200">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  {serviceCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nameEn} ({cat.nameHi})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hourly Rate (₹/hr)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={pricePerHr}
                      onChange={(e) => setPricePerHr(e.target.value)}
                      placeholder="e.g. 249"
                      required
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Experience (Years)</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 5"
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location Info */}
          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-200">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Base City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.nameEn}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service Areas (comma-separated)</label>
                <textarea
                  value={areas}
                  onChange={(e) => setAreas(e.target.value)}
                  placeholder="e.g. Civil Lines, Ramghat Road, Medical College"
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Phone & Bio Profile */}
          {step === 3 && (
            <div className="space-y-3.5 animate-in slide-in-from-right duration-200 max-h-[350px] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    required
                    pattern="[6-9][0-9]{9}"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Leave empty if same"
                    pattern="[6-9][0-9]{9}"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bio (English)</label>
                <textarea
                  value={bioEn}
                  onChange={(e) => setBioEn(e.target.value)}
                  placeholder="Tell clients about your skills, quality guarantee, and service standards..."
                  required
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bio (Hindi - Optional)</label>
                <textarea
                  value={bioHi}
                  onChange={(e) => setBioHi(e.target.value)}
                  placeholder="अपने कौशल और सेवा की गुणवत्ता के बारे में बताएं..."
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Certifications (comma-separated)</label>
                <input
                  type="text"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  placeholder="e.g. ITI Certified Electrician, Govt Licensed Wireman"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Verification Docs */}
          {step === 4 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-200">
              <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-xs text-slate-600 space-y-1">
                  <span className="font-extrabold text-slate-800 block">Trust & Verification Policy</span>
                  <p>To list your services in Tier-2/Tier-3 cities, we verify identity via Aadhaar Card. Your data is encrypted and used only for verification.</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aadhaar Card Number</label>
                <input
                  type="text"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  placeholder="e.g. 1234 5678 9012"
                  maxLength={14}
                  required
                  pattern="[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload Aadhaar Front Scan (Simulation)</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50">
                  <span className="text-2xl block mb-1.5">🪪</span>
                  <span className="text-xs text-slate-600 font-bold block">
                    {aadhaarFile ? aadhaarFile.name : 'Select Aadhaar Scan Document'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Supports PDF, JPG, PNG (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setAadhaarFile(e.target.files[0]);
                    }}
                    className="hidden"
                    id="aadhaar-file-input"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('aadhaar-file-input')?.click()}
                    className="mt-3 py-1.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                  >
                    Browse File
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-500/10"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !aadhaarNumber}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/15"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Start Business</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
