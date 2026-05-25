'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Wallet,
  MapPin,
  Heart,
  HelpCircle,
  Send,
  CalendarCheck,
  Clock,
  Star,
  Zap,
  Droplet,
  Wind,
  Sparkles,
  BookOpen,
  Settings,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SupportTicket } from '../../app/data';
import DashboardLayout from '../common/DashboardLayout';
import DashboardSidebar from '../common/DashboardSidebar';

interface CustomerViewProps {
  onOpenBecomeProvider: () => void;
}

export default function CustomerView({ onOpenBecomeProvider }: CustomerViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const {
    lang,
    bookings,
    updateBooking,
    walletBalance,
    setWalletBalance,
    savedProviderIds,
    providers,
    serviceCategories,
    setSelectedProvider,
    supportTickets,
    setSupportTickets,
    addNotification,
    t,
    user,
    updateUserProfile
  } = useStore();

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('booking');

  // Profile Edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleStartEditProfile = () => {
    setEditName(user?.name || 'Abhishek Tyagi');
    setEditPhone(user?.phone || '+91 99887 76655');
    setEditEmail(user?.email || 'customer@localfix.com');
    setFormError('');
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!editName.trim()) {
      setFormError('Name is required.');
      return;
    }
    if (editName.trim().length < 2) {
      setFormError('Name must be at least 2 characters.');
      return;
    }

    const cleanPhone = editPhone.trim();
    if (!cleanPhone) {
      setFormError('Phone number is required.');
      return;
    }

    const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setFormError('Please enter a valid 10-digit Indian phone number (e.g., 9876543210).');
      return;
    }

    const cleanEmail = editEmail.trim();
    if (!cleanEmail) {
      setFormError('Email address is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setIsSavingProfile(true);
    const result = await updateUserProfile(editName.trim(), cleanPhone, cleanEmail);
    setIsSavingProfile(false);

    if (result.success) {
      setIsEditingProfile(false);
    } else {
      setFormError(result.error || 'Failed to save profile. Please try again.');
    }
  };

  // Computed stats
  const activeBookings = bookings.filter(b => b.status === 'pending' || b.status === 'accepted');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalSpend = bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.price, 0);

  // Cancel booking with Wallet Refund
  const handleCancelBooking = async (bookingId: string, price: number) => {
    await updateBooking(bookingId, { status: 'cancelled', paymentStatus: 'refunded' });
    setWalletBalance(walletBalance + price);
    addNotification(
      `Refunded ₹${price} to your wallet for cancelled booking ${bookingId}.`,
      `रद्द बुकिंग ${bookingId} के लिए आपके वॉलेट में ₹${price} वापस किए गए।`
    );
  };

  // Reschedule booking
  const handleRescheduleBooking = async (bookingId: string) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD):", "2026-05-24");
    if (!newDate) return;
    await updateBooking(bookingId, { date: newDate });
    addNotification(
      `Booking ${bookingId} rescheduled to ${newDate}.`,
      `बुकिंग ${bookingId} की तारीख बदलकर ${newDate} कर दी गई है।`
    );
  };

  // Support ticket creation
  const handleCreateSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;
    const newTicket: SupportTicket = {
      id: 'T-' + Math.floor(900 + Math.random() * 100),
      subjectEn: ticketSubject,
      subjectHi: `सहयोग अनुरोध: ${ticketSubject}`,
      status: 'open',
      category: ticketCategory,
      date: new Date().toISOString().split('T')[0]
    };
    setSupportTickets([newTicket, ...supportTickets]);
    setTicketSubject('');
    addNotification("Support ticket registered!", "समर्थन टिकट पंजीकृत किया गया!");
  };

  const handleBookSavedProvider = (pId: string) => {
    const found = providers.find(p => p.id === pId);
    if (found) {
      setSelectedProvider(found);
      router.push(`/booking`);
    }
  };

  const getCategoryEmoji = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return '⚡';
      case 'Droplet': return '💧';
      case 'Wind': return '💨';
      case 'BookOpen': return '📚';
      case 'Sparkles': return '✨';
      default: return '🔧';
    }
  };

  const sidebarLinks = [
    { label: 'Overview', href: '/?tab=overview', icon: <CalendarCheck className="w-4 h-4" /> },
    { label: 'My Bookings', href: '/?tab=bookings', icon: <Briefcase className="w-4 h-4" />, badge: `${activeBookings.length}`, badgeColor: 'bg-blue-100 text-blue-700' },
    { label: 'Saved Experts', href: '/?tab=saved', icon: <Heart className="w-4 h-4" />, badge: `${savedProviderIds.length}` },
  ];

  const bottomSidebarLinks = [
    { label: 'Account Settings', href: '/?tab=settings', icon: <Settings className="w-4 h-4" /> },
  ];

  // Dynamic time-of-day greeting
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <DashboardLayout
      sidebar={
        <DashboardSidebar
          role="CUSTOMER"
          userName={user?.name || "Abhishek Tyagi"}
          userSubtitle="Premium Client • Aligarh"
          links={sidebarLinks}
          bottomLinks={bottomSidebarLinks}
        />
      }
    >
      <div className="space-y-6">
        
        {/* TAB 1: OVERVIEW HUB */}
        {activeTab === 'overview' && (
          <>
            {/* Welcome header + KPI cards */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-600/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-2xl"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-blue-200 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Customer Hub
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-2">
                    {getGreeting()}, {user?.name || 'Abhishek'}! 👋
                  </h1>
                  <p className="text-blue-100 text-sm mt-1">Here is a quick overview of your home maintenance activities.</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push('/categories')}
                    className="py-3 px-5 bg-white text-blue-600 font-extrabold rounded-2xl text-xs shadow-md transition-all hover:bg-slate-50 cursor-pointer"
                  >
                    Book a Service
                  </button>
                  
                  <button
                    onClick={onOpenBecomeProvider}
                    className="py-3 px-5 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white font-extrabold rounded-2xl text-xs border border-white/10 transition-all cursor-pointer"
                  >
                    Become a Provider
                  </button>
                </div>
              </div>

              {/* Grid Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 relative z-10">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-blue-200">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Active Jobs</span>
                  </div>
                  <span className="text-3xl font-black">{activeBookings.length}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Completed</span>
                  </div>
                  <span className="text-3xl font-black">{completedBookings.length}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-amber-300">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Total Spend</span>
                  </div>
                  <span className="text-3xl font-black">₹{totalSpend}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-emerald-200">
                    <Wallet className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Wallet Balance</span>
                  </div>
                  <span className="text-3xl font-black">₹{walletBalance}</span>
                </div>
              </div>
            </div>

            {/* Active Bookings Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900">Active Bookings</h3>
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{activeBookings.length} active</span>
              </div>

              {activeBookings.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">No active bookings right now.</p>
                  <button onClick={() => router.push('/categories')} className="mt-3 py-2 px-4 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-blue-700 transition-colors">
                    Book a Service
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeBookings.map(b => (
                    <div key={b.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img src={b.providerAvatar} alt={b.providerName} className="w-11 h-11 rounded-2xl object-cover" />
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm">{b.providerName}</h4>
                            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider capitalize">{b.serviceCategory}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-base font-black text-slate-900 block">₹{b.price}</span>
                          <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-black capitalize ${
                            b.status === 'pending' ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-blue-50 border border-blue-200 text-blue-700'
                          }`}>
                            {b.status === 'pending' ? '⏳ Waiting' : '🚀 On the way'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-2.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-700 block">{b.customerAddress}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">{b.date} • {b.timeSlot}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full bg-blue-600 rounded-full transition-all duration-300 ${b.status === 'pending' ? 'w-1/3' : 'w-2/3'}`}></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{b.status === 'pending' ? '33%' : '66%'}</span>
                      </div>

                      {b.status === 'pending' && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleRescheduleBooking(b.id)}
                            className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-extrabold rounded-xl text-[10px] cursor-pointer transition-colors"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancelBooking(b.id, b.price)}
                            className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold rounded-xl text-[10px] cursor-pointer transition-colors"
                          >
                            Cancel & Refund
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Services */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900">Recommended Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {serviceCategories.slice(0, 4).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => router.push('/categories')}
                    className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 mb-3 transition-colors text-xl font-bold">
                      {getCategoryEmoji(cat.icon)}
                    </div>
                    <h4 className="text-xs font-black text-slate-800 group-hover:text-blue-600 transition-colors">{lang === 'en' ? cat.nameEn : cat.nameHi}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">From ₹{cat.startingPrice}</p>
                    <div className="flex items-center gap-1 mt-2.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-slate-600">{cat.rating}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 ml-auto group-hover:text-blue-500 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Booking History */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-base font-black text-slate-900">Booking History</h3>
                {bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').length === 0 ? (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center text-xs text-slate-400 font-semibold">No completed bookings yet.</div>
                ) : (
                  <div className="space-y-3">
                    {bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').map(b => (
                      <div key={b.id} className="bg-white p-4 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-4 hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <img src={b.providerAvatar} alt={b.providerName} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <span className="block text-xs font-extrabold text-slate-800">{b.providerName}</span>
                            <span className="block text-[10px] text-slate-400 font-semibold">{b.date} • {b.serviceCategory}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-800">₹{b.price}</span>
                          <span className={`block px-2.5 py-0.5 rounded-full text-[9px] font-black mt-1 ${
                            b.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {b.status === 'completed' ? '✓ Done' : '✗ Cancelled'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Saved & Support */}
              <div className="lg:col-span-5 space-y-6">
                {/* Saved Experts */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
                  <h4 className="font-extrabold text-xs text-slate-950 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <Heart className="w-4 h-4 text-rose-500 fill-current" />
                    <span>Saved Experts</span>
                  </h4>
                  {savedProviderIds.length === 0 ? (
                    <p className="text-[11px] text-slate-400 font-medium">Save experts on searches to quick-book later.</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {providers.filter(p => savedProviderIds.includes(p.id)).map(p => (
                        <div key={p.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-xl object-cover" />
                            <div>
                              <span className="block text-[11px] font-extrabold text-slate-800">{p.name}</span>
                              <span className="block text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">{p.category}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleBookSavedProvider(p.id)}
                            className="py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[10px] font-black rounded-lg cursor-pointer transition-colors"
                          >
                            Book
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Support Tickets */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
                  <h4 className="font-extrabold text-xs text-slate-950 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <HelpCircle className="w-4 h-4 text-slate-500" />
                    <span>Support Center</span>
                  </h4>

                  <form onSubmit={handleCreateSupportTicket} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Describe your issue..."
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <div className="flex justify-between items-center gap-2">
                      <select
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value)}
                        className="text-[10px] bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-600 focus:outline-none cursor-pointer font-bold"
                      >
                        <option value="booking">Booking issue</option>
                        <option value="payment">Refund/Payment</option>
                        <option value="other">Other</option>
                      </select>
                      <button type="submit" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-[10px] flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-blue-500/10">
                        <Send className="w-3 h-3" />
                        <span>Send</span>
                      </button>
                    </div>
                  </form>

                  <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
                    {supportTickets.map(ticket => (
                      <div key={ticket.id} className="py-3 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                        <div>
                          <span className="block font-bold text-slate-700">{lang === 'en' ? ticket.subjectEn : ticket.subjectHi}</span>
                          <span className="block text-[9px] text-slate-400 font-semibold mt-0.5">{ticket.id} • {ticket.date}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${ticket.status === 'open' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                          {ticket.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: MY BOOKINGS WORKSPACE */}
        {activeTab === 'bookings' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">My Bookings Portal</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage schedules, active dispatches, and work history receipts</p>
              </div>
              <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                {activeBookings.length} active leads
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Active Bookings Timeline */}
              <div className="lg:col-span-6 space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Active timelines</span>
                {activeBookings.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl text-center text-xs text-slate-400">
                    No active maintenance tasks currently dispatched.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeBookings.map(b => (
                      <div key={b.id} className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <img src={b.providerAvatar} alt={b.providerName} className="w-9 h-9 rounded-xl object-cover" />
                            <div>
                              <h4 className="font-extrabold text-slate-800 text-xs">{b.providerName}</h4>
                              <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider capitalize">{b.serviceCategory}</p>
                            </div>
                          </div>
                          <span className="text-sm font-black text-slate-800">₹{b.price}</span>
                        </div>

                        <div className="text-[11px] text-slate-500 space-y-1 border-t border-b border-slate-200/60 py-2.5">
                          <div className="flex justify-between"><span className="text-slate-400">Scheduled Date:</span><span className="font-bold text-slate-700">{b.date}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Time Slot:</span><span className="font-bold text-slate-700">{b.timeSlot}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Status:</span><span className="font-extrabold text-blue-600 capitalize">{b.status}</span></div>
                        </div>

                        {b.status === 'pending' && (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleRescheduleBooking(b.id)}
                              className="py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-extrabold rounded-lg text-[10px] cursor-pointer transition-colors"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleCancelBooking(b.id, b.price)}
                              className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold rounded-lg text-[10px] cursor-pointer transition-colors"
                            >
                              Cancel Booking
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Complete Booking History */}
              <div className="lg:col-span-6 space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Past Work logs</span>
                {bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl text-center text-xs text-slate-400">
                    No past service history logs found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').map(b => (
                      <div key={b.id} className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img src={b.providerAvatar} alt={b.providerName} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <span className="block font-extrabold text-slate-800">{b.providerName}</span>
                            <span className="block text-[9px] text-slate-400 font-semibold">{b.date} • {b.serviceCategory}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-slate-800">₹{b.price}</span>
                          <span className={`block px-2.5 py-0.5 rounded-full text-[8px] font-black tracking-wider uppercase mt-1 ${
                            b.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {b.status === 'completed' ? 'Done' : 'Cancelled'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SAVED EXPERTS WORKSPACE */}
        {activeTab === 'saved' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Saved Experts Marketplace</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Quickly discover and place instant maintenance dispatches with your favorited specialists</p>
              </div>
              <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-current text-rose-600" />
                {savedProviderIds.length} saved
              </span>
            </div>

            {savedProviderIds.length === 0 ? (
              <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-3">
                <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Your Favorited List is Empty</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Click the heart button on active providers listed in your coordinate search to save them.</p>
                </div>
                <button onClick={() => router.push('/providers')} className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-sm">
                  Search Local Experts
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.filter(p => savedProviderIds.includes(p.id)).map(p => (
                  <div key={p.id} className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <span className="block font-black text-slate-800 text-xs">{p.name}</span>
                        <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider capitalize mt-0.5">{p.category}</span>
                        <span className="block text-[10px] text-blue-600 font-black mt-1">₹{p.pricePerHr}/hr starting</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookSavedProvider(p.id)}
                      className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl cursor-pointer shadow-md shadow-blue-500/10 transition-colors shrink-0"
                    >
                      Book Dispatch
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ACCOUNT SETTINGS WORKSPACE */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <span>Account Settings Workspace</span>
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage your personal profile, notification triggers, and wallet balance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Profile Details Card */}
              {!isEditingProfile ? (
                <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Customer Profile Credentials</span>
                    <button
                      type="button"
                      onClick={handleStartEditProfile}
                      className="py-1 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-extrabold rounded-lg text-[10px] cursor-pointer transition-colors"
                    >
                      Edit Profile
                    </button>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-400 font-semibold">User ID:</span>
                      <span className="font-extrabold text-slate-800">{user?.id || 'usr_customer_abhishek'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-400 font-semibold">Full Name:</span>
                      <span className="font-extrabold text-slate-800">{user?.name || 'Abhishek Tyagi'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-400 font-semibold">Email ID:</span>
                      <span className="font-extrabold text-slate-800">{user?.email || 'customer@localfix.com'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Phone Number:</span>
                      <span className="font-extrabold text-slate-800">{user?.phone || '+91 99887 76655'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Edit Profile Credentials</span>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    {formError && (
                      <div className="text-[11px] text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl font-bold">
                        ⚠ {formError}
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        disabled={isSavingProfile}
                        className="w-full text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        disabled={isSavingProfile}
                        className="w-full text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        disabled={isSavingProfile}
                        className="w-full text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        disabled={isSavingProfile}
                        className="py-2 px-3.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold rounded-xl text-[10px] cursor-pointer transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-[10px] cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                      >
                        {isSavingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Wallet Manager Card */}
              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Wallet Balance manager</span>
                
                <div className="flex items-baseline gap-1 bg-slate-900 text-white p-4 rounded-xl shadow-inner">
                  <span className="text-2xl font-black">₹{walletBalance}</span>
                  <span className="text-[10px] text-slate-400 font-medium">available cash</span>
                </div>

                <div className="space-y-3">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Add simulated credits</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setWalletBalance(walletBalance + 500); addNotification("Added ₹500 credits to your wallet balance.", "आपके वॉलेट बैलेंस में ₹500 क्रेडिट जोड़े गए।"); }}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-[10px] transition-colors cursor-pointer shadow-sm text-center"
                    >
                      + ₹500
                    </button>
                    <button 
                      onClick={() => { setWalletBalance(walletBalance + 1000); addNotification("Added ₹1000 credits to your wallet balance.", "आपके वॉलेट बैलेंस में ₹1000 क्रेडिट जोड़े गए।"); }}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-[10px] transition-colors cursor-pointer shadow-sm text-center"
                    >
                      + ₹1000
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification settings */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Push System Alerts</span>
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                  <div>
                    <span className="font-extrabold text-xs text-slate-800 block">Immediate WhatsApp updates</span>
                    <span className="text-[10px] text-slate-400">Receive dispatch timings on active chats</span>
                  </div>
                  <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">ACTIVE</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">System Coordinates Language</span>
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                  <div>
                    <span className="font-extrabold text-xs text-slate-800 block">Bilingual Notifications</span>
                    <span className="text-[10px] text-slate-400">Hindi and English translations enabled</span>
                  </div>
                  <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
