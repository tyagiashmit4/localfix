'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  ShieldCheck, 
  Globe, 
  Bell, 
  Activity,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  const {
    lang,
    setLang,
    notifications,
    setNotifications,
    showNotifications,
    setShowNotifications,
    setEmergencyActive,
    t
  } = useStore();

  const userRole = (session?.user as { role?: string })?.role;

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    if (!isActive) {
      return 'px-4 py-2 rounded-xl text-sm font-semibold transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50';
    }

    if (userRole === 'PROVIDER') {
      return 'px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-emerald-50 text-emerald-700';
    }
    if (userRole === 'ADMIN') {
      return 'px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-slate-100 text-slate-800';
    }
    return 'px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-blue-50 text-blue-700';
  };

  const getLogoStyles = () => {
    if (userRole === 'PROVIDER') {
      return {
        bg: 'bg-emerald-600 shadow-emerald-500/20',
        text: 'text-emerald-600'
      };
    }
    if (userRole === 'ADMIN') {
      return {
        bg: 'bg-slate-800 shadow-slate-500/20',
        text: 'text-slate-800'
      };
    }
    return {
      bg: 'bg-blue-600 shadow-blue-500/20',
      text: 'text-blue-600'
    };
  };

  const logoStyle = getLogoStyles();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Logo brand */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className={`w-10 h-10 rounded-xl ${logoStyle.bg} flex items-center justify-center text-white shadow-md transition-all duration-300`}>
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
              Local<span className={`${logoStyle.text} transition-colors duration-300`}>Fix</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-600 block uppercase tracking-wider -mt-0.5">
              Tier-2 verified
            </span>
          </div>
        </Link>

        {/* Navigation tabs - fully role-aware */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* GUEST / CUSTOMER: Marketplace experience */}
          {(!session || userRole === 'CUSTOMER') && (
            <>
              {!session ? (
                <Link href="/" className={getLinkClass('/')}>
                  {t('home')}
                </Link>
              ) : (
                <Link href="/" className={getLinkClass('/')}>
                  {t('customerDashboard')}
                </Link>
              )}
              <Link href="/categories" className={getLinkClass('/categories')}>
                {t('categories')}
              </Link>
              <Link href="/providers" className={getLinkClass('/providers')}>
                {t('providers')}
              </Link>
            </>
          )}

          {/* PROVIDER: Provider-only experience */}
          {userRole === 'PROVIDER' && (
            <>
              <Link href="/" className={getLinkClass('/')}>
                {t('providerDashboard')}
              </Link>
            </>
          )}

          {/* ADMIN: Admin-only experience */}
          {userRole === 'ADMIN' && (
            <>
              <Link href="/" className={getLinkClass('/')}>
                {t('adminPanel')}
              </Link>
            </>
          )}

          {/* SEO link — only for guests/customers */}
          {(!session || userRole === 'CUSTOMER') && (
            <Link 
              href="/seo-simulator"
              className="px-3 py-1.5 border border-dashed border-blue-500 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all"
            >
              🔍 SEO Pages
            </Link>
          )}
        </nav>

        {/* Quick utility controls */}
        <div className="flex items-center gap-3">
          
          {/* Language Selection Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('languageLabel')}</span>
          </button>

          {/* Notification Icon Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </button>

            {/* Notification Drawer popup */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">Notifications</span>
                  <button 
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      setShowNotifications(false);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Mark read
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">No new updates</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`p-4 text-xs transition-colors ${n.read ? 'bg-white' : 'bg-blue-50/40'}`}>
                        <p className="text-slate-700 font-medium">{lang === 'en' ? n.textEn : n.textHi}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Auth: Sign In / User Menu */}
          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-xl bg-slate-100 animate-pulse"></div>
          ) : session ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 leading-tight">{session.user?.name || session.user?.email}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 leading-tight">{userRole}</span>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Emergency SOS Quick Floating Dispatcher button — only for customers/guests */}
          {(!session || userRole === 'CUSTOMER') && (
            <button
              onClick={() => {
                window.location.href = '/sos';
              }}
              className="py-2 px-3.5 md:py-2.5 md:px-5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transform active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>SOS Dispatch</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
