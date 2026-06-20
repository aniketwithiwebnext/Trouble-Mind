import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Search, User, Star, MapPin } from 'lucide-react';
import { Product } from '../types';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  cartCount: number;
  openCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({
  currentView,
  setView,
  cartCount,
  openCart,
  searchQuery,
  setSearchQuery
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const navItems = [
    { label: 'Shop', view: 'shop' },
    { label: 'Collections', view: 'collections' },
    { label: 'About Us', view: 'about' },
    { label: 'Contact', view: 'contact' },
    { label: 'FAQ', view: 'faq' }
  ];

  const handleNavClick = (view: string) => {
    setView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      {/* Visual Top Bar for Antioch TN Location announcement */}
      <div className="bg-black/40 text-[10px] sm:text-xs text-zinc-400 py-2 px-10 text-center border-b border-white/5 font-mono flex items-center justify-center gap-2 tracking-widest uppercase">
        <MapPin size={11} className="text-zinc-500 animate-pulse" />
        <span>PROUDLY BASED IN ANTIOCH, TENNESSEE • NATIONWIDE EXPRESS COURIER SERVICE</span>
        <div className="hidden md:inline-flex items-center gap-2 ml-4 border-l border-white/5 pl-4">
          <Star size={9} className="text-zinc-400 fill-zinc-400" />
          <span>USE CODE <strong className="text-[#e5e5e5] tracking-widest bg-[#121212] px-1.5 py-0.5 border border-white/5 rounded">MIND20</strong> FOR 20% OFF</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-400 hover:text-white p-2 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Brand Logo - Troubled Mind */}
        <div className="flex-1 md:flex-initial flex justify-center md:justify-start">
          <button
            onClick={() => handleNavClick('home')}
            className="group flex flex-col items-center md:items-start text-left focus:outline-none"
          >
            <div className="text-xl sm:text-2xl font-bold tracking-[0.4em] uppercase text-white group-hover:text-zinc-200 transition-colors">
              Troubled <span className="text-zinc-650 transition-colors group-hover:text-zinc-500">Mind</span>
            </div>
            <span className="text-[8px] font-mono tracking-[0.4em] text-zinc-500 uppercase -mt-0.5 group-hover:text-zinc-400 transition-colors">
              troubledmind.us
            </span>
          </button>
        </div>

        {/* Desktop Navigation links */}
        <nav className="hidden md:flex items-center space-x-10 text-[11px] uppercase tracking-[0.2em] font-medium text-zinc-400">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`transition-colors cursor-pointer hover:text-white py-1 ${
                currentView === item.view
                  ? 'text-white border-b border-white/40'
                  : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Search & Actions Area */}
        <div className="flex items-center space-x-6 text-[11px] uppercase tracking-[0.2em] font-medium text-zinc-400">
          {/* Animated Search bar expansion */}
          <div className="relative flex items-center">
            {showSearch && (
              <input
                type="text"
                placeholder="SEARCH..."
                value={searchQuery}
                aria-label="Search items"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-b border-white/25 text-[10px] tracking-widest text-white px-2 py-1 mr-2 w-32 sm:w-48 focus:outline-none focus:border-white placeholder-zinc-650 transition-all duration-350 animate-fade-in"
              />
            )}
            <button
              id="desktop-search-btn"
              onClick={() => {
                setShowSearch(!showSearch);
                if (currentView !== 'shop') setView('shop');
              }}
              className="hover:text-white p-1 focus:outline-none cursor-pointer flex items-center gap-1 transition-colors"
              title="Search store"
            >
              <span>Search</span>
            </button>
          </div>

          {/* Account Button */}
          <button
            id="desktop-account-btn"
            onClick={() => handleNavClick('account')}
            className={`transition-colors cursor-pointer hover:text-white ${
              currentView === 'account' ? 'text-white' : ''
            }`}
            title="My Account"
          >
            Account
          </button>

          {/* Shopping Cart Button */}
          <button
            id="desktop-cart-btn"
            onClick={openCart}
            className="relative hover:text-white focus:outline-none cursor-pointer transition-colors"
            title="Open Cart"
          >
            <span>Cart</span>
            <span className="absolute -top-2 -right-3 h-4 w-4 bg-zinc-100 text-black text-[9px] rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-t border-white/5 px-6 pt-4 pb-6 space-y-4 animate-slide-down">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`block w-full text-left py-2 text-[10px] tracking-[0.2em] uppercase font-bold border-b border-white/5 ${
                  currentView === item.view ? 'text-white' : 'text-zinc-500'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('account')}
              className={`block w-full text-left py-2 text-[10px] tracking-[0.2em] uppercase font-bold ${
                currentView === 'account' ? 'text-white' : 'text-zinc-500'
              }`}
            >
              My Account
            </button>
          </div>
          
          <div className="pt-4 border-t border-white/5 flex flex-col gap-1.5 font-mono text-[9px] text-zinc-600">
            <div>📍 Antioch, Tennessee</div>
            <div>📞 615-715-2900</div>
            <div>✉️ waniisaggrey@gmail.com</div>
          </div>
        </div>
      )}
    </header>
  );
}
