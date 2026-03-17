export interface CategoryType {
  name: string;
  subcategories: string[];
  image: string; // Add image property
}

export const categories: CategoryType[] = [
  {
    name: 'Banking & Financial Services',
    image: '/images/categories/bank.jpg',
    subcategories: [
      'Commercial Banks',
      'Microfinance Institutions',
      'Insurance Companies',
      'Investment Services',
      'Financial Advisory',
      'Asset Management',
      'Forex Bureaus',
      'Mobile Money Services',
      'Credit Unions',
      'Stock Brokerage',
      'Micro-lenders',
      'Investment Advisory'
    ]
  },
  {
    name: 'Tourism & Hospitality',
    image: '/images/categories/tourism.jpg',
    subcategories: [
      'Safari Companies',
      'Tour Operators',
      'Travel Agencies',
      'Hotels & Lodges',
      'Guest Houses',
      'Camping Sites',
      'Adventure Tourism',
      'Cultural Tours',
      'Eco Tourism',
      'Car Rental Services',
      'Tour Guides',
      'Travel Insurance',
      'Guesthouses'
    ]
  },
  {
    name: 'Agriculture & Farming',
    image: '/images/categories/agriculture.jpg',
    subcategories: [
      'Crop Farming',
      'Livestock Farming',
      'Poultry Farming',
      'Agricultural Suppliers',
      'Farming Equipment',
      'Veterinary Services',
      'Agro Processing',
      'Seed Suppliers',
      'Fertilizer Suppliers',
      'Irrigation Services',
      'Agricultural Consulting',
      'Produce Exporters',
      'Horticulture',
      'Agro-processing'
    ]
  },
  {
    name: 'Information Technology',
    image: '/images/categories/tech.jpg',
    subcategories: [
      'Software Development',
      'IT Consulting',
      'Hardware Suppliers',
      'Network Solutions',
      'Cybersecurity Services',
      'Web Development',
      'Mobile App Development',
      'Data Recovery',
      'IT Support Services',
      'Cloud Services',
      'Digital Marketing',
      'E-commerce Solutions',
      'Web and App Development'
    ]
  },
  {
    name: 'Healthcare Services',
    image: '/images/categories/health.jpg',
    subcategories: [
      'Hospitals',
      'Medical Clinics',
      'Dental Clinics',
      'Optical Services',
      'Pharmacies',
      'Laboratory Services',
      'Specialist Doctors',
      'Traditional Medicine',
      'Medical Equipment',
      'Ambulance Services',
      'Mental Health Services',
      'Physiotherapy',
      'Clinics & Private Practices',
      'Fitness Centers',
      'Traditional Healing Services'
    ]
  },
  {
    name: 'Construction & Real Estate',
    image: '/images/categories/construction.jpg',
    subcategories: [
      'Civil Engineering',
      'Architectural Services',
      'Building Contractors',
      'Electrical Contractors',
      'Plumbing Services',
      'Quantity Surveyors',
      'Construction Materials',
      'Interior Design',
      'Land Surveying',
      'Project Management',
      'Mechanical Engineering',
      'Structural Engineering',
      'Civil Works',
      'Property Development',
      'Quantity Surveying',
      'Plumbing & Electrical Services',
      'Property Agencies',
      'Property Management',
      'Real Estate Development',
      'Commercial Property',
      'Residential Property',
      'Property Valuation',
      'Rental Services',
      'Land Brokers',
      'Estate Planning',
      'Mortgage Services',
      'Property Insurance',
      'Facility Management'
    ]
  },
  {
    name: 'Education & Training',
    image: '/images/categories/education.jpg',
    subcategories: [
      'Schools & Colleges',
      'Universities',
      'Vocational Training',
      'Driving Schools',
      'Language Schools',
      'Professional Training',
      'Early Childhood Education',
      'Special Education',
      'Tutoring Services',
      'Aviation Training',
      'Computer Training',
      'Business Schools',
      'Private Schools',
      'Vocational Training Centers',
      'Skills Development Programs'
    ]
  },
  {
    name: 'Manufacturing & Industry',
    image: '/images/categories/manufacturing.jpg',
    subcategories: [
      'Food Processing',
      'Textile Manufacturing',
      'Metal Fabrication',
      'Plastic Manufacturing',
      'Furniture Manufacturing',
      'Chemical Production',
      'Beverage Production',
      'Printing Services',
      'Packaging Services',
      'Automotive Assembly',
      'Industrial Equipment',
      'Quality Control Services',
      'Furniture Making',
      'Food and Beverage Processing',
      'Brick Making',
      'Textile Production'
    ]
  },
  {
    name: 'Transport & Logistics',
    image: '/images/categories/transport and logistics.jpg',
    subcategories: [
      'Freight Services',
      'Courier Services',
      'Transport Companies',
      'Logistics Solutions',
      'Warehousing',
      'Clearing & Forwarding',
      'Taxi Services',
      'Bus Services',
      'Air Cargo',
      'Marine Transport',
      'Fleet Management',
      'Supply Chain Services',
      'Trucking Services',
      'Public Transport',
      'Moving Companies'
    ]
  },
  {
    name: 'Retail & Wholesale',
    image: '/images/categories/retail & wholesale.png',
    subcategories: [
      'Supermarkets',
      'Clothing Stores',
      'Electronics Retail',
      'Furniture Stores',
      'General Dealers',
      'Building Materials',
      'Automotive Parts',
      'Book Stores',
      'Jewelry Stores',
      'Sporting Goods',
      'Pharmaceutical Retail',
      'Convenience Stores',
      'Hardware Stores'
    ]
  },
  {
    name: 'Food & Beverage',
    image: '/images/categories/food and beverages.jpg',
    subcategories: [
      'Restaurants',
      'Fast Food Outlets',
      'Coffee Shops',
      'Bars & Pubs',
      'Bakeries',
      'Catering Services',
      'Food Delivery',
      'Butcheries',
      'Vegetable Markets',
      'Food Wholesalers',
      'Beverage Distributors',
      'Specialty Foods'
    ]
  },
  {
    name: 'Professional Services',
    image: '/images/categories/professional services.png',
    subcategories: [
      'Legal Services',
      'Accounting Firms',
      'Business Consulting',
      'Marketing Agencies',
      'Human Resources',
      'Public Relations',
      'Management Consulting',
      'Audit Services',
      'Tax Consulting',
      'Recruitment Agencies',
      'Market Research',
      'Business Development',
      'Legal Firms',
      'Accounting and Auditing',
      'Consulting',
      'Architecture & Engineering'
    ]
  },
  {
    name: 'Automotive Services',
    image: '/images/categories/automotive services.png',
    subcategories: [
      'Car Dealerships',
      'Auto Repair Shops',
      'Spare Parts',
      'Car Wash Services',
      'Tire Services',
      'Auto Electrical',
      'Panel Beating',
      'Towing Services',
      'Vehicle Inspection',
      'Motorcycle Dealers',
      'Heavy Equipment Sales',
      'Fleet Services',
      'Car Mechanics'
    ]
  },
  {
    name: 'Creative & Media',
    image: '/images/categories/creative and media.jpg',
    subcategories: [
      'Advertising Agencies',
      'Graphic Design',
      'Photography Services',
      'Video Production',
      'Print Media',
      'Radio Stations',
      'TV Production',
      'Event Planning',
      'Public Relations',
      'Content Creation',
      'Social Media Management',
      'Branding Services'
    ]
  },
  {
    name: 'Energy & Utilities',
    image: '/images/categories/energy and utilities.png',
    subcategories: [
      'Solar Energy',
      'Electrical Contractors',
      'Water Treatment',
      'Renewable Energy',
      'Power Generation',
      'Fuel Suppliers',
      'Gas Suppliers',
      'Energy Consulting',
      'Utility Management',
      'Environmental Services',
      'Waste Management',
      'Water Drilling'
    ]
  },
  {
    name: 'Security Services',
    image: '/images/categories/security services.png',
    subcategories: [
      'Security Companies',
      'Alarm Systems',
      'CCTV Installation',
      'Private Investigation',
      'Security Equipment',
      'Guard Services',
      'Cash-in-Transit',
      'Cyber Security',
      'Access Control Systems',
      'Risk Assessment',
      'Security Training',
      'Emergency Response'
    ]
  },
  {
    name: 'Beauty & Personal Care',
    image: '/images/categories/beauty and personal care.jpg',
    subcategories: [
      'Hair Salons',
      'Beauty Spas',
      'Nail Salons',
      'Barber Shops',
      'Cosmetics Retail',
      'Skincare Clinics',
      'Massage Therapy',
      'Makeup Artists',
      'Perfume Stores',
      'Wellness Centers',
      'Aromatherapy',
      'Personal Grooming',
      'Salons & Barbershops',
      'Spa & Massage Therapy',
      'Nail Techs & Makeup Artists'
    ]
  },
  {
    name: 'Events & Entertainment',
    image: '/images/categories/events and entertainment.png',
    subcategories: [
      'Cinemas & Theaters',
      'Sports Facilities',
      'Gyms & Fitness Centers',
      'Music Venues',
      'Art Galleries',
      'Museums',
      'Amusement Parks',
      'Event Venues',
      'Sports Clubs',
      'Recreation Centers',
      'Game Parks',
      'Cultural Centers',
      'Catering Services',
      'Event Planning',
      'Sound & Stage Equipment Hire',
      'Mobile Toilets'
    ]
  },
  {
    name: 'Repairs & Maintenance',
    image: '/images/categories/repairs and maintenance.jpg',
    subcategories: [
      'Car Mechanics',
      'Appliance Repair',
      'HVAC Services',
      'Electrical Repairs',
      'Plumbing Repairs',
      'Electronics Repair',
      'Computer Repair',
      'Phone Repair',
      'Equipment Maintenance',
      'Building Maintenance',
      'Generator Repair',
      'Air Conditioning Repair'
    ]
  },
  {
    name: 'Telecommunications',
    image: '/images/categories/telecomms.jpg',
    subcategories: [
      'Mobile Network Operators',
      'Internet Service Providers',
      'Telecom Equipment',
      'VOIP Services',
      'Satellite Services',
      'Data Services',
      'Telecom Consulting',
      'Network Installation',
      'Mobile Money',
      'Call Centers',
      'Telecom Infrastructure',
      'Broadband Services'
    ]
  },
  {
    name: 'Mining & Resources',
    image: '/images/categories/mining img.png',
    subcategories: [
      'Mining Companies',
      'Mineral Exploration',
      'Mining Equipment',
      'Geological Services',
      'Mining Consulting',
      'Safety Equipment',
      'Environmental Management',
      'Mining Supplies',
      'Resource Management',
      'Extraction Services',
      'Mineral Processing',
      'Mine Rehabilitation'
    ]
  },
  {
    name: 'Aviation & Aerospace',
    image: '/images/categories/aviation.jpg',
    subcategories: [
      'Airlines',
      'Aviation Training',
      'Aircraft Maintenance',
      'Airport Services',
      'Aviation Consulting',
      'Flight Schools',
      'Aircraft Charter',
      'Aviation Security',
      'Air Cargo Services',
      'Aerospace Engineering',
      'Pilot Training',
      'Aviation Equipment'
    ]
  },
  {
    name: 'Marine Services',
    image: '/images/categories/marine services.png',
    subcategories: [
      'Marine Transport',
      'Boat Services',
      'Marine Engineering',
      'Fishing Companies',
      'Marine Equipment',
      'Port Services',
      'Marine Conservation',
      'Water Sports',
      'Marine Tourism',
      'Boat Repair',
      'Marine Safety',
      'Diving Services'
    ]
  },
  {
    name: 'Non-Profit & Community',
    image: '/images/categories/non profit.jpg',
    subcategories: [
      'Charitable Organizations',
      'Community Development',
      'Youth Services',
      'Women Empowerment',
      'Environmental NGOs',
      'Health NGOs',
      'Educational NGOs',
      'Religious Organizations',
      'Social Services',
      'Disability Services',
      'Animal Welfare',
      'Cultural Organizations'
    ]
  }
];
