'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    t
  } = useStore();

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('booking');

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
    { label: 'Overview', href: '/', icon: <CalendarCheck className="w-4 h-4" /> },
    { label: 'My Bookings', href: '/dashboard', icon: <Briefcase className="w-4 h-4" />, badge: `${activeBookings.length}`, badgeColor: 'bg-blue-100 text-blue-700' },
    { label: 'Saved Experts', href: '/dashboard', icon: <Heart className="w-4 h-4" />, badge: `${savedProviderIds.length}` },
  ];

  const bottomSidebarLinks = [
    { label: 'Account Settings', href: '/dashboard', icon: <Settings className="w-4 h-4" /> },
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
          userName="Abhishek Tyagi"
          userSubtitle="Premium Client • Aligarh"
          links={sidebarLinks}
          bottomLinks={bottomSidebarLinks}
        />
      }
    >
      <div className="space-y-6">
        
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
                {getGreeting()}, Abhishek! 👋
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
      </div>
    </DashboardLayout>
  );
}
