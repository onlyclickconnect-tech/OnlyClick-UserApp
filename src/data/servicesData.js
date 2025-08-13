// Services Data - Only Click User App
// Complete service catalog with all 111 services

export const serviceCategories = [
  {
    id: 'electrical',
    name: 'Electrical',
    icon: 'flash',
    color: '#9C27B0',
    description: 'Complete electrical solutions for your home'
  },
  {
    id: 'plumbing',
    name: 'Plumbing', 
    icon: 'water',
    color: '#2196F3',
    description: 'Professional plumbing services and repairs'
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    icon: 'hammer',
    color: '#4CAF50',
    description: 'Expert carpentry and furniture solutions'
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    icon: 'home',
    color: '#FF9800',
    description: 'Deep cleaning and maintenance services'
  },
  {
    id: 'ac_service',
    name: 'AC Service',
    icon: 'snow',
    color: '#00BCD4',
    description: 'Air conditioning installation and repair'
  },
  {
    id: 'consultation',
    name: 'Consultation',
    icon: 'clipboard',
    color: '#795548',
    description: 'Expert consultation and supervision'
  }
];

// Helper function to generate random prices and data
const generateServiceData = (basePrice) => ({
  price: basePrice,
  originalPrice: Math.round(basePrice * 1.25),
  discount: Math.round(((basePrice * 1.25 - basePrice) / (basePrice * 1.25)) * 100),
  rating: (4.5 + Math.random() * 0.5).toFixed(1),
  reviews: Math.floor(Math.random() * 400) + 50,
  duration: ['30 minutes', '1 hour', '1-2 hours', '2-3 hours', '3-4 hours'][Math.floor(Math.random() * 5)]
});

export const allServices = [
  // ELECTRICAL SERVICES
  {
    serviceId: '001OC',
    category: 'electrical',
    subCategory: 'Wiring & Electrical Setup',
    title: 'New Internal Wiring',
    description: 'Complete internal wiring installation for homes and offices',
    price: 2500,
    originalPrice: 3000,
    discount: 17,
    duration: '3-4 hours',
    rating: 4.8,
    reviews: 342,
    image: {uri: "https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751557197/ChatGPT_Image_Jul_3_2025_08_23_43_AM_p72ebu.png"},
    tags: ['Popular', 'Same Day'],
    includes: ['Quality wires', 'Professional installation', '1 year warranty'],
    professional: 'Certified Electrician'
  },
  {
    serviceId: '002OC',
    category: 'electrical',
    subCategory: 'Wiring & Electrical Setup',
    title: 'New External Wiring',
    description: 'External wiring setup for outdoor areas and garden lighting',
    price: 1800,
    originalPrice: 2200,
    discount: 18,
    duration: '2-3 hours',
    rating: 4.7,
    reviews: 198,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751557197/ChatGPT_Image_Jul_3_2025_08_23_43_AM_p72ebu.png'},
    tags: ['Weather Resistant'],
    includes: ['Weatherproof cables', 'Junction boxes', '6 months warranty'],
    professional: 'Licensed Electrician'
  },
  {
    serviceId: '003OC',
    category: 'electrical',
    subCategory: 'Wiring & Electrical Setup',
    title: 'Submeter Wiring',
    description: 'Individual meter wiring for apartments and buildings',
    price: 1500,
    originalPrice: 1800,
    discount: 17,
    duration: '2 hours',
    rating: 4.6,
    reviews: 156,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751558108/ChatGPT_Image_Jul_3_2025_09_24_54_PM_lq94qx.png'},
    tags: ['Quick Service'],
    includes: ['Meter box', 'Connection cables', 'Testing'],
    professional: 'Certified Electrician'
  },
  {
    serviceId: '004OC',
    category: 'electrical',
    subCategory: 'Switchbox Installation',
    title: 'New Switchbox Installation',
    description: 'Modern switchbox installation with latest safety features',
    price: 800,
    originalPrice: 1000,
    discount: 20,
    duration: '1-2 hours',
    rating: 4.9,
    reviews: 287,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751558129/ChatGPT_Image_Jul_3_2025_09_22_21_AM_uvqeyv.png'},
    tags: ['Same Day', 'Popular'],
    includes: ['Premium switchbox', 'Installation', '1 year warranty'],
    professional: 'Expert Electrician'
  },
  {
    serviceId: '005OC',
    category: 'electrical',
    subCategory: 'Fuse, MCB & Switches',
    title: 'MCB/Fuse Replacement',
    description: 'Quick replacement of faulty MCBs and fuses',
    price: 350,
    originalPrice: 450,
    discount: 22,
    duration: '30 minutes',
    rating: 4.8,
    reviews: 521,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751557281/openart-image_nWsgUrQD_1751513389869_raw_kmtmce.jpg'},
    tags: ['Emergency', 'Quick Fix'],
    includes: ['Quality MCB/Fuse', 'Testing', 'Safety check'],
    professional: 'Certified Technician'
  },
  {
    serviceId: '006OC',
    category: 'electrical',
    subCategory: 'Fuse, MCB & Switches',
    title: 'MCB/Fuse Repair',
    description: 'Professional repair of electrical protection devices',
    price: 250,
    originalPrice: 350,
    discount: 29,
    duration: '45 minutes',
    rating: 4.7,
    reviews: 298,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751557281/openart-image_nWsgUrQD_1751513389869_raw_kmtmce.jpg'},
    tags: ['Cost Effective'],
    includes: ['Diagnosis', 'Repair', 'Testing'],
    professional: 'Expert Technician'
  },
  {
    serviceId: '007OC',
    category: 'electrical',
    subCategory: 'Fuse, MCB & Switches',
    title: 'Switch/Socket Repair',
    description: 'Repair and replacement of switches and electrical sockets',
    price: 200,
    originalPrice: 280,
    discount: 29,
    duration: '30 minutes',
    rating: 4.6,
    reviews: 432,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751558129/ChatGPT_Image_Jul_3_2025_09_22_21_AM_uvqeyv.png'},
    tags: ['Quick Service'],
    includes: ['Quality parts', 'Professional repair', 'Testing'],
    professional: 'Skilled Electrician'
  },
  {
    serviceId: '008OC',
    category: 'electrical',
    subCategory: 'Fuse, MCB & Switches',
    title: 'Plug Replacement',
    description: 'Safe replacement of electrical plugs and connectors',
    price: 150,
    originalPrice: 200,
    discount: 25,
    duration: '15 minutes',
    rating: 4.8,
    reviews: 189,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751557197/ChatGPT_Image_Jul_3_2025_08_23_43_AM_p72ebu.png'},
    tags: ['Quick Fix'],
    includes: ['Quality plug', 'Installation', 'Safety check'],
    professional: 'Certified Technician'
  },
  {
    serviceId: '009OC',
    category: 'electrical',
    subCategory: 'Fuse, MCB & Switches',
    title: 'Switchboard Repair',
    description: 'Complete switchboard diagnosis and repair services',
    price: 600,
    originalPrice: 800,
    discount: 25,
    duration: '1-2 hours',
    rating: 4.7,
    reviews: 267,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751558129/ChatGPT_Image_Jul_3_2025_09_22_21_AM_uvqeyv.png'},
    tags: ['Professional'],
    includes: ['Diagnosis', 'Repair', 'Safety testing'],
    professional: 'Expert Electrician'
  },
  {
    serviceId: '010OC',
    category: 'electrical',
    subCategory: 'Lighting Solutions',
    title: 'Hanging Light/Chandelier Installation',
    description: 'Professional installation of decorative hanging lights',
    price: 800,
    originalPrice: 1000,
    discount: 20,
    duration: '1-2 hours',
    rating: 4.9,
    reviews: 156,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751557197/ChatGPT_Image_Jul_3_2025_08_23_43_AM_p72ebu.png'},
    tags: ['Premium', 'Decorative'],
    includes: ['Ceiling mounting', 'Wiring', 'Testing'],
    professional: 'Lighting Specialist'
  },
  {
    serviceId: '011OC',
    category: 'electrical',
    subCategory: 'Lighting Solutions',
    title: 'Ceiling Light Installation',
    description: 'Installation of ceiling lights and fixtures',
    price: 400,
    originalPrice: 500,
    discount: 20,
    duration: '45 minutes',
    rating: 4.8,
    reviews: 389,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751557197/ChatGPT_Image_Jul_3_2025_08_23_43_AM_p72ebu.png'},
    tags: ['Popular', 'Same Day'],
    includes: ['Mounting', 'Wiring', '6 months warranty'],
    professional: 'Certified Electrician'
  },
  {
    serviceId: '012OC',
    category: 'electrical',
    subCategory: 'Lighting Solutions',
    title: 'Bulb Installation/Replacement',
    description: 'Quick bulb installation and replacement service',
    price: 100,
    originalPrice: 150,
    discount: 33,
    duration: '15 minutes',
    rating: 4.7,
    reviews: 654,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751557197/ChatGPT_Image_Jul_3_2025_08_23_43_AM_p72ebu.png'},
    tags: ['Quick Service', 'Emergency'],
    includes: ['LED bulb', 'Installation', 'Testing'],
    professional: 'Technician'
  },

  // PLUMBING SERVICES
  {
    serviceId: '026OC',
    category: 'plumbing',
    subCategory: 'Toilet Services',
    title: 'Indian Toilet Installation',
    description: 'Complete Indian toilet installation with fittings',
    price: 2500,
    originalPrice: 3000,
    discount: 17,
    duration: '3-4 hours',
    rating: 4.8,
    reviews: 234,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596604/ChatGPT_Image_Jul_3_2025_09_39_44_PM_wmlk17.png'},
    tags: ['Professional', 'Same Day'],
    includes: ['Toilet fixture', 'Plumbing work', '1 year warranty'],
    professional: 'Licensed Plumber'
  },
  {
    serviceId: '027OC',
    category: 'plumbing',
    subCategory: 'Toilet Services',
    title: 'Western Toilet (Floor Mounted)',
    description: 'Modern western toilet installation on floor',
    price: 3200,
    originalPrice: 3800,
    discount: 16,
    duration: '4-5 hours',
    rating: 4.9,
    reviews: 187,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596605/ChatGPT_Image_Jul_3_2025_09_41_55_PM_nkff9i.png'},
    tags: ['Premium', 'Modern'],
    includes: ['Toilet seat', 'Tank', 'Complete installation'],
    professional: 'Expert Plumber'
  },
  {
    serviceId: '028OC',
    category: 'plumbing',
    subCategory: 'Toilet Services',
    title: 'Western Toilet (Wall Mounted)',
    description: 'Space-saving wall mounted toilet installation',
    price: 4500,
    originalPrice: 5200,
    discount: 13,
    duration: '5-6 hours',
    rating: 4.8,
    reviews: 98,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596611/ChatGPT_Image_Jul_3_2025_09_48_47_PM_qakmwj.png'},
    tags: ['Premium', 'Space Saver'],
    includes: ['Wall frame', 'Concealed tank', 'Installation'],
    professional: 'Specialist Plumber'
  },
  {
    serviceId: '033OC',
    category: 'plumbing',
    subCategory: 'Tap & Faucet Services',
    title: 'Basic Tap Repair',
    description: 'Quick repair of leaking and faulty taps',
    price: 250,
    originalPrice: 350,
    discount: 29,
    duration: '30 minutes',
    rating: 4.7,
    reviews: 456,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596604/ChatGPT_Image_Jul_3_2025_10_18_12_PM_xqu38i.png'},
    tags: ['Quick Fix', 'Emergency'],
    includes: ['Diagnosis', 'Repair', 'Testing'],
    professional: 'Skilled Plumber'
  },
  {
    serviceId: '037OC',
    category: 'plumbing',
    subCategory: 'Basin & Sink Services',
    title: 'Wash Basin Leakage Repair',
    description: 'Professional repair of basin leaks and drainage',
    price: 400,
    originalPrice: 550,
    discount: 27,
    duration: '1 hour',
    rating: 4.6,
    reviews: 278,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596604/ChatGPT_Image_Jul_3_2025_10_18_12_PM_xqu38i.png'},
    tags: ['Common Issue'],
    includes: ['Leak detection', 'Sealing', 'Testing'],
    professional: 'Expert Plumber'
  },

  // CARPENTRY SERVICES
  {
    serviceId: '058OC',
    category: 'carpentry',
    subCategory: 'Cupboard & Cabinet Repairs',
    title: 'Cupboard Repair',
    description: 'Professional repair of cupboards and wardrobes',
    price: 800,
    originalPrice: 1000,
    discount: 20,
    duration: '2-3 hours',
    rating: 4.7,
    reviews: 234,
    image: {uri: 'https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596604/ChatGPT_Image_Jul_3_2025_10_18_12_PM_xqu38i.png'},
    tags: ['Popular', 'Furniture'],
    includes: ['Assessment', 'Repair work', '6 months warranty'],
    professional: 'Skilled Carpenter'
  },
  {
    serviceId: '073OC',
    category: 'carpentry',
    subCategory: 'Door Repairs & Installations',
    title: 'Door Repair',
    description: 'Complete door repair and adjustment services',
    price: 600,
    originalPrice: 800,
    discount: 25,
    duration: '1-2 hours',
    rating: 4.8,
    reviews: 345,
    image: {uri: "https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596604/ChatGPT_Image_Jul_3_2025_10_18_12_PM_xqu38i.png"},
    tags: ['Essential', 'Same Day'],
    includes: ['Alignment', 'Hardware check', 'Finishing'],
    professional: 'Expert Carpenter'
  },
  {
    serviceId: '078OC',
    category: 'carpentry',
    subCategory: 'Window & Curtain Installations',
    title: 'Curtain Rod Installation',
    description: 'Professional curtain rod mounting and installation',
    price: 350,
    originalPrice: 450,
    discount: 22,
    duration: '45 minutes',
    rating: 4.6,
    reviews: 289,
    image: {uri: "https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596604/ChatGPT_Image_Jul_3_2025_10_18_12_PM_xqu38i.png"},
    tags: ['Quick Service', 'Home Decor'],
    includes: ['Mounting brackets', 'Installation', 'Adjustment'],
    professional: 'Furniture Specialist'
  },

  // CLEANING SERVICES
  {
    serviceId: '091OC',
    category: 'cleaning',
    subCategory: 'Car Interior Cleaning',
    title: 'Car Interior Cleaning - SUV',
    description: 'Deep interior cleaning for SUV vehicles',
    price: 800,
    originalPrice: 1000,
    discount: 20,
    duration: '2 hours',
    rating: 4.8,
    reviews: 167,
    image: {uri: "https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596604/ChatGPT_Image_Jul_3_2025_10_18_12_PM_xqu38i.png"},
    tags: ['Premium', 'Deep Clean'],
    includes: ['Vacuum cleaning', 'Seat shampooing', 'Dashboard polish'],
    professional: 'Car Care Expert'
  },
  {
    serviceId: '097OC',
    category: 'cleaning',
    subCategory: 'Furniture Cleaning',
    title: 'Sofa Cleaning - 7 Seater',
    description: 'Professional deep cleaning for large sofas',
    price: 1200,
    originalPrice: 1500,
    discount: 20,
    duration: '2-3 hours',
    rating: 4.9,
    reviews: 123,
    image: {uri: "https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596604/ChatGPT_Image_Jul_3_2025_10_18_12_PM_xqu38i.png"},
    tags: ['Deep Clean', 'Premium'],
    includes: ['Stain removal', 'Sanitization', 'Fabric protection'],
    professional: 'Cleaning Specialist'
  },
  {
    serviceId: '099OC',
    category: 'cleaning',
    subCategory: 'Bathroom Cleaning',
    title: 'Bathroom Cleaning - Single',
    description: 'Complete deep cleaning of single bathroom',
    price: 600,
    originalPrice: 750,
    discount: 20,
    duration: '1.5 hours',
    rating: 4.7,
    reviews: 298,
    image: {uri: "https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596604/ChatGPT_Image_Jul_3_2025_10_18_12_PM_xqu38i.png"},
    tags: ['Deep Clean', 'Sanitization'],
    includes: ['Tile cleaning', 'Sanitization', 'Fixture polishing'],
    professional: 'Cleaning Expert'
  },
  {
    serviceId: '102OC',
    category: 'cleaning',
    subCategory: 'General Services',
    title: 'Deep Cleaning',
    description: 'Comprehensive deep cleaning of entire home',
    price: 2500,
    originalPrice: 3200,
    discount: 22,
    duration: '4-6 hours',
    rating: 4.9,
    reviews: 189,
    image: {uri: "https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596604/ChatGPT_Image_Jul_3_2025_10_18_12_PM_xqu38i.png"},
    tags: ['Popular', 'Complete Clean'],
    includes: ['All rooms', 'Kitchen', 'Bathrooms', 'Balcony'],
    professional: 'Cleaning Team'
  },

  // AC SERVICES
  {
    serviceId: '104OC',
    category: 'ac_service',
    subCategory: 'Installation & Uninstallation',
    title: 'AC Installation',
    description: 'Professional air conditioner installation service',
    price: 1500,
    originalPrice: 2000,
    discount: 25,
    duration: '2-3 hours',
    rating: 4.8,
    reviews: 345,
    image: {uri: "https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596604/ChatGPT_Image_Jul_3_2025_10_18_12_PM_xqu38i.png"},
    tags: ['Professional', 'Same Day'],
    includes: ['Mounting', 'Piping', 'Gas charging', '1 year warranty'],
    professional: 'AC Technician'
  },
  {
    serviceId: '108OC',
    category: 'ac_service',
    subCategory: 'Gas & Leakage Services',
    title: 'AC Gas Refill',
    description: 'Professional AC gas refilling and pressure testing',
    price: 2200,
    originalPrice: 2800,
    discount: 21,
    duration: '1-2 hours',
    rating: 4.7,
    reviews: 267,
    image: {uri: "https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596604/ChatGPT_Image_Jul_3_2025_10_18_12_PM_xqu38i.png"},
    tags: ['Essential', 'Popular'],
    includes: ['Gas refill', 'Pressure test', 'Performance check'],
    professional: 'AC Specialist'
  },
  {
    serviceId: '110OC',
    category: 'ac_service',
    subCategory: 'PCB Board Services',
    title: 'PCB Board Ordinary',
    description: 'Repair and replacement of AC control boards',
    price: 1800,
    originalPrice: 2300,
    discount: 22,
    duration: '1-2 hours',
    rating: 4.6,
    reviews: 134,
    image: {uri: "https://res.cloudinary.com/dsjcgs6nu/image/upload/v1751596604/ChatGPT_Image_Jul_3_2025_10_18_12_PM_xqu38i.png"},
    tags: ['Technical', 'Repair'],
    includes: ['Diagnosis', 'Board repair', 'Testing'],
    professional: 'Electronics Expert'
  }
];

// Helper functions
export const getServicesByCategory = (categoryId) => {
  return allServices.filter(service => service.category === categoryId);
};

export const getServiceById = (serviceId) => {
  return allServices.find(service => service.serviceId === serviceId);
};

export const getPopularServices = () => {
  return allServices.filter(service => service.tags.includes('Popular')).slice(0, 6);
};

export const searchServices = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return allServices.filter(service => 
    service.title.toLowerCase().includes(lowercaseQuery) ||
    service.description.toLowerCase().includes(lowercaseQuery) ||
    service.subCategory.toLowerCase().includes(lowercaseQuery)
  );
};

export default {
  serviceCategories,
  allServices,
  getServicesByCategory,
  getServiceById,
  getPopularServices,
  searchServices
};
