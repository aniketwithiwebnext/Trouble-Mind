export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: 'Hoodies' | 'T-Shirts' | 'Pants' | 'Outerwear' | 'Accessories';
  colors: string[];
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewsCount: number;
  details: string[];
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
  location: string;
}

export interface DiscountCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
}
