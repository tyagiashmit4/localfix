'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  ShieldCheck,
  UploadCloud,
  Settings,
  LayoutDashboard,
  Inbox,
  BarChart3,
  Star,
  DollarSign,
  CheckCircle2,
  Clock,
  TrendingUp,
  XCircle,
  FileCheck,
  Briefcase,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Building,
  UserCheck,
  X,
  MessageSquare,
  Send,
  Calendar
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import DashboardLayout from '../common/DashboardLayout';

export default function ProviderView() {
  const { data: session } = useSession();
  const router = useRouter();

  const {
    lang,
    bookings,
    updateBooking,
    providers,
    setProviders,
    addNotification,
    updateUserProfile,
    user,
    t
  } = useStore();

  // Premium upgrades state
  const [activeChatBooking, setActiveChatBooking] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [isTypingSimulated, setIsTypingSimulated] = useState<boolean>(false);

  // Performance Tab Interactive States
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<any | null>(null);
  const [selectedEarningWeek, setSelectedEarningWeek] = useState<number>(4);


  // Active view tab inside dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'performance' | 'documents'>('overview');

  // Find matching provider in database synced store
  const currentUserId = session?.user?.id;
  const currentProvider = providers.find(p => p.id === currentUserId) || providers.find(p => p.id === 'p1') || providers[0];

  // Rates and settings local states
  const [rates, setRates] = useState(250);
  const [areasText, setAreasText] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'completed'>('idle');
  const [aadhaarFile, setAadhaarFile] = useState<string | null>(null);

  // Core profile local states
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // Sync basic user info when user store is loaded
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditEmail(user.email || '');
    }
  }, [user]);

  // Sync chat messages for activeChatBooking
  useEffect(() => {
    if (activeChatBooking) {
      const stored = localStorage.getItem(`chat_${activeChatBooking.id}`);
      if (stored) {
        setChatMessages(JSON.parse(stored));
      } else {
        const initialMsgs = [
          {
            id: 'msg_init',
            senderId: activeChatBooking.providerId,
            senderName: activeChatBooking.providerName,
            textEn: `Hello! I have accepted your service booking B-${activeChatBooking.id.split('-')[1] || activeChatBooking.id}. I will arrive on scheduled time.`,
            timestamp: 'Just now'
          }
        ];
        setChatMessages(initialMsgs);
        localStorage.setItem(`chat_${activeChatBooking.id}`, JSON.stringify(initialMsgs));
      }
    } else {
      setChatMessages([]);
    }
  }, [activeChatBooking]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatBooking) return;

    const currentText = chatInput.trim();
    setChatInput('');
    setIsSendingMessage(true);

    const providerMsg = {
      id: 'msg_' + Date.now(),
      senderId: currentProvider?.id || 'p1',
      senderName: currentProvider?.name || 'Ramesh Kumar Sharma',
      textEn: currentText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 1. Update local state
    const nextMsgs = [...chatMessages, providerMsg];
    setChatMessages(nextMsgs);
    localStorage.setItem(`chat_${activeChatBooking.id}`, JSON.stringify(nextMsgs));

    try {
      // 2. Dispatch to the backend API so it broadcasts live over Pusher
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: activeChatBooking.id,
          senderId: currentProvider?.id || 'p1',
          senderName: currentProvider?.name || 'Ramesh Kumar Sharma',
          textEn: currentText,
          textHi: currentText
        })
      });
    } catch (err) {
      console.error('Failed to dispatch live Pusher chat message:', err);
    } finally {
      setIsSendingMessage(false);
    }

    // 3. Trigger smart simulated response from customer after 2.5 seconds
    setIsTypingSimulated(true);
    setTimeout(async () => {
      let replyText = "Great! Please call me when you reach the gate or if you need directions.";
      
      const lower = currentText.toLowerCase();
      if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
        replyText = `Hello! Thank you for accepting my booking. Please bring any required wiring wires or tools.`;
      } else if (lower.includes('where') || lower.includes('way') || lower.includes('reach') || lower.includes('locate') || lower.includes('address')) {
        replyText = `I am at Flat 402, Royal Residency, Ramghat Road. Let me know when you cross the main chowk!`;
      } else if (lower.includes('late') || lower.includes('delay') || lower.includes('time')) {
        replyText = "No problem! Take your time and travel safely. See you shortly.";
      }

      const clientMsg = {
        id: 'msg_' + Date.now() + '_sim',
        senderId: 'customer',
        senderName: activeChatBooking.customerName || 'Abhishek Tyagi',
        textEn: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedMsgs = [...nextMsgs, clientMsg];
      setChatMessages(updatedMsgs);
      localStorage.setItem(`chat_${activeChatBooking.id}`, JSON.stringify(updatedMsgs));
      setIsTypingSimulated(false);

      // Trigger standard local notification
      addNotification(
        `New chat message from customer ${activeChatBooking.customerName || 'Abhishek'}: "${replyText}"`,
        `ग्राहक ${activeChatBooking.customerName || 'अभिषेक'} से नया संदेश: "${replyText}"`
      );

      // Also trigger a dispatch of the simulator's response to the Pusher backend API
      try {
        await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: activeChatBooking.id,
            senderId: 'customer',
            senderName: activeChatBooking.customerName || 'Abhishek Tyagi',
            textEn: replyText,
            textHi: replyText
          })
        });
      } catch (err) {
        console.error('Failed to dispatch simulated customer response over Pusher:', err);
      }
    }, 2500);
  };

  // Sync settings when provider data is loaded
  useEffect(() => {
    if (currentProvider) {
      setRates(currentProvider.pricePerHr);
      setCity(currentProvider.city || 'aligarh');
      setBio(lang === 'en' ? (currentProvider.bioEn || '') : (currentProvider.bioHi || ''));
      
      let parsedAreas = [];
      try {
        parsedAreas = typeof currentProvider.areas === 'string' 
          ? JSON.parse(currentProvider.areas) 
          : currentProvider.areas || [];
      } catch (e) {
        parsedAreas = currentProvider.areas || [];
      }
      setAreasText(Array.isArray(parsedAreas) ? parsedAreas.join(', ') : String(parsedAreas));
      
      if (currentProvider.aadhaarVerified) {
        setUploadState('completed');
        setAadhaarFile('aadhaar_verified_system.pdf');
      }
    }
  }, [currentProvider, lang]);

  // Compute stats dynamically
  const providerBookings = bookings.filter(b => b.providerId === currentProvider?.id);
  const pendingLeads = providerBookings.filter(b => b.status === 'pending');
  const acceptedJobs = providerBookings.filter(b => b.status === 'accepted');
  const completedJobs = providerBookings.filter(b => b.status === 'completed');
  
  const totalEarnings = providerBookings
    .filter(b => b.status === 'completed' || b.status === 'accepted')
    .reduce((sum, b) => sum + b.price, 0);

  const completionRate = providerBookings.length > 0
    ? Math.round((completedJobs.length / providerBookings.length) * 100)
    : 100;

  // Accept a booking request
  const handleAcceptRequest = async (leadId: string) => {
    await updateBooking(leadId, { status: 'accepted' });
    addNotification(
      `Accepted booking request ${leadId}! Prepare tools.`,
      `बुकिंग अनुरोध ${leadId} स्वीकार किया गया! अपने उपकरण तैयार करें।`
    );
  };

  // Decline a booking request
  const handleDeclineRequest = async (leadId: string) => {
    await updateBooking(leadId, { status: 'cancelled' });
    addNotification(
      `Declined booking request ${leadId}.`,
      `बुकिंग अनुरोध ${leadId} अस्वीकार कर दिया गया।`
    );
  };

  // Mark job as completed
  const handleMarkCompleted = async (leadId: string) => {
    await updateBooking(leadId, { status: 'completed' });
    addNotification(
      `Job ${leadId} marked as completed! ₹` + bookings.find(b => b.id === leadId)?.price + ' added to your account.',
      `कार्य ${leadId} पूरा हुआ! ₹` + bookings.find(b => b.id === leadId)?.price + ' आपके खाते में जोड़े गए।'
    );
  };

  // Aadhaar document upload simulator
  const handleAadhaarUploadSimulate = async () => {
    if (!currentProvider) return;
    setUploadState('uploading');
    
    setTimeout(async () => {
      try {
        const res = await fetch(`/api/providers/${currentProvider.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aadhaarVerified: true }),
        });
        
        if (res.ok) {
          const updated = await res.json();
          setProviders(prev => prev.map(p => p.id === currentProvider.id ? updated : p));
          setUploadState('completed');
          setAadhaarFile('aadhaar_verified_system.pdf');
          addNotification(
            "Aadhaar verification successful! Verification badge activated.",
            "आधार सत्यापन सफल रहा! सत्यापन बैज सक्रिय हो गया है।"
          );
        } else {
          setUploadState('idle');
          alert("Verification failed. Please try again.");
        }
      } catch (e) {
        console.error(e);
        setUploadState('idle');
      }
    }, 2000);
  };

  // Update rates & service areas in database
  const handleUpdateWorkerProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProvider) return;

    try {
      // 1. First save basic user profile info (Name, Phone, Email)
      const profileResult = await updateUserProfile(editName.trim(), editPhone.trim(), editEmail.trim());
      if (!profileResult.success) {
        alert(profileResult.error || "Failed to update profile credentials.");
        return;
      }

      // 2. Next save Provider-specific pricing and operational areas
      const splitAreas = areasText.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch(`/api/providers/${currentProvider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pricePerHr: rates,
          areas: splitAreas,
          bioEn: bio,
          bioHi: bio,
          city,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProviders(prev => prev.map(p => p.id === currentProvider.id ? updated : p));
        addNotification(
          "Worker profile and settings updated successfully in SQLite!",
          "कर्मचारी प्रोफ़ाइल और सेटिंग्स सफलतापूर्वक SQLite में अपडेट की गईं!"
        );
      } else {
        alert("Failed to update trade profile settings.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile settings.");
    }
  };

  // Custom Sidebar component for ProviderView
  const renderSidebar = () => {
    const pInitial = currentProvider?.name ? currentProvider.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'PV';
    
    return (
      <aside className="w-full lg:w-64 shrink-0">
        <div className="bg-slate-900 border border-emerald-900/30 rounded-3xl shadow-xl overflow-hidden sticky top-24">
          {/* Dashboard Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-5 py-5 border-b border-emerald-950">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <Briefcase className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <span className="text-white font-extrabold text-sm block leading-tight">
                  Aura<span className="text-emerald-300">Serve</span>
                </span>
                <span className="text-emerald-200/60 text-[9px] font-black uppercase tracking-wider">Business Pro</span>
              </div>
            </div>
          </div>

          {/* Profile overview card */}
          <div className="px-5 py-4 border-b border-emerald-950 bg-slate-950/40">
            <div className="flex items-center gap-3">
              {currentProvider?.avatar ? (
                <img src={currentProvider.avatar} alt={currentProvider.name} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-800/40" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-900/40 text-emerald-300 flex items-center justify-center font-bold text-sm border border-emerald-500/20">
                  {pInitial}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-black text-slate-100 truncate">{currentProvider?.name || 'Provider Partner'}</span>
                <span className="block text-[10px] text-slate-400 font-bold capitalize truncate">
                  {currentProvider?.category} • {currentProvider?.city}
                </span>
              </div>
            </div>
            
            {currentProvider?.aadhaarVerified ? (
              <span className="mt-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified Partner
              </span>
            ) : (
              <span className="mt-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-3 h-3 text-amber-400" />
                Needs Verification
              </span>
            )}
          </div>

          {/* Navigation links */}
          <nav className="px-3 py-4 space-y-1 bg-slate-950/20">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview Control</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'jobs'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4" />
                <span>Job Requests</span>
              </div>
              {pendingLeads.length > 0 && (
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${activeTab === 'jobs' ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {pendingLeads.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('performance')}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'performance'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>Performance Insights</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'documents'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4 h-4" />
                <span>Credentials Vault</span>
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
        {/* TOP COMMAND HEADER */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-900/20 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-16 bg-emerald-500/5 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                Partner Workspace
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-2">
                Welcome back, {currentProvider?.name?.split(' ')[0] || 'Partner'}! 👋
              </h1>
              <p className="text-slate-400 text-xs md:text-sm mt-1">
                Your services are active in <span className="text-emerald-400 font-extrabold capitalize">{currentProvider?.city || 'Aligarh'}</span>. Keep up the high rating!
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('jobs')}
                className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs border border-emerald-500 shadow-lg shadow-emerald-700/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>Active Leads Queue</span>
                {pendingLeads.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-emerald-700 font-black flex items-center justify-center text-[10px]">
                    {pendingLeads.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* KEY PERFORMANCE TILES */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 relative z-10">
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-emerald-950 hover:border-emerald-800/30 transition-colors">
              <div className="flex items-center justify-between mb-2 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Net Earnings</span>
                </div>
                <span className="inline-flex items-center text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +14%
                </span>
              </div>
              <span className="text-3xl font-black text-slate-100">₹{totalEarnings}</span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-emerald-950 hover:border-emerald-800/30 transition-colors">
              <div className="flex items-center justify-between mb-2 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Inbox className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-black uppercase tracking-wider">New Leads</span>
                </div>
                {pendingLeads.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                )}
              </div>
              <span className="text-3xl font-black text-slate-100">{pendingLeads.length}</span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-emerald-950 hover:border-emerald-800/30 transition-colors">
              <div className="flex items-center justify-between mb-2 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] font-black uppercase tracking-wider">User Rating</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Top 5%</span>
              </div>
              <span className="text-3xl font-black text-slate-100">{currentProvider?.rating?.toFixed(1) || '5.0'}★</span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-emerald-950 hover:border-emerald-800/30 transition-colors">
              <div className="flex items-center justify-between mb-2 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Job Success</span>
                </div>
                <span className="text-[9px] font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">Optimal</span>
              </div>
              <span className="text-3xl font-black text-slate-100">{completionRate}%</span>
            </div>
          </div>
        </div>

        {/* ACTIVE TAB VIEWS */}
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Real-time Job Queue Banner inside Overview */}
            {pendingLeads.length > 0 && (
              <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/20 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">New job requests await your confirmation!</h3>
                    <p className="text-xs text-slate-500 font-medium">Review customer details and accept/decline booking leads below.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-md transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <span>Review Leads</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Active ongoing jobs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900">Active Work Jobs</h3>
                <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{acceptedJobs.length} active</span>
              </div>

              {acceptedJobs.length === 0 ? (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center text-xs text-slate-400 font-semibold">
                  No active ongoing jobs. Accept new job requests to get started!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {acceptedJobs.map(job => (
                    <div key={job.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-all">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl"></div>
                      
                      <div className="flex items-start justify-between gap-4 relative z-10">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Active Job
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-sm mt-2">{job.customerName}</h4>
                          <span className="text-[10px] text-slate-400 font-bold block">{job.customerPhone}</span>
                        </div>
                        <span className="text-lg font-black text-slate-900">₹{job.price}</span>
                      </div>

                      <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-2.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-700 block">{job.customerAddress}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">{job.date} • {job.timeSlot}</span>
                        </div>
                      </div>

                      {job.notes && (
                        <p className="mt-3 text-[11px] text-slate-500 italic bg-emerald-50/20 p-2.5 rounded-xl border border-emerald-500/5">
                          &quot;{job.notes}&quot;
                        </p>
                      )}

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setActiveChatBooking(job)}
                          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-blue-500/10 cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Live Chat</span>
                        </button>
                        <button
                          onClick={() => handleMarkCompleted(job.id)}
                          className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-emerald-500/10 cursor-pointer transition-colors"
                        >
                          Mark Job as Completed
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick two-column actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Custom SVG bar charts */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">Monthly Booking Volume</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Performance index based on successful bookings</p>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded">Growth +12%</span>
                </div>
                
                {/* Visual Chart */}
                <div className="h-44 flex items-end justify-between gap-4 pt-6">
                  {[
                    { month: 'Jan', count: 12, h: 40 },
                    { month: 'Feb', count: 15, h: 52 },
                    { month: 'Mar', count: 18, h: 65 },
                    { month: 'Apr', count: 22, h: 78 },
                    { month: 'May', count: 28, h: 95, active: true },
                  ].map(bar => (
                    <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full bg-slate-50 hover:bg-slate-100/80 rounded-xl relative flex items-end justify-center transition-colors" style={{ height: '140px' }}>
                        
                        {/* Hover tooltip */}
                        <div className="absolute -top-7 scale-0 group-hover:scale-100 bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-md pointer-events-none transition-all">
                          {bar.count} jobs
                        </div>

                        <div
                          className={`w-full rounded-b-lg rounded-t-xl transition-all duration-500 ${
                            bar.active 
                              ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/10' 
                              : 'bg-gradient-to-t from-emerald-700/50 to-emerald-600/30'
                          }`}
                          style={{ height: `${bar.h}%` }}
                        ></div>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider ${bar.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {bar.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Rate settings form */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4 text-emerald-600" />
                    <span>Quick Rate Settings</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Control pricing and operational areas in Aligarh</p>
                </div>

                <form onSubmit={handleUpdateWorkerProfile} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Phone Number</label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Hourly Service Rate (₹)</label>
                    <div className="relative rounded-xl">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-extrabold text-xs">₹</span>
                      <input
                        type="number"
                        value={rates}
                        onChange={(e) => setRates(Number(e.target.value))}
                        className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl pl-7.5 pr-4 py-3 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        required
                        min="50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Active Service Areas</label>
                    <input
                      type="text"
                      placeholder="Civil Lines, Ramghat Road, Dodhpur"
                      value={areasText}
                      onChange={(e) => setAreasText(e.target.value)}
                      className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                    <span className="block text-[9px] text-slate-400 font-medium leading-relaxed">Separate local neighborhoods using commas.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md shadow-emerald-500/10 cursor-pointer transition-colors"
                  >
                    Save Changes to SQLite
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JOB REQUESTS QUEUE */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">Inbound Job Request Queue</h2>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Accept to activate WhatsApp chat and view contact numbers.</p>
              </div>
              <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                {pendingLeads.length} pending requests
              </span>
            </div>

            {pendingLeads.length === 0 ? (
              <div className="bg-white p-12 rounded-[2rem] border border-slate-200 text-center">
                <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-extrabold text-sm text-slate-900">Queue is completely empty!</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed font-semibold">
                  You are fully caught up. When local clients choose you on the home dashboard, they will appear here!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingLeads.map(lead => (
                  <div key={lead.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800">{lead.id}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                            New Lead
                          </span>
                        </div>
                        
                        <h4 className="font-black text-slate-900 text-sm mt-1">{lead.customerName}</h4>
                        
                        <p className="text-slate-500 text-xs flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-bold">{lead.customerAddress}</span>
                        </p>

                        {lead.notes && (
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs italic text-slate-500 mt-1 max-w-lg">
                            &quot;{lead.notes}&quot;
                          </div>
                        )}

                        <span className="block text-[10px] text-slate-400 font-extrabold uppercase mt-2 tracking-wider">
                          Requested Slot: {lead.date} • {lead.timeSlot}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-3 shrink-0 self-center sm:self-start">
                        <span className="text-xl font-black text-slate-900">₹{lead.price}</span>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptRequest(lead.id)}
                            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Accept Job
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(lead.id)}
                            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold rounded-xl text-xs cursor-pointer transition-colors flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PERFORMANCE ANALYTICS */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            
            {/* KPI Cards Header */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <span>Operational Performance Dashboard</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-semibold">High-fidelity metrics compiled across all trade activities and booking requests.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-slate-200 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-black uppercase tracking-wider">Completed Jobs</span>
                    <span className="text-2xl font-black text-slate-800">{completedJobs.length} completed</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-slate-200 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100 shrink-0">
                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-black uppercase tracking-wider">Customer Rating</span>
                    <span className="text-2xl font-black text-slate-800">
                      {currentProvider?.rating?.toFixed(1) || '5.0'} / 5.0
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-slate-200 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-black uppercase tracking-wider">Job Revenue</span>
                    <span className="text-2xl font-black text-slate-800">₹{totalEarnings}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Cumulative Earnings Line Chart */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Cumulative Weekly Revenue Growth</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Simulated week-over-week financial growth analytics index</p>
                </div>
                
                {/* Week selector buttons */}
                <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1 self-start">
                  {[1, 2, 3, 4].map((wk) => (
                    <button
                      key={wk}
                      type="button"
                      onClick={() => setSelectedEarningWeek(wk)}
                      className={`py-1.5 px-3 rounded-lg text-[10px] font-extrabold cursor-pointer transition-colors ${
                        selectedEarningWeek === wk
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Week {wk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pure CSS Bar Graph to look like premium dashboard */}
              <div className="h-48 flex items-end justify-between gap-4 pt-8 px-4 bg-slate-50 rounded-2xl border border-slate-100 relative">
                <div className="absolute top-2 left-4 text-[9px] text-slate-400 font-bold uppercase tracking-wider">Revenue Growth Line (₹)</div>
                
                {[
                  { w: 1, label: 'Week 1', amt: 1120, pct: '30%', active: selectedEarningWeek === 1 },
                  { w: 2, label: 'Week 2', amt: 2800, pct: '58%', active: selectedEarningWeek === 2 },
                  { w: 3, label: 'Week 3', amt: 4200, pct: '75%', active: selectedEarningWeek === 3 },
                  { w: 4, label: 'Week 4 (Current)', amt: totalEarnings + 2800, pct: '92%', active: selectedEarningWeek === 4 }
                ].map((bar) => (
                  <div 
                    key={bar.w} 
                    onClick={() => setSelectedEarningWeek(bar.w)}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-full bg-slate-200/50 hover:bg-slate-200 rounded-t-xl relative flex items-end justify-center transition-colors h-32">
                      {/* Price tooltip */}
                      <div className="absolute -top-7 bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-md pointer-events-none transition-all group-hover:opacity-100">
                        ₹{bar.amt}
                      </div>

                      <div 
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          bar.active 
                            ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-500/10' 
                            : 'bg-emerald-500/30'
                        }`}
                        style={{ height: bar.pct }}
                      ></div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${bar.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dynamic weekly financial summary card */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl animate-in fade-in duration-200">
                {selectedEarningWeek === 1 && (
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Week 1 Revenue Breakdown</span>
                    <p className="font-extrabold text-slate-800">Total Payout Cleared: ₹1,120.00</p>
                    <p className="text-slate-500 leading-relaxed mt-1">
                      Completed 4 electrician dispatch bookings. Main service areas targeted: Civil Lines and Ramghat Road. Average service charge was ₹280.
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold rounded-md">
                      ✓ TRANSFERRED TO BANK
                    </span>
                  </div>
                )}
                {selectedEarningWeek === 2 && (
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Week 2 Revenue Breakdown</span>
                    <p className="font-extrabold text-slate-800">Total Payout Cleared: ₹2,800.00</p>
                    <p className="text-slate-500 leading-relaxed mt-1">
                      Completed 6 electrician tasks in Dodhpur and Ramghat Road. Experienced high demand in evening slots. 
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold rounded-md">
                      ✓ TRANSFERRED TO BANK
                    </span>
                  </div>
                )}
                {selectedEarningWeek === 3 && (
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Week 3 Revenue Breakdown</span>
                    <p className="font-extrabold text-slate-800">Total Payout Cleared: ₹4,200.00</p>
                    <p className="text-slate-500 leading-relaxed mt-1">
                      Completed 5 highly-rated electrician tasks. Received outstanding 5.0 reviews on Aligarh local marketplace.
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold rounded-md">
                      ✓ TRANSFERRED TO BANK
                    </span>
                  </div>
                )}
                {selectedEarningWeek === 4 && (
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Week 4 Current Revenue Breakdown</span>
                    <p className="font-extrabold text-slate-800">Current Payout Accruing: ₹{(totalEarnings + 2800).toFixed(2)}</p>
                    <p className="text-slate-500 leading-relaxed mt-1">
                      Targeted 8 active bookings in under 45-minute dispatch. Dynamic coordinates routing enabled. Recommended action: Accept incoming leads promptly to lock additional ₹100 platform loyalty bonus.
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-bold rounded-md animate-pulse">
                      ⏳ PROCESSING PAYOUT
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* OPTION 5: DYNAMIC WEEKLY DEMAND HEATMAP GRID */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Aligarh Coordinate Peak Demand Heatmap</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Optimized schedule based on historical residential booking frequencies in Aligarh</p>
              </div>

              {/* Grid representation */}
              <div className="overflow-x-auto">
                <div className="min-w-[600px] bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                  {/* Days header */}
                  <div className="grid grid-cols-8 gap-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/50 pb-2 mb-2">
                    <div>Slot</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                    <div>Sun</div>
                  </div>

                  {/* Morning slot */}
                  <div className="grid grid-cols-8 gap-2 items-center text-center">
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-wide text-left">Morning (8-12)</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Monday', t: 'Morning', pct: 60 })} className="bg-emerald-500/30 hover:bg-emerald-500/40 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">60%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Tuesday', t: 'Morning', pct: 55 })} className="bg-emerald-500/20 hover:bg-emerald-500/30 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">55%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Wednesday', t: 'Morning', pct: 45 })} className="bg-emerald-500/20 hover:bg-emerald-500/30 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">45%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Thursday', t: 'Morning', pct: 50 })} className="bg-emerald-500/20 hover:bg-emerald-500/30 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">50%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Friday', t: 'Morning', pct: 70 })} className="bg-emerald-500/40 hover:bg-emerald-500/50 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">70%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Saturday', t: 'Morning', pct: 85 })} className="bg-emerald-500/70 hover:bg-emerald-500/80 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-950">85%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Sunday', t: 'Morning', pct: 90 })} className="bg-emerald-500/80 hover:bg-emerald-500/90 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-950">90%</div>
                  </div>

                  {/* Afternoon slot */}
                  <div className="grid grid-cols-8 gap-2 items-center text-center mt-2">
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-wide text-left">Afternoon (12-4)</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Monday', t: 'Afternoon', pct: 40 })} className="bg-emerald-500/10 hover:bg-emerald-500/20 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">40%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Tuesday', t: 'Afternoon', pct: 35 })} className="bg-emerald-500/10 hover:bg-emerald-500/20 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">35%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Wednesday', t: 'Afternoon', pct: 30 })} className="bg-emerald-500/10 hover:bg-emerald-500/20 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">30%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Thursday', t: 'Afternoon', pct: 40 })} className="bg-emerald-500/10 hover:bg-emerald-500/20 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">40%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Friday', t: 'Afternoon', pct: 50 })} className="bg-emerald-500/20 hover:bg-emerald-500/30 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">50%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Saturday', t: 'Afternoon', pct: 75 })} className="bg-emerald-500/40 hover:bg-emerald-500/50 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-850">75%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Sunday', t: 'Afternoon', pct: 80 })} className="bg-emerald-500/60 hover:bg-emerald-500/70 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-850">80%</div>
                  </div>

                  {/* Evening slot */}
                  <div className="grid grid-cols-8 gap-2 items-center text-center mt-2">
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-wide text-left">Evening (4-8)</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Monday', t: 'Evening', pct: 75 })} className="bg-emerald-500/50 hover:bg-emerald-500/60 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-850">75%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Tuesday', t: 'Evening', pct: 70 })} className="bg-emerald-500/40 hover:bg-emerald-500/50 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">70%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Wednesday', t: 'Evening', pct: 65 })} className="bg-emerald-500/30 hover:bg-emerald-500/40 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">65%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Thursday', t: 'Evening', pct: 70 })} className="bg-emerald-500/40 hover:bg-emerald-500/50 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">70%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Friday', t: 'Evening', pct: 85 })} className="bg-emerald-500/70 hover:bg-emerald-500/80 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-950">85%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Saturday', t: 'Evening', pct: 95 })} className="bg-emerald-500/95 hover:bg-emerald-500 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-white shadow-inner bg-emerald-600">95%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Sunday', t: 'Evening', pct: 98 })} className="bg-emerald-500/95 hover:bg-emerald-500 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-white shadow-inner bg-emerald-600">98%</div>
                  </div>

                  {/* Night slot */}
                  <div className="grid grid-cols-8 gap-2 items-center text-center mt-2">
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-wide text-left">Night (8-12)</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Monday', t: 'Night', pct: 30 })} className="bg-emerald-500/10 hover:bg-emerald-500/20 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-850">30%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Tuesday', t: 'Night', pct: 25 })} className="bg-emerald-500/10 hover:bg-emerald-500/20 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">25%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Wednesday', t: 'Night', pct: 15 })} className="bg-slate-200/50 hover:bg-slate-200 h-8 rounded-lg cursor-pointer transition-colors border border-slate-300/10 flex items-center justify-center text-[9px] font-bold text-slate-500">15%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Thursday', t: 'Night', pct: 20 })} className="bg-slate-200/50 hover:bg-slate-200 h-8 rounded-lg cursor-pointer transition-colors border border-slate-300/10 flex items-center justify-center text-[9px] font-bold text-slate-500">20%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Friday', t: 'Night', pct: 45 })} className="bg-emerald-500/15 hover:bg-emerald-500/25 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">45%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Saturday', t: 'Night', pct: 60 })} className="bg-emerald-500/30 hover:bg-emerald-500/40 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">60%</div>
                    <div onClick={() => setSelectedHeatmapCell({ d: 'Sunday', t: 'Night', pct: 65 })} className="bg-emerald-500/35 hover:bg-emerald-500/45 h-8 rounded-lg cursor-pointer transition-colors border border-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-800">65%</div>
                  </div>
                </div>
              </div>

              {/* Dynamic Heatmap Analytics Info Alert Box */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs">
                {!selectedHeatmapCell ? (
                  <p className="text-slate-500 leading-relaxed flex items-center gap-2">
                    <span className="text-base">💡</span>
                    <span>Click any color cell block in the Aligarh demand calendar above to analyze peak dispatch frequencies and surge potential!</span>
                  </p>
                ) : (
                  <div className="space-y-1.5 animate-in fade-in duration-150">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">Heatmap Analytics • {selectedHeatmapCell.d} {selectedHeatmapCell.t}</span>
                    <p className="font-extrabold text-slate-800">Estimated Local Demand Rate: {selectedHeatmapCell.pct}%</p>
                    <p className="text-slate-500 leading-relaxed">
                      {selectedHeatmapCell.pct >= 80 
                        ? '🔥 Peak Surge Slot! Residential booking dispatches in Aligarh coordinate sectors are currently experiencing maximum frequencies. Highly recommended: Keep active trade status switched on and confirm bookings instantly.'
                        : selectedHeatmapCell.pct >= 50
                          ? '⚡ Moderate Demand Slot. Balanced trade opportunities. Good timeframe for scheduling standard domestic repair tasks in Aligarh outskirts.'
                          : '💤 Low Demand Slot. Off-peak hours. Ideal timeframe for updating government documents, training checklists, and offline tool maintenance.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer reviews list */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">Recent Customer Reviews</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Read feedback submitted directly by clients post completion.</p>

              {completedJobs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-semibold border border-dashed border-slate-200 rounded-2xl">
                  No completion reviews recorded on your profile. Reviews appear here after completed jobs are verified.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {bookings.filter(b => b.providerId === currentProvider?.id && b.status === 'completed').map((review) => (
                    <div key={review.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800">{review.customerName}</span>
                          <div className="flex items-center text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </div>
                        </div>
                        <p className="text-slate-600 text-xs italic mt-2">
                          &quot;Outstanding and punctual service. Highly recommended electrician partner!&quot;
                        </p>
                        <span className="block text-[9px] text-slate-400 font-extrabold uppercase mt-1.5 tracking-wider">
                          Job {review.id} • Verified Client
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold shrink-0">{review.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CREDENTIALS VAULT */}
        {activeTab === 'documents' && (
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-900">Credentials & Document Vault</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage government verification documents to display the trust badges to customers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Aadhaar Card Verification</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                      A validated UIDAI Aadhaar verifies biological identity and triggers the green verification shield on client feeds, driving up booking conversions by over 40%!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Background Criminal Check</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                      Platform checks local police station records to ensure safety protocols. Updated once every 12 months automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload simulation card */}
              <div className="md:col-span-5 bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-4 text-center">
                <h4 className="font-black text-slate-900 text-xs text-left flex items-center gap-2 border-b border-slate-200 pb-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Aadhaar Verification Center</span>
                </h4>

                <div className="p-5 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 bg-white hover:bg-slate-50 transition-colors">
                  <UploadCloud className="w-8 h-8 text-slate-400" />
                  <span className="block text-xs font-bold text-slate-700">
                    {uploadState === 'idle' 
                      ? 'Upload Government ID Scan' 
                      : uploadState === 'uploading' 
                        ? 'Simulating Scan...' 
                        : '✓ Verification ID Valid'}
                  </span>
                  <span className="block text-[9px] text-slate-400 font-semibold leading-relaxed">PDF, JPG or PNG formats allowed. Max size 5MB.</span>
                </div>

                {uploadState === 'idle' && (
                  <button 
                    onClick={handleAadhaarUploadSimulate} 
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    Upload Document Scan
                  </button>
                )}

                {uploadState === 'uploading' && (
                  <div className="space-y-2">
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full animate-pulse w-3/4"></div>
                    </div>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider animate-pulse">Scanning biometric coordinates...</span>
                  </div>
                )}

                {uploadState === 'completed' && (
                  <div className="space-y-3">
                    <span className="block text-center text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                      ✓ Biometric Scan Cleared
                    </span>
                    <span className="block text-[10px] text-slate-400 font-extrabold uppercase">File: {aadhaarFile || 'aadhaar_verified_system.pdf'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ACTIVE BOOKING IN-APP CHAT DRAWER FOR PROVIDERS */}
      {activeChatBooking && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-xs animate-in fade-in duration-200">
          {/* Backdrop Click close */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveChatBooking(null)}></div>
          
          {/* Chat Container */}
          <div className="bg-slate-900 border-l border-emerald-950 w-full max-w-md h-full flex flex-col relative z-10 shadow-2xl animate-in slide-in-from-right duration-300 text-white">
            
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-teal-950 border-b border-emerald-950 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20">
                  {activeChatBooking.customerName ? activeChatBooking.customerName.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'CU'}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-100">{activeChatBooking.customerName}</h4>
                  <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                    <span>Client Dispatch Chat</span>
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setActiveChatBooking(null)}
                className="p-1.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Service brief info */}
            <div className="px-4 py-2.5 bg-slate-950/40 border-b border-emerald-950 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
              <span>Booking Ref: <strong>B-{activeChatBooking.id.split('-')[1] || activeChatBooking.id}</strong></span>
              <span className="capitalize font-bold text-emerald-400">{activeChatBooking.serviceCategory} task</span>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/20">
              {chatMessages.map((msg) => {
                const isMe = msg.senderId !== 'customer';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[80%] ${
                      isMe ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div className="text-[9px] text-slate-400 font-extrabold mb-1 px-1">
                      {msg.senderName}
                    </div>
                    <div 
                      className={`px-4 py-2.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-xs ${
                        isMe 
                          ? 'bg-emerald-600 text-white rounded-tr-none' 
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                      }`}
                    >
                      {msg.textEn}
                    </div>
                    <span className="text-[8px] text-slate-500 mt-1 px-1 font-medium">{msg.timestamp}</span>
                  </div>
                );
              })}

              {/* Typing simulation bubble */}
              {isTypingSimulated && (
                <div className="flex flex-col items-start max-w-[80%] mr-auto">
                  <div className="text-[9px] text-slate-400 font-extrabold mb-1 px-1">
                    {activeChatBooking.customerName || 'Abhishek Tyagi'}
                  </div>
                  <div className="bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-xs text-xs font-bold flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input form */}
            <form 
              onSubmit={handleSendChatMessage}
              className="p-3 bg-slate-900 border-t border-emerald-950 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                placeholder="Type message to customer..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isSendingMessage || isTypingSimulated}
                className="flex-1 text-slate-100 bg-slate-950 border border-emerald-950 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-500 font-bold disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isSendingMessage || isTypingSimulated || !chatInput.trim()}
                className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
