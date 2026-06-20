import { Product } from './types';
// @ts-ignore
import heavyKnitBeanie from './assets/images/heavy_knit_beanie_1781992642605.jpg';


export const CATEGORIES = ['All', 'Hoodies', 'T-Shirts', 'Pants', 'Outerwear', 'Accessories'] as const;

export const PRODUCTS: Product[] = [
  {
    id: 'tm-01',
    name: 'RESILIENCE heavy hoodie',
    price: 85,
    description: 'Ultra-heavyweight 450GSM organic cotton hoodie featuring distressed ribbing, drop shoulder fit, and high-density matte black TROUBLED MIND embroidery. Built to endure.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'Hoodies',
    colors: ['Onyx Black', 'Vintage Charcoal', 'Frozen Silver'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 142,
    details: [
      '100% Organic Heavyweight Cotton',
      'Pre-shrunk & Silicone washed for superior comfort',
      'Hand-distressed hems and cuffs',
      'Made in Antioch, TN'
    ]
  },
  {
    id: 'tm-02',
    name: 'SELF-EXPRESSION vintage tee',
    price: 45,
    description: 'Premium 280GSM heavy Jersey relaxed-cut tee. Acid washed with cracked silicone graphics highlighting resilience and modern Tennessee street culture.',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'T-Shirts',
    colors: ['Vintage Carbon', 'Acid White'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 96,
    details: [
      '100% Ring Spun Combed Cotton',
      'Drop-shoulder boxy shape',
      'High-durability plastisol print',
      'Custom Troubled Mind collar branding'
    ]
  },
  {
    id: 'tm-03',
    name: 'CHAOS CONTROL cargo trousers',
    price: 110,
    description: 'Tactical-inspired utility cargopants with adjustable silver metal buckles, extra deep bellows pockets, and a flexible relaxed silhouette that tapers neatly at the ankle.',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'Pants',
    colors: ['Asphalt Charcoal', 'Midnight Olive'],
    sizes: ['30', '32', '34', '36'],
    inStock: true,
    featured: false,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.7,
    reviewsCount: 54,
    details: [
      'Heavy-duty tactical weave ripstop',
      'Reinforced double-knee panels',
      'Custom matte metal hardware',
      'Drawstring ankle adjusters'
    ]
  },
  {
    id: 'tm-04',
    name: 'INDIVIDUALITY acid denim',
    price: 140,
    description: 'Raw selvage acid-wash denim jacket featuring hand-shredded detailing, Custom silver Troubled Mind buttons, and detailed internal lining reminding you to stand out.',
    images: [
      'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'Outerwear',
    colors: ['Acid Black', 'Vintage Bleach'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: true,
    isNewArrival: false,
    isBestSeller: false,
    rating: 4.9,
    reviewsCount: 38,
    details: [
      '14oz Rigid Denim',
      'Premium Custom engraved buttons',
      'Concealed double inner pockets',
      'Anti-conformist quote print inside back'
    ]
  },
  {
    id: 'tm-05',
    name: 'TROUBLED SOUL heavy knit beanie',
    price: 30,
    description: 'Double-layered premium acrylic ribbed knit beanie, detailed with our signature distressed steel-plate emblem centered on the folded cuff.',
    images: [
      heavyKnitBeanie,
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'Accessories',
    colors: ['Void Black', 'Heather Cobalt', 'Silver Concrete'],
    sizes: ['One Size'],
    inStock: true,
    featured: false,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 112,
    details: [
      '100% Soft-touch stretch acrylic',
      'Distressed metallic signature plate',
      'Perfect comfort for urban nights',
      'High insulation rating'
    ]
  },
  {
    id: 'tm-06',
    name: 'VOID GRAPHICS heavy crewneck',
    price: 75,
    description: 'Washed French Terry cotton crewneck featuring minimalist typography details on the front with a large symbolic high-definition graphic on the back representing resilient mindset.',
    images: [
      'https://images.unsplash.com/photo-1611601679655-7c8bc197f0c6?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'Hoodies',
    colors: ['Soot Black', 'Pumice Grey'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: false,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.6,
    reviewsCount: 42,
    details: [
      '380GSM French Terry',
      'Exposed triple stitching patterns',
      'Custom breathable mock-collar neck',
      'Designed in Antioch, Tennessee'
    ]
  },
  {
    id: 'tm-07',
    name: 'METROPOLIS liquid puffer',
    price: 195,
    description: 'Water-repellent technical shell down jacket with a metallic chrome finish. Embellished with custom zip pulls, fleece-lined pockets, and deep internal utility grids.',
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'Outerwear',
    colors: ['Liquid Chrome', 'Obscure Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 88,
    details: [
      'Metallic weather-proof synthetic weave',
      '90% Eco-down insulating filling',
      'Internal detachable straps for shoulder carrying',
      'Secure zip inner media slots'
    ]
  },
  {
    id: 'tm-08',
    name: 'INNER FORCE heavy leather jacket',
    price: 250,
    description: 'Limited-edition fully grain matte-embossed biker streetwear leather jacket. Heavily detailed with asymmetrical silver zippers, quilted thermal shoulders, and high density collar hardware.',
    images: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'Outerwear',
    colors: ['Matte Noir', 'Worn Gunmetal'],
    sizes: ['M', 'L', 'XL'],
    inStock: true,
    featured: true,
    isNewArrival: false,
    isBestSeller: false,
    rating: 5.0,
    reviewsCount: 23,
    details: [
      '100% Genuine grain sheep leather',
      'Heavy industrial grade YKK steel zippers',
      'Red satin luxury inner lining',
      'Lifetime custom repair warranty'
    ]
  }
];

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Xavier K.',
    role: 'Verified Buyer',
    text: "Troubled Mind's garments are bulletproof. The heavy hoodie weight is incredible and fits perfectly oversized without losing shape. Legit modern streetwear.",
    rating: 5,
    location: 'Nashville, TN'
  },
  {
    id: '2',
    name: 'Malik J.',
    role: 'Style Consultant',
    text: "I love the subtle rebellious elements of their design. Hand-distressing looks super genuine. Ordering was clean and fast. Shipping from Antioch Tennessee arrived next day!",
    rating: 5,
    location: 'Atlanta, GA'
  },
  {
    id: '3',
    name: 'Elena R.',
    role: 'Independent Designer',
    text: "The details on the Liquid Puffer are wild. It feels ultra-futuristic and stays warm even in strong Nashville wind. My absolute go-to brand right now.",
    rating: 5,
    location: 'Chicago, IL'
  }
];

export const FAQS = [
  {
    q: 'Where are you guys located, and can I do pickups?',
    a: 'We are based out of Antioch, Tennessee, USA (Phone: 615-715-2900). Currently, we operate exclusively online with lightning-fast shipping. Direct local pickups are unavailable, but our Nashville-midTN orders usually arrive in just 1-2 days.'
  },
  {
    q: 'How heavy is the hoodie fabric?',
    a: 'Our signature hoodies are built using 450GSM organic loopback cotton, making them among the heaviest streetwear hoodies in the market today. They offer a highly structured boxy silhouette.'
  },
  {
    q: 'Do you offer returns or size exchanges?',
    a: 'We sure do. If your distressed denim or heavy knits do not fit exactly the way you enjoy, you can file a return or size swap request within 30 days of standard receipt.'
  },
  {
    q: 'How can I reach customer support?',
    a: 'We are available daily. You can write to us directly at waniisaggrey@gmail.com or give us a ring at 615-715-2900.'
  }
];

export const CONTACT_INFO = {
  brand: 'Troubled Mind Apparel',
  domain: 'troubledmind.us',
  phone: '615-715-2900',
  email: 'waniisaggrey@gmail.com',
  address: 'Antioch, Tennessee',
  established: 2026
};

export const DISCOUNT_CODES = [
  { code: 'MIND20', discountType: 'percentage', value: 20 },
  { code: 'TROUBLE15', discountType: 'percentage', value: 15 },
  { code: 'TENNESSEE10', discountType: 'fixed', value: 10 }
];
