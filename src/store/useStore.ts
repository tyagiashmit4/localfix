import { create } from 'zustand';

import {
  Provider,
  Booking,
  Review,
  SupportTicket,
  DICTIONARY
} from '../app/data';

export interface NotificationItem {
  id: string;
  textEn: string;
  textHi: string;
  time: string;
  read: boolean;
}

export interface CityItem {
  id: string;
  nameEn: string;
  nameHi: string;
}

export interface ServiceCategory {
  id: string;
  nameEn: string;
  nameHi: string;
  icon: string;
  startingPrice: number;
  providerCount: number;
  rating: number;
  descriptionEn: string;
  descriptionHi: string;
}

interface LocalFixState {
  // Localization
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  t: (key: keyof typeof DICTIONARY['en']) => string;

  // Navigation
  currentPage: 'home' | 'categories' | 'providers' | 'provider-profile' | 'booking' | 'customer-dashboard' | 'provider-dashboard' | 'admin-panel' | 'seo-simulator';
  setCurrentPage: (page: 'home' | 'categories' | 'providers' | 'provider-profile' | 'booking' | 'customer-dashboard' | 'provider-dashboard' | 'admin-panel' | 'seo-simulator') => void;
  currentCategory: string | null;
  setCurrentCategory: (category: string | null) => void;
  selectedProvider: Provider | null;
  setSelectedProvider: (provider: Provider | null) => void;

  // Dynamic Static Content
  cities: CityItem[];
  setCities: (cities: CityItem[]) => void;
  serviceCategories: ServiceCategory[];
  setServiceCategories: (categories: ServiceCategory[]) => void;

  // Data State
  providers: Provider[];
  setProviders: (update: Provider[] | ((prev: Provider[]) => Provider[])) => void;
  bookings: Booking[];
  setBookings: (update: Booking[] | ((prev: Booking[]) => Booking[])) => void;
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  savedProviderIds: string[];
  setSavedProviderIds: (update: string[] | ((prev: string[]) => string[])) => void;
  supportTickets: SupportTicket[];
  setSupportTickets: (update: SupportTicket[] | ((prev: SupportTicket[]) => SupportTicket[])) => void;
  walletBalance: number;
  setWalletBalance: (update: number | ((prev: number) => number)) => void;
  notifications: NotificationItem[];
  setNotifications: (update: NotificationItem[] | ((prev: NotificationItem[]) => NotificationItem[])) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;

  // Search & Filter Workspace
  filterMinExperience: number;
  setFilterMinExperience: (exp: number) => void;
  filterMaxPrice: number;
  setFilterMaxPrice: (price: number) => void;
  sortBy: 'rating' | 'experience' | 'priceAsc' | 'priceDesc';
  setSortBy: (sortBy: 'rating' | 'experience' | 'priceAsc' | 'priceDesc') => void;
  isMapView: boolean;
  setIsMapView: (view: boolean) => void;

  // Booking Flow Details
  bookingStep: number;
  setBookingStep: (step: number) => void;
  bookingSelectedSlot: string;
  setBookingSelectedSlot: (slot: string) => void;
  bookingPromoCode: string;
  setBookingPromoCode: (code: string) => void;
  bookingNotes: string;
  setBookingNotes: (notes: string) => void;
  bookingPromoApplied: boolean;
  setBookingPromoApplied: (applied: boolean) => void;
  bookingPromoDiscount: number;
  setBookingPromoDiscount: (discount: number) => void;
  bookingPaymentMethod: 'wallet' | 'razorpay';
  setBookingPaymentMethod: (method: 'wallet' | 'razorpay') => void;
  bookingShowPaymentSimulator: boolean;
  setBookingShowPaymentSimulator: (show: boolean) => void;
  bookingRazorpaySimulating: boolean;
  setBookingRazorpaySimulating: (simulating: boolean) => void;
  bookingSuccessDetails: Booking | null;
  setBookingSuccessDetails: (details: Booking | null) => void;

  // Emergency SOS Dispatch
  emergencyStep: 'idle' | 'searching' | 'matched';
  setEmergencyStep: (step: 'idle' | 'searching' | 'matched') => void;
  emergencyProgress: number;
  setEmergencyProgress: (update: number | ((prev: number) => number)) => void;
  emergencyProvider: Provider | null;
  setEmergencyProvider: (provider: Provider | null) => void;
  emergencyActive: boolean;
  setEmergencyActive: (active: boolean) => void;

  // Provider Settings Workspace
  providerTotalEarnings: number;
  setProviderTotalEarnings: (earnings: number) => void;
  providerUploadState: 'idle' | 'uploading' | 'completed';
  setProviderUploadState: (state: 'idle' | 'uploading' | 'completed') => void;
  providerRates: number;
  setProviderRates: (rates: number) => void;
  providerAreas: string;
  setProviderAreas: (areas: string) => void;
  providerBio: string;
  setProviderBio: (bio: string) => void;

  // Admin Broadcast Details
  adminSelectedProvider: Provider | null;
  setAdminSelectedProvider: (provider: Provider | null) => void;
  customNotificationEn: string;
  setCustomNotificationEn: (text: string) => void;
  customNotificationHi: string;
  setCustomNotificationHi: (text: string) => void;

  // SEO Target Page Coordinates
  seoService: string;
  setSeoService: (service: string) => void;
  seoCity: string;
  setSeoCity: (city: string) => void;

  // Core Actions
  addNotification: (textEn: string, textHi: string) => void;
  initiateBooking: (provider: Provider) => void;
  resetBookingFlow: () => void;
  fetchInitialData: () => Promise<void>;
  createBooking: (booking: Booking) => Promise<void>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
}

export const useStore = create<LocalFixState>((set, get) => ({
  // Localization
  lang: 'en',
  setLang: (lang) => set({ lang }),
  selectedCity: 'aligarh',
  setSelectedCity: (selectedCity) => set({ selectedCity }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  t: (key) => {
    const { lang } = get();
    return DICTIONARY[lang][key] || DICTIONARY['en'][key] || String(key);
  },

  // Navigation
  currentPage: 'home',
  setCurrentPage: (currentPage) => set({ currentPage }),
  currentCategory: null,
  setCurrentCategory: (currentCategory) => set({ currentCategory }),
  selectedProvider: null,
  setSelectedProvider: (selectedProvider) => set({ selectedProvider }),

  // Dynamic Static Content
  cities: [],
  setCities: (cities) => set({ cities }),
  serviceCategories: [],
  setServiceCategories: (serviceCategories) => set({ serviceCategories }),

  // Data State
  providers: [],
  setProviders: (update) => set((state) => ({
    providers: typeof update === 'function' ? update(state.providers) : update
  })),
  bookings: [],
  setBookings: (update) => set((state) => ({
    bookings: typeof update === 'function' ? update(state.bookings) : update
  })),
  reviews: [],
  setReviews: (reviews) => set({ reviews }),
  savedProviderIds: [],
  setSavedProviderIds: (update) => set((state) => ({
    savedProviderIds: typeof update === 'function' ? update(state.savedProviderIds) : update
  })),
  supportTickets: [],
  setSupportTickets: (update) => set((state) => ({
    supportTickets: typeof update === 'function' ? update(state.supportTickets) : update
  })),
  walletBalance: 0,
  setWalletBalance: (update) => {
    set((state) => {
      const nextBalance = typeof update === 'function' ? update(state.walletBalance) : update;
      
      // Persist the balance updates to the database in background thread
      fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletBalance: nextBalance }),
      }).catch((err) => console.error('Failed to synchronize walletBalance to database:', err));

      return { walletBalance: nextBalance };
    });
  },
  notifications: [],
  setNotifications: (update) => {
    set((state) => {
      const nextNotifications = typeof update === 'function' ? update(state.notifications) : update;

      // Sync the notification updates to database in background
      fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications: nextNotifications }),
      }).catch((err) => console.error('Failed to synchronize notifications to database:', err));

      return { notifications: nextNotifications };
    });
  },
  showNotifications: false,
  setShowNotifications: (showNotifications) => set({ showNotifications }),

  // Search & Filter Workspace
  filterMinExperience: 0,
  setFilterMinExperience: (filterMinExperience) => set({ filterMinExperience }),
  filterMaxPrice: 1000,
  setFilterMaxPrice: (filterMaxPrice) => set({ filterMaxPrice }),
  sortBy: 'rating',
  setSortBy: (sortBy) => set({ sortBy }),
  isMapView: false,
  setIsMapView: (isMapView) => set({ isMapView }),

  // Booking Flow Details
  bookingStep: 1,
  setBookingStep: (bookingStep) => set({ bookingStep }),
  bookingSelectedSlot: '10:00 AM - 12:00 PM',
  setBookingSelectedSlot: (bookingSelectedSlot) => set({ bookingSelectedSlot }),
  bookingPromoCode: '',
  setBookingPromoCode: (bookingPromoCode) => set({ bookingPromoCode }),
  bookingNotes: '',
  setBookingNotes: (bookingNotes) => set({ bookingNotes }),
  bookingPromoApplied: false,
  setBookingPromoApplied: (bookingPromoApplied) => set({ bookingPromoApplied }),
  bookingPromoDiscount: 0,
  setBookingPromoDiscount: (bookingPromoDiscount) => set({ bookingPromoDiscount }),
  bookingPaymentMethod: 'wallet',
  setBookingPaymentMethod: (bookingPaymentMethod) => set({ bookingPaymentMethod }),
  bookingShowPaymentSimulator: false,
  setBookingShowPaymentSimulator: (bookingShowPaymentSimulator) => set({ bookingShowPaymentSimulator }),
  bookingRazorpaySimulating: false,
  setBookingRazorpaySimulating: (bookingRazorpaySimulating) => set({ bookingRazorpaySimulating }),
  bookingSuccessDetails: null,
  setBookingSuccessDetails: (bookingSuccessDetails) => set({ bookingSuccessDetails }),

  // Emergency SOS Dispatch
  emergencyStep: 'idle',
  setEmergencyStep: (emergencyStep) => set({ emergencyStep }),
  emergencyProgress: 0,
  setEmergencyProgress: (update) => set((state) => ({
    emergencyProgress: typeof update === 'function' ? update(state.emergencyProgress) : update
  })),
  emergencyProvider: null,
  setEmergencyProvider: (emergencyProvider) => set({ emergencyProvider }),
  emergencyActive: false,
  setEmergencyActive: (emergencyActive) => set({ emergencyActive }),

  // Provider Settings Workspace
  providerTotalEarnings: 0,
  setProviderTotalEarnings: (providerTotalEarnings) => set({ providerTotalEarnings }),
  providerUploadState: 'idle',
  setProviderUploadState: (providerUploadState) => set({ providerUploadState }),
  providerRates: 0,
  setProviderRates: (providerRates) => set({ providerRates }),
  providerAreas: '',
  setProviderAreas: (providerAreas) => set({ providerAreas }),
  providerBio: '',
  setProviderBio: (providerBio) => set({ providerBio }),

  // Admin Broadcast Details
  adminSelectedProvider: null,
  setAdminSelectedProvider: (adminSelectedProvider) => set({ adminSelectedProvider }),
  customNotificationEn: '',
  setCustomNotificationEn: (customNotificationEn) => set({ customNotificationEn }),
  customNotificationHi: '',
  setCustomNotificationHi: (customNotificationHi) => set({ customNotificationHi }),

  // SEO Target Page Coordinates
  seoService: 'electrician',
  setSeoService: (seoService) => set({ seoService }),
  seoCity: 'aligarh',
  setSeoCity: (seoCity) => set({ seoCity }),

  // Core Actions
  addNotification: (textEn, textHi) => {
    const newNotification: NotificationItem = {
      id: 'n_' + Date.now() + '_' + Math.floor(Math.random() * 1000000),
      textEn,
      textHi,
      time: 'Just now',
      read: false
    };

    set((state) => {
      const nextNotifications = [newNotification, ...state.notifications];

      // Sync the notification updates to database in background
      fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications: nextNotifications }),
      }).catch((err) => console.error('Failed to synchronize new notification to database:', err));

      return { notifications: nextNotifications };
    });
  },

  initiateBooking: (provider) => {
    set({
      selectedProvider: provider,
      currentPage: 'booking',
      bookingStep: 1,
      bookingPromoApplied: false,
      bookingPromoDiscount: 0,
      bookingPromoCode: '',
      bookingNotes: '',
      bookingShowPaymentSimulator: false,
      bookingRazorpaySimulating: false,
      bookingSuccessDetails: null
    });
  },

  resetBookingFlow: () => {
    set({
      bookingStep: 1,
      bookingPromoApplied: false,
      bookingPromoDiscount: 0,
      bookingPromoCode: '',
      bookingNotes: '',
      bookingShowPaymentSimulator: false,
      bookingRazorpaySimulating: false,
      bookingSuccessDetails: null
    });
  },

  fetchInitialData: async () => {
    try {
      const [
        providersRes,
        bookingsRes,
        reviewsRes,
        ticketsRes,
        citiesRes,
        categoriesRes,
        profileRes
      ] = await Promise.all([
        fetch('/api/providers'),
        fetch('/api/bookings'),
        fetch('/api/reviews'),
        fetch('/api/tickets'),
        fetch('/api/cities'),
        fetch('/api/categories'),
        fetch('/api/user/profile')
      ]);

      if (providersRes.ok) {
        const data = await providersRes.json();
        set({ providers: data });
      }
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        set({ bookings: data });
      }
      if (reviewsRes.ok) {
        const data = await reviewsRes.json();
        set({ reviews: data });
      }
      if (ticketsRes.ok) {
        const data = await ticketsRes.json();
        set({ supportTickets: data });
      }
      if (citiesRes.ok) {
        const data = await citiesRes.json();
        set({ cities: data });
      }
      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        set({ serviceCategories: data });
      }
      if (profileRes.ok) {
        const profile = await profileRes.json();
        set({
          walletBalance: profile.walletBalance,
          notifications: profile.notifications
        });
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  },

  createBooking: async (booking) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      if (res.ok) {
        const newBooking = await res.json();
        set((state) => ({ bookings: [newBooking, ...state.bookings] }));
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  },

  updateBooking: async (id, updates) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updatedBooking = await res.json();
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...updatedBooking } : b)),
        }));
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  }
}));
