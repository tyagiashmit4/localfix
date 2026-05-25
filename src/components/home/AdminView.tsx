'use client';

import React, { useState } from 'react';
import {
  X,
  Bell,
  AlertTriangle,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Settings,
  BarChart3,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  Eye,
  Activity,
  FileCheck,
  Zap,
  Server
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Provider } from '../../app/data';
import DashboardLayout from '../common/DashboardLayout';

export default function AdminView() {
  const {
    bookings,
    providers,
    setProviders,
    addNotification,
    supportTickets,
    setSupportTickets
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'disputes' | 'providers' | 'broadcast'>('overview');
  
  // Custom admin states
  const [customNotificationEn, setCustomNotificationEn] = useState('');
  const [customNotificationHi, setCustomNotificationHi] = useState('');
  const [adminSelectedProvider, setAdminSelectedProvider] = useState<Provider | null>(null);

  // Computed stats
  const unverifiedProviders = providers.filter(p => !p.aadhaarVerified);
  const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0);
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
  const aadhaarVerifiedPct = providers.length > 0
    ? Math.round((providers.filter(p => p.aadhaarVerified).length / providers.length) * 100)
    : 0;
  const openTickets = supportTickets.filter(t => t.status === 'open');

  // Admin actions: Approve Aadhaar via backend DB update!
  const handleAdminApproveAadhaar = async (providerId: string) => {
    try {
      const res = await fetch(`/api/providers/${providerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarVerified: true }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProviders(prev => prev.map(p => p.id === providerId ? updated : p));
        
        const pName = providers.find(p => p.id === providerId)?.name || 'Provider';
        addNotification(
          `Aadhaar verification shield approved for ${pName}!`,
          `${pName} के लिए आधार सत्यापन बैज स्वीकृत किया गया!`
        );
        
        setAdminSelectedProvider(null);
      } else {
        alert("Failed to update verification status in database.");
      }
    } catch (e) {
      console.error(e);
      alert("Error approving provider document.");
    }
  };

  const handleAdminRejectAadhaar = () => {
    setAdminSelectedProvider(null);
    alert("Biometric ID documentation did not match database records. Reject notification dispatched.");
  };

  const handleAdminBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNotificationEn.trim()) return;
    
    addNotification(
      `[GLOBAL BROADCAST] ${customNotificationEn}`, 
      `[ग्लोबल ब्रॉडकास्ट] ${customNotificationHi || customNotificationEn}`
    );
    
    setCustomNotificationEn('');
    setCustomNotificationHi('');
    alert("Global System Alert broadcasted to all users successfully!");
  };

  const handleResolveTicket = (ticketId: string) => {
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'resolved' } : t));
    addNotification(
      `Support Ticket ${ticketId} resolved by Platform Support.`,
      `सहायता टिकट ${ticketId} को प्लेटफॉर्म समर्थन द्वारा हल किया गया है।`
    );
  };

  const renderSidebar = () => {
    return (
      <aside className="w-full lg:w-64 shrink-0">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden sticky top-24">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-zinc-900 px-5 py-5 border-b border-slate-950">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                <Server className="w-5 h-5 text-slate-300" />
              </div>
              <div>
                <span className="text-white font-extrabold text-sm block leading-tight">
                  Aura<span className="text-blue-400">Admin</span>
                </span>
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-wider">Super Control</span>
              </div>
            </div>
          </div>

          {/* User overview */}
          <div className="px-5 py-4 border-b border-slate-950 bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-black text-sm border border-slate-700">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-black text-slate-100 truncate">Platform Admin</span>
                <span className="block text-[10px] text-slate-400 font-bold capitalize truncate">
                  Master Console
                </span>
              </div>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
              <Activity className="w-3 h-3 text-red-400 animate-pulse" />
              Live Server Mode
            </span>
          </div>

          {/* Navigation links */}
          <nav className="px-3 py-4 space-y-1 bg-slate-950/20">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-slate-700 text-white shadow-lg shadow-slate-800/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview Stats</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'queue'
                  ? 'bg-slate-700 text-white shadow-lg shadow-slate-800/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Verification Queue</span>
              </div>
              {unverifiedProviders.length > 0 && (
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${activeTab === 'queue' ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-400'}`}>
                  {unverifiedProviders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('disputes')}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'disputes'
                  ? 'bg-slate-700 text-white shadow-lg shadow-slate-800/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Dispute Desk</span>
              </div>
              {openTickets.length > 0 && (
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${activeTab === 'disputes' ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-400'}`}>
                  {openTickets.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('providers')}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'providers'
                  ? 'bg-slate-700 text-white shadow-lg shadow-slate-800/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Service Partners</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('broadcast')}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'broadcast'
                  ? 'bg-slate-700 text-white shadow-lg shadow-slate-800/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Broadcast Terminal</span>
              </div>
            </button>
          </nav>
        </div>
      </aside>
    );
  };

  return (
    <DashboardLayout sidebar={renderSidebar()}>
      <div className="space-y-6">
        
        {/* HERO COMMAND HEADER */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-16 bg-blue-500/5 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-[11px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Platform Oversight Board
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-2">
                AuraServe Platform oversight console 🛡️
              </h1>
              <p className="text-slate-400 text-xs md:text-sm mt-1">
                Monitor global KPIs, approve government documents, and dispatch platform broadcast alerts.
              </p>
            </div>

            {unverifiedProviders.length > 0 && (
              <div className="flex items-center shrink-0">
                <span className="px-3.5 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl text-xs font-black flex items-center gap-2 animate-pulse">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  {unverifiedProviders.length} Providers Pending Aadhaar Check
                </span>
              </div>
            )}
          </div>

          {/* GLOWING PLATFORM KPI CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 relative z-10">
            <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl p-4 border border-slate-800">
              <div className="flex items-center gap-1.5 mb-2 text-slate-400">
                <BarChart3 className="w-4 h-4 text-slate-500" />
                <span className="text-[9px] font-black uppercase tracking-wider">Total Bookings</span>
              </div>
              <span className="text-2xl font-black text-slate-100">{bookings.length}</span>
            </div>

            <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl p-4 border border-slate-800">
              <div className="flex items-center gap-1.5 mb-2 text-slate-400">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-[9px] font-black uppercase tracking-wider">Gross Revenue</span>
              </div>
              <span className="text-2xl font-black text-slate-100">₹{totalRevenue}</span>
            </div>

            <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl p-4 border border-slate-800">
              <div className="flex items-center gap-1.5 mb-2 text-slate-400">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-[9px] font-black uppercase tracking-wider">Registered Pros</span>
              </div>
              <span className="text-2xl font-black text-slate-100">{providers.length}</span>
            </div>

            <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl p-4 border border-slate-800">
              <div className="flex items-center gap-1.5 mb-2 text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span className="text-[9px] font-black uppercase tracking-wider">Verified Badges</span>
              </div>
              <span className="text-2xl font-black text-slate-100">{aadhaarVerifiedPct}%</span>
            </div>

            <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl p-4 border border-slate-800">
              <div className="flex items-center gap-1.5 mb-2 text-slate-400">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="text-[9px] font-black uppercase tracking-wider">Active Disputes</span>
              </div>
              <span className="text-2xl font-black text-slate-100">{openTickets.length}</span>
            </div>
          </div>
        </div>

        {/* ACTIVE TAB ROUTER */}

        {/* TAB 1: OVERVIEW CONTROL PANEL */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Booking progress gauges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Pending Confirmation</span>
                </div>
                <span className="text-3xl font-black text-slate-900">{pendingBookings.length}</span>
                <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${bookings.length > 0 ? (pendingBookings.length / bookings.length) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Completed Successfully</span>
                </div>
                <span className="text-3xl font-black text-slate-900">{completedBookings.length}</span>
                <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${bookings.length > 0 ? (completedBookings.length / bookings.length) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <X className="w-4 h-4 text-rose-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Cancelled / Refunded</span>
                </div>
                <span className="text-3xl font-black text-slate-900">{cancelledBookings.length}</span>
                <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${bookings.length > 0 ? (cancelledBookings.length / bookings.length) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            {/* Inbound Alert & Broadcast drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Interactive verification reviewer */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Provider Verification Desk</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Approve government documents and biometrics scans</p>
                  </div>
                  <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">{unverifiedProviders.length} pending</span>
                </div>

                {unverifiedProviders.length === 0 ? (
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-200 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-400 font-extrabold uppercase">✓ Platform Fully Verified</p>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1">No pending Aadhaar document requests.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {unverifiedProviders.slice(0, 3).map(p => (
                      <div key={p.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-2xl object-cover" />
                            <div>
                              <span className="block font-black text-slate-800 text-xs">{p.name}</span>
                              <span className="block text-[10px] text-slate-400 font-bold capitalize mt-0.5">{p.category} • {p.city}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setAdminSelectedProvider(p)}
                              className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold rounded-xl text-[10px] cursor-pointer flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Preview
                            </button>
                            <button
                              onClick={() => handleAdminApproveAadhaar(p.id)}
                              className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-[10px] cursor-pointer flex items-center gap-1 shadow-md shadow-emerald-500/10"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}


              </div>

              {/* Right Column: Direct broadcast command */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span>Broadcast Terminal</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Send high-priority messages to all user notifications</p>
                </div>

                <form onSubmit={handleAdminBroadcast} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">English Broadcast</label>
                    <input
                      type="text"
                      placeholder="e.g. 20% cashback added to your wallet today!"
                      value={customNotificationEn}
                      onChange={(e) => setCustomNotificationEn(e.target.value)}
                      className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Hindi Broadcast (optional)</label>
                    <input
                      type="text"
                      placeholder="उदा. आज आपके वॉलेट में 20% कैशबैक जोड़ा गया है!"
                      value={customNotificationHi}
                      onChange={(e) => setCustomNotificationHi(e.target.value)}
                      className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Broadcast Live Announcement</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FULL VERIFICATION QUEUE */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">Provider Verification Desk</h2>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Pending Aadhaar and biometrics check of new service providers.</p>
              </div>
              <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                {unverifiedProviders.length} pending
              </span>
            </div>

            {unverifiedProviders.length === 0 ? (
              <div className="bg-white p-12 rounded-[2rem] border border-slate-200 text-center">
                <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="font-extrabold text-sm text-slate-900">Verification Queue is Clean!</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed font-semibold">
                  All service partners have passed biological and criminal database background sweeps successfully.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {unverifiedProviders.map(p => (
                  <div key={p.id} className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                      <div className="flex items-center gap-3">
                        <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-100" />
                        <div>
                          <span className="block font-black text-slate-800 text-sm">{p.name}</span>
                          <span className="block text-xs text-slate-400 capitalize mt-0.5 font-semibold">{p.category} • {p.city}</span>
                          <span className="block text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                            Experience: {p.experience} years • Completed: {p.completedJobs} jobs
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0 self-center sm:self-start">
                        <button
                          onClick={() => setAdminSelectedProvider(p)}
                          className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold rounded-xl text-xs cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Preview Card</span>
                        </button>
                        <button
                          onClick={() => handleAdminApproveAadhaar(p.id)}
                          className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs cursor-pointer transition-colors flex items-center gap-1 shadow-md shadow-emerald-500/10"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify Badge</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DISPUTE MANAGEMENT */}
        {activeTab === 'disputes' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Platform Support Disputes</h2>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Address customer support tickets and process wallet refunds for poorly-rated bookings.</p>
            </div>

            {supportTickets.length === 0 ? (
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 text-center text-xs text-slate-400 font-semibold">
                No platform support tickets found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportTickets.map(ticket => (
                  <div key={ticket.id} className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800">{ticket.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            ticket.status === 'open' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm mt-2">{ticket.subjectEn}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold capitalize">Category: {ticket.category} • Date: {ticket.date}</p>
                      </div>
                    </div>

                    {ticket.status === 'open' && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleResolveTicket(ticket.id)}
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-[10px] cursor-pointer transition-colors shadow-sm"
                        >
                          Resolve & Close Ticket
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SERVICE PARTNERS */}
        {activeTab === 'providers' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Platform Service Partners Directory</h2>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Global list of registered local professionals on the AuraServe network.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                {providers.map(p => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                      <div>
                        <span className="block font-black text-slate-800 text-xs">{p.name}</span>
                        <span className="block text-[10px] text-slate-400 font-bold capitalize mt-0.5">{p.category} • {p.city}</span>
                        <span className="block text-[9px] text-slate-400 font-semibold mt-0.5">UID: {p.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        p.aadhaarVerified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {p.aadhaarVerified ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BROADCAST TERMINAL VIEW */}
        {activeTab === 'broadcast' && (
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 space-y-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Broadcast Alert Terminal</h2>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Dispatch live banners to the header of all customers in real-time.</p>
            </div>

            <form onSubmit={handleAdminBroadcast} className="space-y-4 max-w-2xl">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">English System Message</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Server maintenance scheduled today at 10 PM. Emergency services will remain active."
                  value={customNotificationEn}
                  onChange={(e) => setCustomNotificationEn(e.target.value)}
                  className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Hindi System Message (optional)</label>
                <textarea
                  rows={3}
                  placeholder="उदा. आज रात 10 बजे सर्वर रखरखाव निर्धारित है। आपातकालीन सेवाएं सक्रिय रहेंगी।"
                  value={customNotificationHi}
                  onChange={(e) => setCustomNotificationHi(e.target.value)}
                  className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs shadow-md cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast System Alert Banner</span>
              </button>
            </form>
          </div>
        )}
        {/* Global Aadhaar biometric verification modal overlay */}
        {adminSelectedProvider && (
          <div onClick={() => setAdminSelectedProvider(null)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-slate-900 border border-slate-800 text-white rounded-[2rem] max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-extrabold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Biometric Aadhaar Verification Desk
                </span>
                <button type="button" onClick={() => setAdminSelectedProvider(null)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-950 p-5 border border-slate-800 rounded-2xl flex flex-col sm:flex-row gap-5 items-center">
                {/* Interactive Aadhaar simulation card vector */}
                <div className="w-32 h-20 bg-gradient-to-br from-emerald-800 to-teal-900 border border-emerald-500/20 rounded-2xl flex flex-col justify-between p-3 text-[7px] text-emerald-300 font-extrabold uppercase tracking-wider relative overflow-hidden shrink-0 shadow-lg shadow-emerald-950/50">
                  <div className="absolute right-0 top-0 w-12 h-12 bg-white/5 rounded-full blur-lg"></div>
                  <div className="flex justify-between items-center border-b border-emerald-900/40 pb-1">
                    <span>GOVT OF INDIA</span>
                    <span className="text-[6px] text-white">UIDAI</span>
                  </div>
                  <div className="my-1.5">
                    <span className="block text-[8px] text-white font-black">Aadhaar Card</span>
                    <span className="block text-[5px] text-slate-400 lowercase italic mt-0.5">unique identification authority of india</span>
                  </div>
                  <div className="flex justify-between items-end border-t border-emerald-900/40 pt-1">
                    <span>UID: **** **** 1092</span>
                    <span className="text-[5px] text-emerald-400 font-black">✓ active</span>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-2.5 text-xs">
                  <div className="flex justify-between border-b border-slate-900 pb-1.5"><span className="text-slate-400">Full Name:</span><span className="font-extrabold text-slate-200">{adminSelectedProvider.name}</span></div>
                  <div className="flex justify-between border-b border-slate-900 pb-1.5"><span className="text-slate-400">Jurisdiction:</span><span className="font-extrabold capitalize text-slate-200">{adminSelectedProvider.city}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Biometric Hash:</span><span className="text-emerald-400 font-extrabold flex items-center gap-1">✓ Match Registered</span></div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  onClick={() => handleAdminApproveAadhaar(adminSelectedProvider.id)} 
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-md shadow-emerald-500/10 transition-colors flex-1 text-center font-bold"
                >
                  Verify Partner Badge
                </button>
                <button 
                  onClick={handleAdminRejectAadhaar} 
                  className="py-2.5 px-4 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-extrabold rounded-xl text-xs cursor-pointer transition-colors border border-rose-500/10 font-bold"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
