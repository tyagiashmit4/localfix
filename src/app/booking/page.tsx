'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ArrowLeft, 
  Gift, 
  ShieldCheck, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Booking } from '../../app/data';

export default function BookingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const {
    lang,
    selectedCity,
    selectedProvider,
    createBooking,
    addNotification,
    t
  } = useStore();

  // Redirect if unauthenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/booking');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session) {
    return null;
  }

  // Local state variables for forms & coupon wizard
  const [bookingDate, setBookingDate] = useState('2026-05-22');
  const [bookingTime, setBookingTime] = useState('10:00 AM - 12:00 PM');
  const [bookingAddress, setBookingAddress] = useState('Dodhpura, Civil Lines');
  const [bookingNotes, setBookingNotes] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [bookingStep, setBookingStep] = useState<number>(1); // 1 = details, 2 = payment, 3 = success
  const [currentBookingId, setCurrentBookingId] = useState('');

  if (!selectedProvider) {
    return (
      <div className="max-w-md mx-auto p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4 mt-8">
        <p className="text-slate-500 font-bold">Please select an expert provider first to book.</p>
        <button 
          onClick={() => router.push('/providers')}
          className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
        >
          View Local Experts
        </button>
      </div>
    );
  }

  // Apply Coupon promo code discount logic
  const applyPromoCode = () => {
    const code = promoCode.toUpperCase().trim();
    if (code === 'LOCAL30') {
      setAppliedPromo('LOCAL30');
      setPromoDiscount(150);
      addNotification("Promo LOCAL30 Applied: ₹150 off!", "प्रोमो LOCAL30 लागू: ₹150 की छूट!");
    } else if (code === 'WELCOME100') {
      setAppliedPromo('WELCOME100');
      setPromoDiscount(100);
      addNotification("Promo WELCOME100 Applied: ₹100 off!", "प्रोमो WELCOME100 लागू: ₹100 की छूट!");
    } else {
      addNotification("Invalid Promo Coupon Code", "अमान्य प्रोमो कूपन कोड");
    }
  };

  const handleCreateBooking = () => {
    if (!bookingAddress.trim() || bookingAddress.trim().length < 10) {
      addNotification("Please enter a slightly longer address (minimum 10 characters).", "कृपया थोड़ा लंबा पता दर्ज करें (न्यूनतम 10 वर्ण)।");
      return;
    }
    const orderRef = 'LF-' + Date.now();
    setCurrentBookingId(orderRef);
    setBookingStep(2);
  };

  const finalizePayment = async () => {
    const finalBill = Math.max(50, selectedProvider.pricePerHr - promoDiscount);
    const newBooking: Booking = {
      id: currentBookingId,
      customerName: 'Abhishek Tyagi',
      customerPhone: '+91 99887 76655',
      customerAddress: bookingAddress,
      city: selectedCity,
      serviceCategory: selectedProvider.category,
      providerId: selectedProvider.id,
      providerName: selectedProvider.name,
      providerAvatar: selectedProvider.avatar,
      date: bookingDate,
      timeSlot: bookingTime,
      status: 'pending',
      price: finalBill,
      notes: bookingNotes,
      paymentStatus: 'paid'
    };

    await createBooking(newBooking);
    addNotification(
      `🎉 Service booked with ${selectedProvider.name}! ID: ${currentBookingId}`,
      `🎉 ${selectedProvider.name} के साथ सेवा बुक की गई! आईडी: ${currentBookingId}`
    );

    setBookingStep(3);
  };

  const handleGoToDashboard = () => {
    setBookingStep(1);
    router.push('/dashboard');
  };

  const handleBackToMarketplace = () => {
    setBookingStep(1);
    router.push('/');
  };

  const finalBillAmount = Math.max(50, selectedProvider.pricePerHr - promoDiscount);

  return (
    <div className="max-w-2xl mx-auto space-y-8 mt-4">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => router.push(`/providers/${selectedProvider.id}`)} 
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Marketplace Booking Details
          </h2>
          <p className="text-xs text-slate-400">Step details for provider {selectedProvider.name}</p>
        </div>
      </div>

      {/* Stepper Details UI */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${bookingStep === 1 ? 'bg-blue-600 text-white animate-pulse' : 'bg-green-600 text-white'}`}>1</span>
          <span className={bookingStep === 1 ? 'text-blue-600' : 'text-slate-500'}>Slot & Address</span>
        </div>
        <div className="h-px w-10 bg-slate-300"></div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${bookingStep === 2 ? 'bg-blue-600 text-white animate-pulse' : bookingStep === 3 ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-400'}`}>2</span>
          <span className={bookingStep === 2 ? 'text-blue-600' : 'text-slate-500'}>Razorpay Gateway</span>
        </div>
        <div className="h-px w-10 bg-slate-300"></div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${bookingStep === 3 ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-400'}`}>3</span>
          <span className={bookingStep === 3 ? 'text-green-600' : 'text-slate-500'}>Confirmation</span>
        </div>
      </div>

      {/* STEP 1: FILL BOOKING DETAILS */}
      {bookingStep === 1 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* Summary provider */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-4">
            <img src={selectedProvider.avatar} alt={selectedProvider.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <span className="block font-bold text-slate-800 text-sm">{selectedProvider.name}</span>
              <span className="block text-xs text-slate-500 capitalize">{selectedProvider.category} • ₹{selectedProvider.pricePerHr}/hr</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Select Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Select Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Select Time Slot</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Home Address coordinates in {selectedCity}</label>
              <textarea
                rows={2}
                value={bookingAddress}
                onChange={(e) => setBookingAddress(e.target.value)}
                placeholder="Flat/House number, Society name, Area..."
                className="w-full text-slate-700 bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Special instructions */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Special Notes / Issue Description (Optional)</label>
              <textarea
                rows={2}
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="e.g. Please bring extra wire / tap..."
                className="w-full text-slate-700 bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Promo coupon wrapper */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">{t('promoLabel')}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Try LOCAL30 or WELCOME100"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  onClick={applyPromoCode}
                  className="px-4 py-2 bg-slate-950 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Apply Code
                </button>
              </div>

              {appliedPromo && (
                <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 p-2 rounded-lg border border-green-200">
                  <Gift className="w-4 h-4" />
                  <span>Promo <strong>{appliedPromo}</strong> applied successfully! Discount: ₹{promoDiscount}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between font-semibold text-slate-600">
              <span>Base Hourly Price:</span>
              <span>₹{selectedProvider.pricePerHr}</span>
            </div>
            {appliedPromo && (
              <div className="flex justify-between font-semibold text-emerald-600">
                <span>Promo Discount:</span>
                <span>-₹{promoDiscount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-100">
              <span>Estimated Final Price:</span>
              <span>₹{finalBillAmount}</span>
            </div>
          </div>

          <button
            onClick={handleCreateBooking}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
          >
            Proceed to Secure Checkout
          </button>
        </div>
      )}

      {/* STEP 2: SIMULATED SECURE RAZORPAY GATEWAY */}
      {bookingStep === 2 && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"></div>

          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-extrabold text-sm text-slate-100">{t('paymentTitle')}</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">SECURE INTEGRATION</span>
          </div>

          <div className="space-y-4">
            <div className="text-center py-6 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-inner">
              <span className="text-slate-400 text-xs font-semibold block">
                {lang === 'en' ? 'Amount to Pay:' : 'भुगतान योग्य राशि:'}
              </span>
              <span className="text-4xl font-black text-white mt-1 block">₹{finalBillAmount}</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mt-1.5">
                No Hidden platform fees
              </span>
            </div>

            <div className="p-4 bg-slate-800/40 rounded-xl text-xs space-y-2 border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Merchant:</span>
                <span className="font-bold">LocalFix India Marketplace</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Booking Ref ID:</span>
                <span className="font-bold text-blue-400">{currentBookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Authorized Client:</span>
                <span className="font-bold text-slate-200">Abhishek Tyagi (+91 99887 76655)</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={finalizePayment}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{t('payButton')}</span>
            </button>
            <button
              onClick={() => setBookingStep(1)}
              className="w-full py-3 bg-transparent text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel transaction
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: BOOKING SUCCESS */}
      {bookingStep === 3 && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border border-green-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">{t('bookingSuccess')}</h3>
            <p className="text-slate-500 text-sm font-semibold max-w-sm mx-auto">{t('bookingSuccessDesc')}</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl max-w-sm mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Order ID:</span>
              <span className="font-bold text-slate-800">{currentBookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Expert name:</span>
              <span className="font-bold text-slate-800">{selectedProvider.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date slot:</span>
              <span className="font-bold text-slate-800">{bookingDate} • {bookingTime}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <button
              onClick={handleGoToDashboard}
              className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              {t('trackBooking')}
            </button>
            <button
              onClick={handleBackToMarketplace}
              className="flex-1 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-200 rounded-xl text-xs cursor-pointer"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
