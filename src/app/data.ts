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

export interface Provider {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
  category: string;
  experience: number;
  rating: number;
  reviewsCount: number;
  pricePerHr: number;
  aadhaarVerified: boolean;
  phone: string;
  whatsapp: string;
  bioEn: string;
  bioHi: string;
  certificationsEn: string[];
  certificationsHi: string[];
  completedJobs: number;
  city: string;
  areas: string[];
  gallery: string[];
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  serviceCategory: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
  appliedPromo?: string;
  paymentStatus: 'paid' | 'pending' | 'refunded';
}

export interface Review {
  id: string;
  providerId: string;
  customerName: string;
  rating: number;
  commentEn: string;
  commentHi: string;
  date: string;
}

export interface SupportTicket {
  id: string;
  subjectEn: string;
  subjectHi: string;
  status: 'open' | 'resolved';
  category: string;
  date: string;
}

export const CITIES = [
  { id: 'aligarh', nameEn: 'Aligarh', nameHi: 'अलीगढ़' },
  { id: 'meerut', nameEn: 'Meerut', nameHi: 'मेरठ' },
  { id: 'agra', nameEn: 'Agra', nameHi: 'आगरा' },
  { id: 'noida_ext', nameEn: 'Noida Extension', nameHi: 'नोएडा एक्सटेंशन' },
  { id: 'kanpur_out', nameEn: 'Kanpur Outskirts', nameHi: 'कानपुर बाहरी क्षेत्र' }
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'electrician',
    nameEn: 'Electrician',
    nameHi: 'बिजली मिस्त्री',
    icon: 'Zap',
    startingPrice: 199,
    providerCount: 14,
    rating: 4.8,
    descriptionEn: 'Short circuits, fan installation, wiring, switches & home appliance repair.',
    descriptionHi: 'शॉर्ट सर्किट, पंखा लगाना, वायरिंग, स्विच और घरेलू उपकरणों की मरम्मत।'
  },
  {
    id: 'plumber',
    nameEn: 'Plumber',
    nameHi: 'नलसाज',
    icon: 'Droplet',
    startingPrice: 149,
    providerCount: 12,
    rating: 4.7,
    descriptionEn: 'Leaking pipes, tap installations, bathroom fittings & drainage clearance.',
    descriptionHi: 'लीक पाइप, नल लगाना, बाथरूम फिटिंग और जल निकासी की सफाई।'
  },
  {
    id: 'ac_repair',
    nameEn: 'AC Repair',
    nameHi: 'एसी मरम्मत',
    icon: 'Wind',
    startingPrice: 349,
    providerCount: 10,
    rating: 4.9,
    descriptionEn: 'AC servicing, gas charging, filter cleaning, and compressor troubleshooting.',
    descriptionHi: 'एसी सर्विसिंग, गैस चार्जिंग, फिल्टर सफाई और कंप्रेसर की मरम्मत।'
  },
  {
    id: 'cleaning',
    nameEn: 'Home Cleaning',
    nameHi: 'घर की सफाई',
    icon: 'Sparkles',
    startingPrice: 499,
    providerCount: 8,
    rating: 4.6,
    descriptionEn: 'Deep house cleaning, kitchen scrubbing, bathroom sanitization, & sofa dry cleaning.',
    descriptionHi: 'घर की गहरी सफाई, रसोई की घिसाई, बाथरूम की सफाई और सोफे की ड्राई क्लीनिंग।'
  },
  {
    id: 'tutor',
    nameEn: 'Tutor',
    nameHi: 'शिक्षक',
    icon: 'BookOpen',
    startingPrice: 299,
    providerCount: 15,
    rating: 4.9,
    descriptionEn: 'Home tuition for K-10, Mathematics, Science, and English support.',
    descriptionHi: 'कक्षा 1 से 10 तक के लिए घरेलू ट्यूशन, गणित, विज्ञान और अंग्रेजी सहायता।'
  },
  {
    id: 'carpenter',
    nameEn: 'Carpenter',
    nameHi: 'बढ़ई',
    icon: 'Hammer',
    startingPrice: 199,
    providerCount: 9,
    rating: 4.7,
    descriptionEn: 'Furniture repair, door locking assembly, custom modular fitting & assembly.',
    descriptionHi: 'फर्नीचर मरम्मत, दरवाजा लॉक लगाना, कस्टम मॉड्युलर फिटिंग और असेंबली।'
  },
  {
    id: 'painter',
    nameEn: 'Painter',
    nameHi: 'चित्रकार',
    icon: 'Paintbrush',
    startingPrice: 999,
    providerCount: 7,
    rating: 4.8,
    descriptionEn: 'Wall painting, damp-proofing, wall putty application & decorative textures.',
    descriptionHi: 'दीवारों की पेंटिंग, डैम्प-प्रूफिंग, वॉल पुट्टी लगाना और सजावटी बनावट।'
  },
  {
    id: 'laptop_repair',
    nameEn: 'Laptop Repair',
    nameHi: 'लैपटॉप मरम्मत',
    icon: 'Laptop',
    startingPrice: 299,
    providerCount: 6,
    rating: 4.5,
    descriptionEn: 'OS installation, keyboard replacement, screen repair, & virus removal.',
    descriptionHi: 'ओएस इंस्टॉलेशन, कीबोर्ड बदलना, स्क्रीन मरम्मत और वायरस हटाना।'
  },
  {
    id: 'ro_repair',
    nameEn: 'RO Repair',
    nameHi: 'आरओ मरम्मत',
    icon: 'GlassWater',
    startingPrice: 249,
    providerCount: 11,
    rating: 4.8,
    descriptionEn: 'Water purifier service, filter replacement, TDS calibration & pump repair.',
    descriptionHi: 'वाटर प्यूरीफायर सर्विस, फिल्टर बदलना, टीडीएस अंशांकन और पंप मरम्मत।'
  },
  {
    id: 'cctv',
    nameEn: 'CCTV Installation',
    nameHi: 'सीसीटीवी लगाना',
    icon: 'Eye',
    startingPrice: 499,
    providerCount: 8,
    rating: 4.9,
    descriptionEn: 'Security camera setup, DVR configuration, mobile streaming setup & cabling.',
    descriptionHi: 'सुरक्षा कैमरा सेटअप, डीवीआर कॉन्फ़िगरेशन, मोबाइल स्ट्रीमिंग सेटअप और केबल बिछाना।'
  }
];

export const MOCK_PROVIDERS: Provider[] = [
  {
    id: 'p1',
    name: 'Ramesh Kumar Sharma',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    category: 'electrician',
    experience: 8,
    rating: 4.9,
    reviewsCount: 142,
    pricePerHr: 249,
    aadhaarVerified: true,
    phone: '+91 98765 43210',
    whatsapp: 'https://wa.me/919876543210',
    bioEn: 'Senior electrician with 8+ years of experience in Aligarh. Specialist in smart home wiring, heavy loads, and industrial grade short circuits troubleshooting.',
    bioHi: 'अलीगढ़ में 8+ वर्षों के अनुभव के साथ वरिष्ठ बिजली मिस्त्री। स्मार्ट होम वायरिंग, भारी लोड और औद्योगिक स्तर के शॉर्ट सर्किट की समस्या निवारण में विशेषज्ञ।',
    certificationsEn: ['ITI Certified Wireman', 'Govt. Electrical Licence Holder'],
    certificationsHi: ['आईटीआई प्रमाणित वायरमैन', 'सरकारी विद्युत लाइसेंस धारक'],
    completedJobs: 920,
    city: 'aligarh',
    areas: ['Civil Lines', 'Ramghat Road', 'Dodhpur', 'Quarsi'],
    gallery: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p2',
    name: 'Amit Patel',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    category: 'electrician',
    experience: 5,
    rating: 4.7,
    reviewsCount: 88,
    pricePerHr: 199,
    aadhaarVerified: true,
    phone: '+91 91234 56789',
    whatsapp: 'https://wa.me/919123456789',
    bioEn: 'Punctual, friendly and reliable electrician in Meerut. Happy to help with domestic works, switch replacements and fan repairings.',
    bioHi: 'मेरठ में समय के पाबंद, मिलनसार और विश्वसनीय बिजली मिस्त्री। घरेलू काम, स्विच बदलने और पंखे की मरम्मत में मदद करने के लिए तत्पर।',
    certificationsEn: ['State Polytech Electrical Diploma'],
    certificationsHi: ['राज्य पॉलिटेक्निक इलेक्ट्रिकल डिप्लोमा'],
    completedJobs: 410,
    city: 'meerut',
    areas: ['Begum Bridge', 'Shastri Nagar', 'Modipuram', 'Pallavpuram'],
    gallery: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p3',
    name: 'Suresh Kumar Yadav',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    category: 'plumber',
    experience: 12,
    rating: 4.8,
    reviewsCount: 204,
    pricePerHr: 179,
    aadhaarVerified: true,
    phone: '+91 98877 66554',
    whatsapp: 'https://wa.me/919887766554',
    bioEn: 'Expert plumber in Agra with over a decade of experience dealing with complex drainage systems, premium shower fits and water pressure calibration.',
    bioHi: 'आगरा में विशेषज्ञ नलसाज, जटिल जल निकासी प्रणालियों, प्रीमियम शॉवर फिटिंग और पानी के दबाव अंशांकन में एक दशक से अधिक का अनुभव।',
    certificationsEn: ['Agra Plumber Association Certified Master Plumber'],
    certificationsHi: ['आगरा प्लंबर एसोसिएशन प्रमाणित मास्टर प्लंबर'],
    completedJobs: 1380,
    city: 'agra',
    areas: ['Tajganj', 'Sanjay Place', 'Dayalbagh', 'Kamla Nagar'],
    gallery: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p4',
    name: 'Sunita Mishra',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    category: 'tutor',
    experience: 6,
    rating: 4.9,
    reviewsCount: 75,
    pricePerHr: 399,
    aadhaarVerified: true,
    phone: '+91 99999 88888',
    whatsapp: 'https://wa.me/919999988888',
    bioEn: 'Dedicated home tutor for K-10 students in Noida Extension. Highly experienced in CBSE/ICSE curricula. Specialist in Mathematics and Science.',
    bioHi: 'नोएडा एक्सटेंशन में कक्षा 1 से 10 तक के छात्रों के लिए समर्पित गृह शिक्षिका। सीबीएसई/आईसीएसई पाठ्यक्रम में अत्यधिक अनुभवी। गणित और विज्ञान में विशेषज्ञ।',
    certificationsEn: ['B.Ed. (Gold Medalist)', 'M.Sc. Mathematics'],
    certificationsHi: ['बी.एड. (स्वर्ण पदक विजेता)', 'एम.एससी. गणित'],
    completedJobs: 180,
    city: 'noida_ext',
    areas: ['Gaur City', 'Sector 1', 'Sector 16C', 'Techzone IV'],
    gallery: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p5',
    name: 'Vikram Singh Negi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    category: 'ac_repair',
    experience: 7,
    rating: 4.9,
    reviewsCount: 110,
    pricePerHr: 399,
    aadhaarVerified: true,
    phone: '+91 88888 77777',
    whatsapp: 'https://wa.me/918888877777',
    bioEn: 'AC Service & Repair Specialist. Expert in all brands (Daikin, Voltas, LG, Samsung) split & window systems. Available for emergency services.',
    bioHi: 'एसी सर्विस और रिपेयर विशेषज्ञ। सभी ब्रांड (डाइकिन, वोल्टास, एलजी, सैमसंग) स्प्लिट और विंडो सिस्टम में विशेषज्ञ। आपातकालीन सेवाओं के लिए उपलब्ध।',
    certificationsEn: ['Daikin Certified Technician', 'HVAC Diploma Holder'],
    certificationsHi: ['डाइकिन प्रमाणित तकनीशियन', 'एचवीएसी डिप्लोमा धारक'],
    completedJobs: 690,
    city: 'aligarh',
    areas: ['Civil Lines', 'Ramghat Road', 'Quarsi', 'Tala Nagri'],
    gallery: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p6',
    name: 'Rajinder Prasad',
    avatar: 'https://images.unsplash.com/photo-1618085222100-93f0eecaf011?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
    category: 'cleaning',
    experience: 4,
    rating: 4.6,
    reviewsCount: 52,
    pricePerHr: 499,
    aadhaarVerified: false,
    phone: '+91 77777 66666',
    whatsapp: 'https://wa.me/917777766666',
    bioEn: 'Professional deep cleaning service. Equipped with modern vacuum cleaners, bio-safe cleaning solutions, and sanitization kits.',
    bioHi: 'पेशेवर डीप क्लीनिंग सेवा। आधुनिक वैक्यूम क्लीनर, बायो-सेफ क्लीनिंग सॉल्यूशंस और सैनिटाइजेशन किट से लैस।',
    certificationsEn: ['National Cleaning Council Standard Training'],
    certificationsHi: ['राष्ट्रीय सफाई परिषद मानक प्रशिक्षण'],
    completedJobs: 240,
    city: 'meerut',
    areas: ['Shastri Nagar', 'Modipuram', 'Meerut Cantt'],
    gallery: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p7',
    name: 'Manoj Vishwakarma',
    avatar: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=80',
    category: 'carpenter',
    experience: 9,
    rating: 4.8,
    reviewsCount: 96,
    pricePerHr: 220,
    aadhaarVerified: true,
    phone: '+91 96543 21098',
    whatsapp: 'https://wa.me/919654321098',
    bioEn: 'Talented Carpenter in Aligarh. Expert in modular wardrobes, hinge repairs, sliding doors adjustments and custom plywood fitting.',
    bioHi: 'अलीगढ़ में प्रतिभाशाली बढ़ई। मॉड्यूलर वार्डरोब, हिंज मरम्मत, स्लाइडिंग डोर समायोजन और कस्टम प्लाईवुड फिटिंग में विशेषज्ञ।',
    certificationsEn: ['Plywood Safety & Precision Certified'],
    certificationsHi: ['प्लाईवुड सुरक्षा और परिशुद्धता प्रमाणित'],
    completedJobs: 570,
    city: 'aligarh',
    areas: ['Dodhpur', 'Quarsi', 'Ramghat Road'],
    gallery: []
  },
  {
    id: 'p8',
    name: 'Sanjeev Shrivastav',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80',
    category: 'ro_repair',
    experience: 6,
    rating: 4.7,
    reviewsCount: 114,
    pricePerHr: 249,
    aadhaarVerified: true,
    phone: '+91 88990 01122',
    whatsapp: 'https://wa.me/918899001122',
    bioEn: 'RO and Water Purifier specialist. Expertise in Kent, Aquaguard, Pureit, and local custom setups. High-accuracy TDS calibration.',
    bioHi: 'आरओ और वाटर प्यूरीफायर विशेषज्ञ। केंट, एक्वागार्ड, प्योरिट और स्थानीय कस्टम सेटअप में विशेषज्ञता। उच्च-सटीकता टीडीएस अंशांकन।',
    certificationsEn: ['RO Water Association Certified Technician'],
    certificationsHi: ['आरओ वाटर एसोसिएशन प्रमाणित तकनीशियन'],
    completedJobs: 820,
    city: 'agra',
    areas: ['Dayalbagh', 'Sanjay Place', 'Tajganj'],
    gallery: []
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'B-1082',
    customerName: 'Abhishek Tyagi',
    customerPhone: '+91 99887 76655',
    customerAddress: 'Flat 402, Royal Residency, Ramghat Road',
    city: 'aligarh',
    serviceCategory: 'electrician',
    providerId: 'p1',
    providerName: 'Ramesh Kumar Sharma',
    providerAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    date: '2026-05-22',
    timeSlot: '10:00 AM - 12:00 PM',
    status: 'pending',
    price: 249,
    notes: 'Fans in the drawing room are making a loud noise. Needs capacitor replacement.',
    appliedPromo: 'WELCOME100',
    paymentStatus: 'pending'
  },
  {
    id: 'B-1081',
    customerName: 'Priyal Sharma',
    customerPhone: '+91 91122 33445',
    customerAddress: 'House 24B, Shastri Nagar',
    city: 'meerut',
    serviceCategory: 'cleaning',
    providerId: 'p6',
    providerName: 'Rajinder Prasad',
    providerAvatar: 'https://images.unsplash.com/photo-1618085222100-93f0eecaf011?w=150&auto=format&fit=crop&q=80',
    date: '2026-05-18',
    timeSlot: '02:00 PM - 04:00 PM',
    status: 'completed',
    price: 499,
    notes: 'Kitchen deep cleaning requested.',
    paymentStatus: 'paid'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    providerId: 'p1',
    customerName: 'Anil Kumar',
    rating: 5,
    commentEn: 'Ramesh was extremely prompt. He resolved our drawing room short circuit in 20 minutes! Highly professional and verified.',
    commentHi: 'रमेश बेहद तत्पर थे। उन्होंने हमारे ड्राइंग रूम के शॉर्ट सर्किट को 20 मिनट में ठीक कर दिया! अत्यधिक पेशेवर और सत्यापित।',
    date: '2026-05-15'
  },
  {
    id: 'r2',
    providerId: 'p1',
    customerName: 'Meena Gupta',
    rating: 4,
    commentEn: 'Excellent work in fixing our ceiling fan wiring. Price was very fair.',
    commentHi: 'हमारे सीलिंग फैन की वायरिंग को ठीक करने में बेहतरीन काम। कीमत बहुत वाजिब थी।',
    date: '2026-05-10'
  },
  {
    id: 'r3',
    providerId: 'p3',
    customerName: 'Dinesh Chandra',
    rating: 5,
    commentEn: 'Suresh is easily the best plumber in Agra. He repaired the leakage in our overhead tank which three other plumbers failed to fix.',
    commentHi: 'सुरेश आसानी से आगरा के सबसे अच्छे नलसाज हैं। उन्होंने हमारे ओवरहेड टैंक के रिसाव की मरम्मत की जिसे तीन अन्य नलसाज ठीक नहीं कर पाए थे।',
    date: '2026-05-14'
  }
];

export const DICTIONARY = {
  en: {
    title: 'LocalFix',
    tagline: 'Trusted Local Services In Your City',
    subtagline: 'Instant discovery & secure booking of verified local professionals in Tier 2 & Tier 3 cities',
    searchPlaceholder: 'Search for Electricians, Plumbers, Tutors...',
    selectCity: 'Select City',
    findServices: 'Find Services',
    becomeProvider: 'Become a Provider',
    howItWorks: 'How it Works',
    howItWorksSub: 'Book a premium service in 3 easy steps',
    step1Title: 'Select Service',
    step1Desc: 'Choose what you need from our wide variety of verified local trade tasks.',
    step2Title: 'Compare & Select',
    step2Desc: 'Review verified provider profiles, feedback ratings, and custom price cards.',
    step3Title: 'Instant WhatsApp Booking',
    step3Desc: 'Confirm with secure OTP and trigger direct worker communication on WhatsApp.',
    whyChooseUs: 'Why Tier-2 India Trusts Us',
    why1Title: '100% Aadhaar Verified',
    why1Desc: 'Every provider undergoes physical and biometric Aadhaar credential verification.',
    why2Title: 'No Middleman Commission',
    why2Desc: 'Direct calling & WhatsApp buttons to keep costs honest and local jobs supported.',
    why3Title: 'Super Fast Response',
    why3Desc: 'Active providers in your near coordinates for ultra quick dispatch in under 45 mins.',
    popularCategories: 'Popular Service Categories',
    popularSub: 'Explore our leading home solutions',
    verifiedProviders: 'Verified Experts in Your Area',
    testimonials: 'What Our Customers Say',
    faq: 'Frequently Asked Questions',
    faqSub: 'Clear answers for smart bookings',
    downloadApp: 'Download LocalFix Mobile App',
    downloadSub: 'Get ₹100 flat wallet cash on your first installation. Lightweight APK for budget Android devices.',
    getAppButton: 'Get Mobile App APK',
    footerText: '© 2026 LocalFix Marketplace. Proudly empowering local service workers in small Indian cities.',
    experience: 'Experience',
    years: 'years',
    pricing: 'Starting at',
    verified: 'Verified',
    ratings: 'Ratings',
    whatsappButton: 'WhatsApp Provider',
    callButton: 'Call Direct',
    bookNowButton: 'Book Now',
    reviews: 'Reviews',
    home: 'Home',
    categories: 'Categories',
    providers: 'Providers',
    customerDashboard: 'My Bookings',
    providerDashboard: 'Worker Portal',
    adminPanel: 'Admin Dashboard',
    emergencyMode: 'Emergency SOS Mode',
    emergencyDesc: 'Instant 1-Click SOS for Urgent repairs (Plumbing, Gas leakage, Electrical short-circuit)',
    languageLabel: 'हिंदी / English',
    promoLabel: 'Use Promo Code',
    promoSuccess: 'Promo code applied successfully!',
    paymentTitle: 'LocalFix Secure Gateway',
    paymentSub: 'Simulating Razorpay Payment Integration',
    payButton: 'Complete Booking Payment',
    bookingSuccess: 'Booking Confirmed!',
    bookingSuccessDesc: 'Your request has been registered. The provider will contact you shortly.',
    trackBooking: 'Track Booking Status',
    earnings: 'Total Earnings',
    activeLeads: 'Active Leads',
    pendingApprovals: 'Pending Approvals',
    approve: 'Approve Aadhaar Documents',
    reject: 'Reject & Block',
    savedProviders: 'Saved Experts',
    walletRefunds: 'Wallet & Refunds',
    supportTickets: 'Support Tickets',
    createNewTicket: 'Submit Support Ticket',
    aiRecommendations: 'AI Provider Recommendations',
    aiSlogan: 'Dynamic match based on ratings, local distance, and historical performance.',
    yearsExp: 'Years Exp',
    ratingCount: 'Ratings',
    jobsDone: 'Jobs Completed',
    priceHr: 'Price / Hr',
    biometricStatus: 'Aadhaar Biometric Check Passed',
    serviceAreas: 'Service Coordinates / Areas',
    certifications: 'Badges & Accreditations',
    calendarAvailable: 'Availability Calendar',
    similarProviders: 'Similar Experts Nearby'
  },
  hi: {
    title: 'लोकलफिक्स',
    tagline: 'आपके शहर में विश्वसनीय स्थानीय सेवाएं',
    subtagline: 'टियर 2 और टियर 3 शहरों में सत्यापित स्थानीय पेशेवरों की त्वरित खोज और सुरक्षित बुकिंग',
    searchPlaceholder: 'बिजली मिस्त्री, नलसाज, शिक्षक खोजें...',
    selectCity: 'शहर चुनें',
    findServices: 'सेवाएं खोजें',
    becomeProvider: 'सेवा प्रदाता बनें',
    howItWorks: 'यह कैसे काम करता है',
    howItWorksSub: '3 आसान चरणों में प्रीमियम सेवा बुक करें',
    step1Title: 'सेवा चुनें',
    step1Desc: 'सत्यापित स्थानीय व्यापार कार्यों की हमारी विस्तृत विविधता में से चुनें।',
    step2Title: 'तुलना करें और चुनें',
    step2Desc: 'सत्यापित प्रदाता प्रोफाइल, फीडबैक रेटिंग और कस्टम मूल्य कार्ड की समीक्षा करें।',
    step3Title: 'त्वरित व्हाट्सएप बुकिंग',
    step3Desc: 'सुरक्षित ओटीपी के साथ पुष्टि करें और व्हाट्सएप पर सीधे कार्यकर्ता संचार शुरू करें।',
    whyChooseUs: 'टियर-2 भारत हम पर भरोसा क्यों करता है',
    why1Title: '100% आधार सत्यापित',
    why1Desc: 'प्रत्येक प्रदाता का भौतिक और बायोमेट्रिक आधार प्रमाण पत्र सत्यापन किया जाता है।',
    why2Title: 'कोई बिचौलिया कमीशन नहीं',
    why2Desc: 'लागत को ईमानदार रखने और स्थानीय नौकरियों का समर्थन करने के लिए सीधे कॉल और व्हाट्सएप बटन।',
    why3Title: 'सुपर फास्ट प्रतिक्रिया',
    why3Desc: '45 मिनट से कम समय में त्वरित प्रेषण के लिए आपके नजदीकी सक्रिय प्रदाता।',
    popularCategories: 'लोकप्रिय सेवा श्रेणियां',
    popularSub: 'हमारे प्रमुख गृह समाधान देखें',
    verifiedProviders: 'आपके क्षेत्र में सत्यापित विशेषज्ञ',
    testimonials: 'हमारे ग्राहक क्या कहते हैं',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    faqSub: 'स्मार्ट बुकिंग के लिए स्पष्ट उत्तर',
    downloadApp: 'लोकलफिक्स मोबाइल ऐप डाउनलोड करें',
    downloadSub: 'अपनी पहली स्थापना पर ₹100 फ्लैट वॉलेट नकद प्राप्त करें। बजट एंड्रॉइड उपकरणों के लिए लाइटवेट एपीके।',
    getAppButton: 'मोबाइल ऐप एपीके प्राप्त करें',
    footerText: '© 2026 लोकलफिक्स मार्केटप्लेस। छोटे भारतीय शहरों में स्थानीय सेवा कर्मियों को सशक्त बनाने पर गर्व है।',
    experience: 'अनुभव',
    years: 'साल',
    pricing: 'प्रारंभिक मूल्य',
    verified: 'सत्यापित',
    ratings: 'रेटिंग',
    whatsappButton: 'व्हाट्सएप करें',
    callButton: 'सीधा कॉल करें',
    bookNowButton: 'अभी बुक करें',
    reviews: 'समीक्षाएं',
    home: 'होम',
    categories: 'श्रेणियां',
    providers: 'प्रदाता',
    customerDashboard: 'मेरी बुकिंग',
    providerDashboard: 'कर्मचारी पोर्टल',
    adminPanel: 'एडमिन डैशबोर्ड',
    emergencyMode: 'आपातकालीन एसओएस',
    emergencyDesc: 'त्वरित आपातकालीन मरम्मत के लिए 1-क्लिक एसओएस (नलसाजी, गैस रिसाव, बिजली का शॉर्ट-सर्किट)',
    languageLabel: 'English / हिंदी',
    promoLabel: 'प्रोमो कोड का प्रयोग करें',
    promoSuccess: 'प्रोमो कोड सफलतापूर्वक लागू किया गया!',
    paymentTitle: 'लोकलफिक्स सुरक्षित गेटवे',
    paymentSub: 'रेज़रपे भुगतान एकीकरण सिमुलेशन',
    payButton: 'बुकिंग भुगतान पूरा करें',
    bookingSuccess: 'बुकिंग की पुष्टि हो गई!',
    bookingSuccessDesc: 'आपका अनुरोध दर्ज कर लिया गया है। प्रदाता जल्द ही आपसे संपर्क करेगा।',
    trackBooking: 'बुकिंग स्थिति को ट्रैक करें',
    earnings: 'कुल कमाई',
    activeLeads: 'सक्रिय लीड्स',
    pendingApprovals: 'लंबित स्वीकृतियां',
    approve: 'आधार दस्तावेजों को स्वीकृत करें',
    reject: 'अस्वीकार और ब्लॉक करें',
    savedProviders: 'पसंदीदा विशेषज्ञ',
    walletRefunds: 'वॉलेट और रिफंड',
    supportTickets: 'सहायता टिकट',
    createNewTicket: 'सहायता टिकट दर्ज करें',
    aiRecommendations: 'एआई प्रदाता सिफारिशें',
    aiSlogan: 'रेटिंग, स्थानीय दूरी और ऐतिहासिक प्रदर्शन के आधार पर गतिशील मिलान।',
    yearsExp: 'साल अनुभव',
    ratingCount: 'रेटिंग',
    jobsDone: 'काम पूरे किए',
    priceHr: 'कीमत / घंटा',
    biometricStatus: 'आधार बायोमेट्रिक जांच सफल',
    serviceAreas: 'सेवा क्षेत्र / स्थान',
    certifications: 'बैज और मान्यताएं',
    calendarAvailable: 'उपलब्धता कैलेंडर',
    similarProviders: 'आसपास के समान विशेषज्ञ'
  }
};
