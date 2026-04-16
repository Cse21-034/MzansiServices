// Ad placements and configurations
export interface AdConfig {
  id: string;
  title: string;
  image: string;
  link: string;
  alt: string;
  category?: string;
  type: 'banner' | 'sidebar' | 'inline' | 'sticky';
  priority?: number;
}

// Use actual image paths from your public folder
export const ADS_LIST: AdConfig[] = [
  {
    id: 'ad-1',
    title: 'Premium Business Services',
    image: '/images/ad.png',
    link: 'https://example-advertiser-1.com',
    alt: 'Premium Business Services',
    type: 'banner',
    priority: 1,
  },
  {
    id: 'ad-2',
    title: 'Local Business Directory Pro',
    image: '/images/ads2.png',
    link: 'https://example-advertiser-2.com',
    alt: 'Local Business Directory Pro',
    type: 'banner',
    priority: 2,
  },
  {
    id: 'ad-3',
    title: 'Mzansi Business Network',
    image: '/images/ads3.jpg',
    link: 'https://example-advertiser-3.com',
    alt: 'Mzansi Business Network',
    type: 'banner',
    priority: 3,
  },
  {
    id: 'ad-sidebar-1',
    title: 'Digital Marketing Solutions',
    image: '/images/ad.png',
    link: 'https://example-advertiser-4.com',
    alt: 'Digital Marketing Solutions',
    type: 'sidebar',
    priority: 1,
  },
  {
    id: 'ad-sidebar-2',
    title: 'Business Consulting',
    image: '/images/ads2.png',
    link: 'https://example-advertiser-5.com',
    alt: 'Business Consulting',
    type: 'sidebar',
    priority: 2,
  },
  {
    id: 'ad-inline-1',
    title: 'Website Development',
    image: '/images/wedevelopment.jpg',
    link: 'https://www.namibiaservices.com/advertise',
    alt: 'Website Development',
    type: 'inline',
    priority: 1,
  },
];

export const getAdsByType = (type: AdConfig['type']): AdConfig[] => {
  return ADS_LIST.filter(ad => ad.type === type).sort((a, b) => (a.priority || 0) - (b.priority || 0));
};

export const getRandomAd = (type?: AdConfig['type']): AdConfig | null => {
  const ads = type ? getAdsByType(type) : ADS_LIST;
  return ads.length > 0 ? ads[Math.floor(Math.random() * ads.length)] : null;
};
