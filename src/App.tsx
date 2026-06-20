import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Star, Mail, Phone, MapPin, ArrowRight, ArrowUp, Flame, 
  Heart, Sparkles, Filter, CheckCircle2, ShieldCheck, RefreshCw, Layers, HelpCircle
} from 'lucide-react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutSection from './components/CheckoutSection';
import Chatbot from './components/Chatbot';
import ThreeCanvas from './components/ThreeCanvas';
// @ts-ignore
import streetwearAccessories from './assets/images/streetwear_accessories_1781992509928.jpg';
import { Product, CartItem } from './types';
import { PRODUCTS, TESTIMONIALS, FAQS, CONTACT_INFO, DISCOUNT_CODES } from './data';

export default function App() {
  // Views state
  const [currentView, setView] = useState<string>('home');
  
  // Shopping cart persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const cached = localStorage.getItem('tm_cart_items');
    return cached ? JSON.parse(cached) : [];
  });

  // Wishlisted apparel
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const cached = localStorage.getItem('tm_wishlist_items');
    return cached ? JSON.parse(cached) : [];
  });

  // Filters & Custom Queries
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Currently inspected product
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Cart drawer open/close
  const [cartOpen, setCartOpen] = useState(false);

  // Active Completed Order Receipt
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Scroll to top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Contact Page Form
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('tm_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('tm_wishlist_items', JSON.stringify(wishlist));
  }, [wishlist]);

  // Handle scroll trigger
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  // Filter products by search and category selection
  const filteredProducts = PRODUCTS.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default featured static index
  });

  // Cart helpers
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const cloned = [...prevItems];
      const matchIdx = cloned.findIndex(
        (ci) => 
          ci.product.id === item.product.id && 
          ci.selectedColor === item.selectedColor && 
          ci.selectedSize === item.selectedSize
      );

      if (matchIdx !== -1) {
        cloned[matchIdx].quantity += item.quantity;
      } else {
        cloned.push(item);
      }
      return cloned;
    });
  };

  const handleUpdateCartQuantity = (idx: number, change: number) => {
    setCartItems((prevItems) => {
      const cloned = [...prevItems];
      if (cloned[idx]) {
        cloned[idx].quantity = Math.max(1, cloned[idx].quantity + change);
      }
      return cloned;
    });
  };

  const handleRemoveCartItem = (idx: number) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== idx));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exist = prev.find(p => p.id === product.id);
      if (exist) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleNavigateView = (view: string) => {
    setView(view);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] font-sans selection:bg-white selection:text-black">
      
      {/* 1. Header Navigation */}
      <Navbar
        currentView={currentView}
        setView={setView}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        openCart={() => setCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (currentView !== 'shop') setView('shop');
        }}
      />

      {/* 2. Main Sections based on active view */}
      <main className="pb-16 min-h-[70vh]">
        
        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <div className="space-y-16 animate-fade-in">
            
            {/* HERO MODULE SECTION */}
            <section className="relative min-h-[78vh] flex items-center bg-[#0a0a0a] border-b border-white/5 overflow-hidden">
              <div className="max-w-7xl mx-auto px-10 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full z-10 text-left">
                
                {/* Visual Copy */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 mb-4 flex items-center">
                    <span className="h-[1px] w-8 bg-zinc-650 mr-4"></span> EST. 2024 / ANTIOCH, TN
                  </div>
                  <h1 className="text-5xl sm:text-6xl xl:text-7xl font-bold leading-[0.95] tracking-tighter uppercase text-white">
                    RESILIENCE<br/>
                    <span className="text-zinc-500">IS THE ONLY</span><br/>
                    CURRENCY.
                  </h1>
                  <p className="text-sm text-zinc-400 max-w-lg leading-relaxed font-light tracking-wide italic">
                    A collection born from urban culture, designed for the dreamers and the creators navigating the modern chaos of our times. Styled with uncompromised precision in Antioch, Tennessee.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      id="hero-shop-all-btn"
                      onClick={() => handleNavigateView('shop')}
                      className="px-10 py-4 border border-zinc-100 text-zinc-100 hover:bg-zinc-100 hover:text-black hover:border-transparent transition-all text-xs uppercase tracking-widest cursor-pointer font-bold"
                    >
                      Shop the drop
                    </button>
                    
                    <button
                      id="hero-join-exclusive-btn"
                      onClick={() => handleNavigateView('about')}
                      className="px-10 py-4 border border-white/5 text-zinc-400 hover:text-white hover:border-white/30 transition-all text-xs uppercase tracking-widest cursor-pointer font-medium"
                    >
                      OUR MANIFESTO
                    </button>
                  </div>

                  {/* Trust markers */}
                  <div className="pt-6 border-t border-white/5 grid grid-cols-3 gap-4 text-left">
                    <div>
                      <div className="font-mono text-base font-semibold text-zinc-100">450GSM</div>
                      <div className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest">HEAVYWEIGHT ORGANIC</div>
                    </div>
                    <div>
                      <div className="font-mono text-base font-semibold text-zinc-100">615 TN</div>
                      <div className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest">ANTIOCH STATEWAY</div>
                    </div>
                    <div>
                      <div className="font-mono text-base font-semibold text-zinc-100">FREE</div>
                      <div className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest">TRANSIT OVER $150</div>
                    </div>
                  </div>
                </div>

                {/* 3D Interactive Column representing Troubled Mind geometric wireframes */}
                <div className="lg:col-span-5 h-[380px] sm:h-[450px] relative pointer-events-auto">
                  <div className="absolute inset-0 bg-radial-at-c from-zinc-850/5 via-transparent to-transparent pointer-events-none rounded-full blur-2xl z-0" />
                  <div className="relative z-10 w-full h-full bg-gradient-to-b from-[#0d0d0d] to-[#070707] rounded-none border border-white/5 shadow-2xl flex items-center justify-center overflow-hidden">
                    <ThreeCanvas />
                  </div>
                </div>
              </div>
            </section>

            {/* CURATED CATEGORY QUICK LINK BOXES */}
            <section className="max-w-7xl mx-auto px-10 text-left">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-8">
                <div>
                  <h2 className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em] font-bold">CURATED DEPARTMENTS</h2>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider mt-1.5">THEMED CATEGORIES</h3>
                </div>
                <button
                  onClick={() => handleNavigateView('shop')}
                  className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>ALL COLLECTIONS</span> <ArrowRight size={11} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Hoodies', count: '450GSM', bgUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400' },
                  { name: 'T-Shirts', count: '280GSM', bgUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=400' },
                  { name: 'Outerwear', count: 'TECH INSULATED', bgUrl: 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&q=80&w=400' },
                  { name: 'Accessories', count: 'RIBBED KNIT & HARDWARE', bgUrl: streetwearAccessories }
                ].map((cat, idx) => (
                  <div
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      handleNavigateView('shop');
                    }}
                    className="relative pt-[125%] rounded-none overflow-hidden group cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-300"
                  >
                    <img
                      src={cat.bgUrl}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-103 opacity-40 group-hover:opacity-75 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-5 group-hover:from-black/90 group-hover:via-black/50 transition-all duration-300">
                      {/* Technical department prefix labels on hover */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="font-mono text-[8px] text-white/40 tracking-widest">[ DEP_0{idx + 1} ]</span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500 group-hover:text-white transition-colors uppercase tracking-widest">{cat.count}</span>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider mt-1 flex items-center justify-between">
                        <span>{cat.name}</span>
                        <ArrowRight size={11} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-zinc-400" />
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* NEW ARRIVALS & COVETED STREETWEAR METRICS */}
            <section className="max-w-7xl mx-auto px-10 text-left">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em] font-bold">FRESH EMBOSS</h2>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider mt-1.5">NEW ARRIVALS</h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    handleNavigateView('shop');
                  }}
                  className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>VISIT SHOP</span> <ArrowRight size={11} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {PRODUCTS.filter(p => p.isNewArrival).slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={setActiveProduct}
                  />
                ))}
              </div>
            </section>

            {/* BRAND MANIFESTO SECTION WITH COMPACT VIDEO STYLING & TEXT */}
            <section className="max-w-7xl mx-auto px-10 py-6">
              <div className="bg-gradient-to-b from-[#0c0c0c] to-[#070707] border border-white/5 rounded-none overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center text-left">
                {/* Visual Video Loop placeholder or elegant photography background */}
                <div className="lg:col-span-5 h-[350px] lg:h-full relative overflow-hidden bg-zinc-900/10 min-h-[300px]">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600"
                    alt="Street apparel video display"
                    className="absolute inset-0 w-full h-full object-cover opacity-45 filter grayscale hover:opacity-60 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 flex items-center justify-center p-6 text-center">
                    <div className="space-y-2 bg-black/60 backdrop-blur-xs p-4 rounded-none border border-white/5">
                      <h4 className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">WANIIS AGGREY STUDIO</h4>
                      <p className="text-[11px] text-zinc-400 italic">"Resilience is not silent. It wears its trials out in the open."</p>
                    </div>
                  </div>
                </div>

                {/* Narrative Info */}
                <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 space-y-6">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em] font-bold">THE CORE PHILOSOPHY</span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider leading-tight">
                    TROUBLED MINDS GENERATE POWERFUL VISIONS
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    We do not believe in standard clothing. We believe apparel is your physical armour. The modern urban crowd has struggles, ideas, and friction. Troubled Mind gives a creative voice to resilience, modern self-expression, and uncompromised streetwear styling.
                  </p>
                  
                  <div className="space-y-3 font-mono text-[10px] text-zinc-500">
                    <div className="flex gap-2">
                      <span className="text-zinc-450">✓</span>
                      <span>Heavy vintage washes mimicking wear and battle-scars.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-zinc-450">✓</span>
                      <span>Thick heavy-grain threads designed on high 280-450GSM blanks.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-zinc-450">✓</span>
                      <span>Proudly crafted and managed out of Antioch, Tennessee.</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleNavigateView('about')}
                      className="bg-transparent border border-white/10 hover:border-white text-zinc-100 hover:bg-zinc-100 hover:text-black transition-all text-xs uppercase tracking-widest px-8 py-3.5 font-bold rounded-none cursor-pointer"
                    >
                      LEARN SECURED ARCHITECTURE
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* EXPANDED PROMO HERO SLIDER CARD */}
            <section className="max-w-7xl mx-auto px-10">
              <div className="bg-gradient-to-r from-[#0d0d0d] via-[#080808] to-black border border-white/5 rounded-none p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-left">
                <div className="space-y-3 max-w-lg">
                  <span className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase bg-[#121212]/90 px-2.5 py-1.5 border border-white/5">
                    ANTIOCH SUPPORTER DISCOUNT
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
                    GET 20% OFF YOUR EXCLUSIVE HOODIE APPAREL
                  </h3>
                  <p className="text-xs text-zinc-455 leading-relaxed font-light">
                    For a limited duration, claim introductory pricing on our oversized blanks and knit beanies. Just unlock with our signature code at checkout.
                  </p>
                </div>
                
                <div className="mt-6 md:mt-0 bg-black/60 border border-white/5 backdrop-blur-md rounded-none p-6 text-center space-y-4 flex-shrink-0 min-w-[240px]">
                  <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">CLAIM THE VOUCHER</div>
                  <div className="text-lg font-mono font-bold text-[#e5e5e5] tracking-[0.2em] border border-dashed border-white/10 bg-[#070707] p-2.5">
                    MIND20
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('Hoodies');
                      handleNavigateView('shop');
                    }}
                    className="w-full bg-transparent hover:bg-[#e5e5e5] hover:text-black border border-white/20 hover:border-transparent py-2.5 font-mono text-[10px] tracking-widest font-bold uppercase transition duration-300 rounded-none cursor-pointer text-zinc-250"
                  >
                    GO TO HOODIES
                  </button>
                </div>
              </div>
            </section>

            {/* TESTIMONIAL CAROUSEL PANEL */}
            <section className="max-w-7xl mx-auto px-10 text-left">
              <div className="text-center space-y-2 mb-10">
                <h2 className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em] font-bold">CLIENT SATISFACTION</h2>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">TRUE WEARER TESTIMONIALS</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((t) => (
                  <div key={t.id} className="bg-gradient-to-b from-[#0c0c0c] to-[#070707] border border-white/5 rounded-none p-6 flex flex-col justify-between hover:border-white/20 transition duration-300">
                    <div className="space-y-4">
                      {/* Star count */}
                      <div className="flex gap-1 text-zinc-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} size={10} className="fill-zinc-400" />
                        ))}
                      </div>
                      <p className="text-xs text-zinc-400 italic leading-relaxed font-light">
                        "{t.text}"
                      </p>
                    </div>
                    <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between font-mono text-[10px] text-zinc-400">
                      <div>
                        <div className="text-white font-bold uppercase">{t.name}</div>
                        <div className="text-[9px] text-zinc-550">{t.role}</div>
                      </div>
                      <span className="text-zinc-500 text-[9px]">{t.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* VIEW: SHOP (Product Catalog with Filters) */}
        {currentView === 'shop' && (
          <div className="max-w-7xl mx-auto px-10 py-10 text-left animate-fade-in">
            <div className="space-y-4 mb-8">
              <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
                SHOP ALL APPAREL
              </h1>
              <p className="text-xs text-zinc-400 max-w-2xl font-light leading-relaxed">
                Explore our curated list of distressed knit beanies, double-layered French Terry crewnecks, tactical cargopants, and extremely plush 450GSM loopback cotton hoodies.
              </p>
            </div>

            {/* Filter and sorting options */}
            <div className="bg-gradient-to-b from-[#0c0c0c] to-[#070707] border border-white/5 rounded-none p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 font-mono text-xs">
              
              {/* Category tabs */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-zinc-500 uppercase mr-2.5 flex items-center gap-1 text-[11px] tracking-wider">
                  <Filter size={11} />
                  <span>Category:</span>
                </span>
                {['All', 'Hoodies', 'T-Shirts', 'Outerwear', 'Pants', 'Accessories'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 transition cursor-pointer text-[10px] tracking-widest font-bold rounded-none ${
                      selectedCategory === cat
                        ? 'bg-[#e5e5e5] text-black font-extrabold border border-zinc-100'
                        : 'bg-transparent border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Sorting selectors */}
              <div className="flex flex-wrap gap-4 items-center justify-between lg:justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 uppercase tracking-wider text-[11px]">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-black/60 text-zinc-300 border border-white/10 rounded-none px-2.5 py-1.5 focus:outline-none focus:border-white font-mono cursor-pointer uppercase text-[10px] tracking-wider"
                    aria-label="Sort products by filters"
                  >
                    <option value="featured">FEATURED DEFAULT</option>
                    <option value="price-asc">PRICE: LOW TO HIGH</option>
                    <option value="price-desc">PRICE: HIGH TO LOW</option>
                    <option value="rating">HIGHEST RATED</option>
                  </select>
                </div>

                {/* Query status count */}
                <div className="text-zinc-550 font-mono text-[10px]">
                  ITEMS MATCHING ({sortedProducts.length})
                </div>
              </div>
            </div>

            {/* Search Query Empty Fallback and Grids */}
            {sortedProducts.length === 0 ? (
              <div className="p-16 text-center border border-dashed border-white/10 rounded-none bg-gradient-to-b from-[#0c0c0c] to-[#070707] max-w-md mx-auto space-y-4">
                <HelpCircle size={28} className="mx-auto text-zinc-600" />
                <h3 className="text-white font-mono uppercase text-[10px] tracking-widest font-bold">No streetwear targets found</h3>
                <p className="text-xs text-zinc-500 font-light">We couldn't locate any Troubled Mind garments matching your filter or query string: "{searchQuery}". Try editing the parameters.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="bg-transparent hover:bg-white hover:text-black border border-white/10 hover:border-transparent text-zinc-300 text-[10px] tracking-widest px-4 py-2 font-mono uppercase transition duration-300 font-bold rounded-none cursor-pointer"
                >
                  Reset Parameters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={setActiveProduct}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: COLLECTIONS */}
        {currentView === 'collections' && (
          <div className="max-w-7xl mx-auto px-10 py-10 text-left space-y-12 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
                OUR COLLECTIONS
              </h1>
              <p className="text-xs text-zinc-400 max-w-2xl font-light leading-relaxed">
                Explore dedicated style capsules engineered around modern mental resilience, urban Antioch Tennessee movements, and rebellious selfexpression.
              </p>
            </div>

            {/* Lookbook 1: Heavyweight Capsule */}
            <div className="bg-[#0c0c0c] border border-white/5 rounded-none overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 h-[300px] lg:h-[400px] relative bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=700"
                  alt="Resilience Heavyweight collection lookbook"
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 hover:opacity-70 transition duration-500"
                />
              </div>
              <div className="lg:col-span-6 p-6 sm:p-10 space-y-4">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">CAPSULE 01 • RESILIENCE WEAR</span>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">THE 450GSM SHIELD SERIES</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  Our heaviest blank garments. Perfect oversized drop-shoulder hoods with solid raw-cut ribbed structures. Built in deep charcoal and ash washes representing the solid bedrock of resilience.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('Hoodies');
                      setView('shop');
                    }}
                    className="bg-transparent border border-white/10 hover:border-white text-zinc-100 hover:bg-zinc-100 hover:text-black transition-all text-xs uppercase tracking-widest px-8 py-3 rounded-none font-bold cursor-pointer"
                  >
                    Examine Heavys
                  </button>
                </div>
              </div>
            </div>

            {/* Lookbook 2: Metal Crest Accessories & Tactical Denim */}
            <div className="bg-[#0c0c0c] border border-white/5 rounded-none overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 lg:order-2 h-[300px] lg:h-[400px] relative bg-zinc-900 z-0">
                <img
                  src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=700"
                  alt="Tactical mind style collection"
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 hover:opacity-70 transition duration-500"
                />
              </div>
              <div className="lg:col-span-6 lg:order-1 p-6 sm:p-10 space-y-4">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">CAPSULE 02 • URBAN ARMOUR</span>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">CHAOS CONTROL & METROPOLIS</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  Tactical-bellow cargo pants paired with down-insulated liquid puffer shells. Engineered for high performance mobility, rain-repellency, and cold asphalt Tennessee evenings.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('Outerwear');
                      setView('shop');
                    }}
                    className="bg-transparent border border-white/10 hover:border-white text-zinc-100 hover:bg-zinc-100 hover:text-black transition-all text-xs uppercase tracking-widest px-8 py-3 rounded-none font-bold cursor-pointer"
                  >
                    Examine Armour
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: ABOUT US */}
        {currentView === 'about' && (
          <div className="max-w-4xl mx-auto px-10 py-10 text-left space-y-8 animate-fade-in">
            <div className="space-y-4">
              <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block font-bold">OUR MANIFESTO</span>
              <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
                ABOUT TROUBLED MIND APPAREL
              </h1>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Troubled Mind represents the profound intersection of creative friction and solid resilience. Established in Antioch, Tennessee, our goal is to design garments that empower individuals to express their deepest thoughts, struggles, and ultimate dreams without uttering a single word.
              </p>
            </div>

            <div className="bg-[#0c0c0c] border border-white/5 rounded-none p-5 sm:p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                THE FOUNDER'S VISION
              </h2>
              <p className="text-xs text-zinc-450 leading-relaxed font-light">
                Streetwear is more than casual fabric—it is your self-expressive shield of armor. Every distressed edge, cracked screenprint, and heavy-thread density on a Troubled Mind hoodie is deliberately mapped. Our collection emphasizes boxy tailored fits, eye-safe charcoal-indigo wash styles, and durable tactical hardware that speak of urban Tennessee resilience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 font-mono text-[10px] text-zinc-500">
              <div className="bg-black/40 p-5 rounded-none border border-white/5 space-y-2">
                <div className="text-zinc-300 font-bold uppercase tracking-wider">ANTIOCH STATE OF MIND</div>
                <p className="text-[10px] text-zinc-550 font-light">
                  Based in Antioch, TN (Phone: 615-715-2900). We draw directly from local Tennessean urban art scenes, representing local creativity to the global streetwear stage.
                </p>
              </div>
              
              <div className="bg-black/40 p-5 rounded-none border border-white/5 space-y-2">
                <div className="text-zinc-300 font-bold uppercase tracking-wider">PREMIUM DURABILITY</div>
                <p className="text-[10px] text-zinc-550 font-light">
                  We don't do cheap fast fashion. All pieces utilize durable rigid ring-spawn organic cotton pre-washed to prevent long-term shrinkage. Built to last.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: CONTACT US */}
        {currentView === 'contact' && (
          <div className="max-w-5xl mx-auto px-10 py-10 text-left animate-fade-in">
            <h1 className="text-2xl font-bold text-white uppercase tracking-wider mb-8">
              CONTACT TROUBLED MIND
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Info column */}
              <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                <div className="bg-[#0c0c0c] border border-white/5 rounded-none p-6 space-y-5 font-mono text-xs text-zinc-400">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest pb-2 border-b border-white/5">
                    Troubled Mind Headquarters
                  </h3>
                  
                  <div className="flex items-center gap-3">
                    <MapPin size={14} className="text-zinc-500 flex-shrink-0" />
                    <div>
                      <div className="text-white font-bold">HQ Location</div>
                      <div className="text-[11px] text-zinc-550">Antioch, Tennessee, USA</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={14} className="text-zinc-500 flex-shrink-0" />
                    <div>
                      <div className="text-white font-bold">Direct Line</div>
                      <div className="text-[11px] text-zinc-550 font-sans">615-715-2900</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail size={14} className="text-zinc-500 flex-shrink-0" />
                    <div>
                      <div className="text-white font-bold">Email Route</div>
                      <div className="text-[11px] text-zinc-550 font-sans">waniisaggrey@gmail.com</div>
                    </div>
                  </div>
                </div>

                {/* Local hours */}
                <div className="bg-[#0c0c0c] border border-white/5 p-5 rounded-none font-mono text-[10px] text-zinc-500 text-left space-y-1">
                  <div className="text-zinc-400 font-bold uppercase mb-1 tracking-wider">ANTIOCH HOURS (CST)</div>
                  <div>MON - FRI: 9:00 AM - 6:00 PM</div>
                  <div>SATURDAY: 10:00 AM - 4:00 PM</div>
                  <div>SUN: Closed online shipments</div>
                </div>
              </div>

              {/* Form Message Column */}
              <div className="lg:col-span-12 xl:col-span-7 bg-[#0c0c0c] border border-white/5 p-6 rounded-none">
                {contactSubmitted ? (
                  <div className="py-12 text-center space-y-3 animate-fade-in">
                    <CheckCircle2 size={32} className="mx-auto text-white animate-bounce" />
                    <h3 className="text-white font-mono uppercase text-xs tracking-widest font-extrabold">MESSAGE TRANSMITTED</h3>
                    <p className="text-xs text-zinc-400 max-w-xs mx-auto">Thank you, courier received your message securely. Waniis Aggrey team from Antioch TN will respond within 4 business hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-widest font-extrabold pb-2 border-b border-zinc-900">
                      Transmit Direct Inquiry
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="contact-name" className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">FullName *</label>
                        <input
                          type="text"
                          id="contact-name"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Waniis Aggrey"
                          className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded p-2.5 focus:outline-none focus:border-zinc-550"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="contact-email" className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">Email Address *</label>
                        <input
                          type="email"
                          id="contact-email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="waniisaggrey@gmail.com"
                          className="w-full bg-transparent border border-white/10 text-xs text-white rounded-none p-2.5 focus:outline-none focus:border-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="contact-msg" className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">Your Message *</label>
                      <textarea
                        id="contact-msg"
                        required
                        rows={5}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Inquire about retail stocking, sizes, or custom orders from Antioch Tennessee..."
                        className="w-full bg-transparent border border-white/10 text-xs text-white rounded-none p-2.5 focus:outline-none focus:border-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-transparent hover:bg-[#e5e5e5] hover:text-black border border-white/20 hover:border-transparent py-3.5 text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer"
                    >
                      TRANSMIT APPAREL COURIER
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        )}

        {/* VIEW: FAQ */}
        {currentView === 'faq' && (
          <div className="max-w-3xl mx-auto px-10 py-10 text-left space-y-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-white uppercase tracking-wider text-center">
              FREQUENTLY ASKED QUESTIONS
            </h1>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="bg-gradient-to-b from-[#0c0c0c] to-[#070707] border border-white/5 p-5 rounded-none space-y-2 hover:border-white/20 transition duration-300">
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight font-mono flex gap-2">
                    <span className="text-zinc-650">Q:</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed pl-5 border-l border-white/5 font-light">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: CART DETAILS */}
        {currentView === 'cart' && (
          <div className="max-w-4xl mx-auto px-10 py-10 text-left animate-fade-in">
            <h1 className="text-2xl font-bold text-white uppercase tracking-wider mb-8">
              SHOPPING BASKET
            </h1>

            {cartItems.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-none bg-gradient-to-b from-[#0c0c0c] to-[#070707] max-w-md mx-auto space-y-4">
                <ShoppingBag size={28} className="mx-auto text-zinc-600 animate-pulse" />
                <h3 className="text-white font-mono uppercase text-xs tracking-widest font-bold">Cart is currently empty</h3>
                <p className="text-xs text-zinc-500 font-light">Express individuality and browse our resilient washes.</p>
                <button
                  onClick={() => setView('shop')}
                  className="bg-transparent border border-white/10 hover:border-white text-zinc-100 hover:bg-zinc-100 hover:text-black transition-all text-xs uppercase tracking-widest px-8 py-3.5 rounded-none font-bold cursor-pointer"
                >
                  Browse Streetwear
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="bg-gradient-to-b from-[#0c0c0c] to-[#070707] border border-white/5 p-4 rounded-none flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div className="flex gap-4 items-center w-full sm:w-auto">
                        <div className="w-16 h-20 bg-zinc-900 rounded-none overflow-hidden flex-shrink-0 border border-white/5">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover grayscale" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white uppercase text-xs tracking-wider">{item.product.name}</h4>
                          <span className="font-mono text-[9px] text-zinc-500 uppercase block mt-1.5 tracking-widest">Color: {item.selectedColor} • Size: {item.selectedSize}</span>
                        </div>
                      </div>

                      <div className="flex gap-6 items-center justify-between w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-white/5">
                        <div className="inline-flex border border-white/10 rounded-none bg-black/40">
                          <button onClick={() => handleUpdateCartQuantity(index, -1)} className="px-2.5 py-1 text-zinc-550 hover:text-white border-r border-white/10">-</button>
                          <span className="px-3.5 text-[#e5e5e5] font-mono text-xs inline-flex items-center">{item.quantity}</span>
                          <button onClick={() => handleUpdateCartQuantity(index, 1)} className="px-2.5 py-1 text-zinc-550 hover:text-white border-l border-white/10">+</button>
                        </div>
                        <div className="font-mono font-bold text-white text-sm">
                          ${item.product.price * item.quantity}.00
                        </div>
                        <button onClick={() => handleRemoveCartItem(index)} className="text-[10px] uppercase font-mono tracking-widest text-zinc-550 hover:text-white transition-colors">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-b from-[#0c0c0c] to-[#070707] border border-white/5 p-5 rounded-none max-w-md ml-auto space-y-4 font-mono text-xs">
                  <div className="flex justify-between font-bold text-zinc-455">
                    <span className="text-[11px] tracking-widest">CART BAG VALUE</span>
                    <span className="text-[#e5e5e5] font-semibold">${cartItems.reduce((acc, current) => acc + current.product.price * current.quantity, 0)}.00</span>
                  </div>
                  <div className="text-[9px] text-zinc-650 leading-relaxed font-light">Taxes & shipping added dynamically at secure checkout.</div>
                  <button
                    onClick={() => setView('checkout')}
                    className="w-full bg-transparent hover:bg-[#e5e5e5] hover:text-black border border-white/20 hover:border-transparent py-3 text-xs font-bold uppercase tracking-widest text-center block transition-all duration-300 rounded-none cursor-pointer"
                  >
                    PROCEED TO SHIPPING
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: SECURE CHECKOUT INTERACTION */}
        {currentView === 'checkout' && (
          <CheckoutSection
            cartItems={cartItems}
            setView={setView}
            onClearCart={() => setCartItems([])}
            onOrderComplete={setCompletedOrder}
          />
        )}

        {/* VIEW: ORDER CONFIRMATION IN TRANSIT */}
        {currentView === 'order-confirmation' && completedOrder && (
          <div className="max-w-2xl mx-auto px-10 py-16 text-center space-y-8 animate-fade-in">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-none bg-gradient-to-b from-[#0c0c0c] to-[#070707] border border-white/10 text-white flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                <CheckCircle2 size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
                TRANSMISSION APPROVED
              </h1>
              <div className="font-mono text-[10px] bg-black/60 border border-white/5 inline-block px-3 py-1.5 rounded-none text-zinc-400 font-bold tracking-widest">
                STREET COURIER ID: <span className="text-white font-bold">{completedOrder.id}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed font-light italic">
              Your resilient Troubled Mind order has been authorized! A secure summary holds your items for shipment from our warehouses in Antioch Tennessee.
            </p>

            {/* Order Items Summary */}
            <div className="bg-[#0c0c0c] border border-white/5 rounded-none p-5 text-left space-y-4">
              <h3 className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-900 pb-2">
                ORDER RECEIPT DETAILS
              </h3>
              <div className="space-y-3">
                {completedOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-zinc-400">
                    <span>
                      {item.product.name} (x{item.quantity}) - {item.selectedSize} / {item.selectedColor}
                    </span>
                    <span className="font-mono text-white">${item.product.price * item.quantity}.00</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-zinc-900 font-mono text-xs text-zinc-500 flex justify-between">
                <span>Total Payment Charged:</span>
                <span className="text-white font-bold text-sm">${completedOrder.grandTotal}.00</span>
              </div>
            </div>
                   {/* Quick account lookup anchor */}
            <div className="flex justify-center gap-4">
              <button
                id="conf-order-detail-btn"
                onClick={() => setView('account')}
                className="bg-transparent hover:bg-zinc-900 border border-white/20 hover:border-white text-zinc-300 py-3.5 px-6 rounded-none text-[10px] font-mono uppercase tracking-widest font-bold cursor-pointer transition-colors duration-300"
              >
                Inspect order history
              </button>
              <button
                id="conf-shop-btn"
                onClick={() => setView('shop')}
                className="bg-[#e5e5e5] text-black hover:bg-white py-3.5 px-8 rounded-none text-[10px] font-mono uppercase tracking-widest font-extrabold cursor-pointer transition-all duration-300"
              >
                Back To Store
              </button>
            </div>
          </div>
        )}

        {/* VIEW: MY ACCOUNT (Order History, addresses & discount dashboard) */}
        {currentView === 'account' && (
          <div className="max-w-4xl mx-auto px-10 py-10 text-left space-y-8 animate-fade-in">
            <div className="space-y-2 border-b border-white/5 pb-4">
              <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
                CUSTOMER DASHBOARD
              </h1>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Account: park64083@gmail.com • Antioch Tennessee Backer
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Column stats */}
              <div className="md:col-span-4 bg-[#0c0c0c] border border-white/5 rounded-none p-5 space-y-4">
                <span className="text-[9px] font-mono text-zinc-500 uppercase block font-bold tracking-widest">STREETWEAR LOYALTY CREST</span>
                <div className="space-y-1">
                  <div className="text-sm font-bold uppercase text-white tracking-wider">BRONZE BACKER</div>
                  <div className="font-mono text-[9px] text-zinc-650">MEMBERSHIP ACTIVE SINCE 2026</div>
                </div>
                <div className="pt-4 border-t border-white/5 text-[11px] text-zinc-400 space-y-1 font-mono">
                  <div>📍 Antioch TN, 37013</div>
                  <div>📞 615-715-2900</div>
                </div>
              </div>

              {/* Right Column details */}
              <div className="md:col-span-8 space-y-6">
                
                {/* Active completed orders list */}
                <div className="bg-[#0c0c0c] border border-white/5 rounded-none p-5 space-y-4 font-mono">
                  <h3 className="text-xs text-zinc-455 font-bold uppercase tracking-widest pb-2 border-b border-white/5 flex justify-between">
                    <span>TRANSMISSION RECORDS & HISTORY</span>
                    <span className="text-[9px] lowercase italic text-zinc-600">Updated standard real-time</span>
                  </h3>

                  {completedOrder ? (
                    <div className="p-4 bg-black/40 border border-white/5 space-y-2 text-xs text-zinc-450">
                      <div className="flex justify-between font-bold text-white tracking-wider">
                        <span>STREET RECORD: {completedOrder.id}</span>
                        <span className="text-green-400">IN ANTIOCH TRANSIT</span>
                      </div>
                      <div className="text-[9px] text-zinc-550">Date Logged: {completedOrder.date}</div>
                      <div className="pt-1.5 space-y-1 border-t border-white/5">
                        {completedOrder.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-[11px]">
                            <span>{item.product.name} (x{item.quantity})</span>
                            <span className="text-white">${item.product.price * item.quantity}.00</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-1.5 border-t border-white/5 font-bold text-white flex justify-between">
                        <span>Charged Amount:</span>
                        <span>${completedOrder.grandTotal}.00</span>
                      </div>
                    </div>
                  ) : null}

                  {/* Preloaded mock historical orders */}
                  <div className="p-4 bg-black/20 border border-white/5 space-y-2 text-xs text-zinc-500">
                    <div className="flex justify-between font-bold text-zinc-400">
                      <span>STREET RECORD: TM-351892</span>
                      <span className="text-zinc-650">DELIVERED</span>
                    </div>
                    <div className="text-[9px]">Date Logged: 2026-03-12</div>
                    <div className="text-[11px] pt-1.5 border-t border-white/5 flex justify-between">
                      <span>TROUBLED SOUL knit beanie (x1) • Void Black</span>
                      <span className="text-zinc-450">$30.00</span>
                    </div>
                    <div className="pt-1 border-t border-white/5 text-zinc-450 flex justify-between">
                      <span>Charged Amount:</span>
                      <span>$35.00</span>
                    </div>
                  </div>
                </div>

                {/* Wishlisted apparel */}
                <div className="bg-[#0c0c0c] border border-white/5 rounded-none p-5 space-y-4">
                  <h3 className="text-xs font-mono text-zinc-440 font-bold uppercase tracking-widest pb-2 border-b border-white/5 flex items-center gap-1.5">
                    <Heart size={10} className="text-white fill-white" />
                    <span>Favorites & Wishlist ({wishlist.length})</span>
                  </h3>
                  
                  {wishlist.length === 0 ? (
                    <p className="text-[10px] text-zinc-650 font-mono italic">No items are favorited yet. Visit the catalog to earmark items.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {wishlist.map((item) => (
                        <div key={item.id} className="bg-black/40 border border-white/5 p-2.5 rounded-none flex gap-2 text-left text-xs font-mono">
                          <img src={item.images[0]} alt={item.name} className="w-10 h-12 object-cover rounded-none grayscale border border-white/5" />
                          <div className="flex-1 flex flex-col justify-between">
                            <span className="text-white font-bold uppercase tracking-wider text-[10px] line-clamp-1">{item.name}</span>
                            <span className="text-zinc-455 text-[9px]">${item.price}.00</span>
                          </div>
                          <button
                            onClick={() => handleToggleWishlist(item)}
                            className="text-zinc-500 hover:text-white pb-3 focus:outline-none cursor-pointer"
                            title="Remove favorites"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* 3. Immersive Footer with Antioch information and iWebNext credits */}
      <footer className="bg-black border-t border-white/5 py-12 px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left mb-10">
          
          {/* Logo Brand intro */}
          <div className="space-y-4">
            <span className="text-sm font-bold tracking-widest text-white uppercase">TROUBLED MIND</span>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-light">
              Edgy premium streetwear representational apparel forged out of Antioch, Tennessee. Expressing resilience and pure individuality.
            </p>
            <div className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
              waniisaggrey@gmail.com • 615-715-2900
            </div>
          </div>

          {/* Core Navigation looklinks */}
          <div className="space-y-3 font-mono text-xs">
            <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">SHOPPING GATEWAYS</span>
            <ul className="space-y-1.5 text-zinc-500 text-[10px]">
              <li><button onClick={() => { setSelectedCategory('All'); handleNavigateView('shop'); }} className="hover:text-white uppercase transition-colors">Shop All Blanks</button></li>
              <li><button onClick={() => { setSelectedCategory('Hoodies'); handleNavigateView('shop'); }} className="hover:text-white uppercase transition-colors">Heavyweight Hoodies</button></li>
              <li><button onClick={() => { handleNavigateView('collections'); }} className="hover:text-white uppercase transition-colors">Street Lookbook</button></li>
              <li><button onClick={() => { handleNavigateView('account'); }} className="hover:text-white uppercase transition-colors">Backers Profile</button></li>
            </ul>
          </div>

          {/* Support policies links */}
          <div className="space-y-3 font-mono text-xs">
            <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">CUSTOMER SERVICE</span>
            <ul className="space-y-1.5 text-zinc-500 text-[10px]">
              <li><button onClick={() => { handleNavigateView('faq'); }} className="hover:text-white uppercase transition-colors">FAQ Dropdown</button></li>
              <li><button onClick={() => { handleNavigateView('contact'); }} className="hover:text-white uppercase transition-colors">Antioch Dispatch</button></li>
              <li><button onClick={() => { handleNavigateView('faq'); }} className="hover:text-white uppercase transition-colors">Shipping Transit</button></li>
              <li><button onClick={() => { handleNavigateView('about'); }} className="hover:text-white uppercase transition-colors">Manifesto Vision</button></li>
            </ul>
          </div>

          {/* SEO and Location details */}
          <div className="space-y-3 font-mono text-xs">
            <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">ANTIOCH LOCAL OUTLET</span>
            <div className="text-zinc-500 space-y-2">
              <p className="text-[10px] leading-relaxed font-light">
                Troubled Mind Clothing is headquartered in Antioch TN, 37013. We synthesize Contemporary Premium Urban Apparel with direct delivery nationwide.
              </p>
              <div className="text-[9px] text-zinc-650">
                SEO TAGS • Antioch Streetwear TN • Urban Fashion Tennessee • Troubled Mind Clothing Brand
              </div>
            </div>
          </div>
        </div>

        {/* Brand Copyright and required Developer attribution */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center space-y-2">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            © {new Date().getFullYear()} TROUBLED MIND STREETWEAR. ALL RIGHTS SECURED COMPLETED.
          </p>
          <p className="text-[11px] text-zinc-500 font-mono">
            Developed by <a href="https://iwebnext.com" target="_blank" className="hover:text-white transition-colors underline decoration-dotted">iWebNext</a>
          </p>
        </div>
      </footer>

      {/* 4. Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 w-11 h-11 bg-black/60 border border-white/10 hover:border-white text-zinc-400 hover:text-white rounded-none flex items-center justify-center shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          title="Scroll to Top"
        >
          <ArrowUp size={14} />
        </button>
      )}

      {/* 5. Floating AI Chatbot Assistant */}
      <Chatbot />

      {/* 6. Product presentation detail modal view */}
      {activeProduct && (
        <ProductDetailModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={!!wishlist.find(p => p.id === activeProduct.id)}
        />
      )}

      {/* 7. Slide-out cart drawer view */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setView('checkout');
        }}
      />

    </div>
  );
}
