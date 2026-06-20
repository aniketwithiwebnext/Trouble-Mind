import React from 'react';
import { Star, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  return (
    <div 
      className="group bg-gradient-to-b from-[#0e0e0e] to-[#070707] border border-white/5 rounded-none overflow-hidden flex flex-col hover:border-white/20 transition-all duration-305 relative text-left"
    >
      {/* Decorative tag overlays */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.isNewArrival && (
          <span className="bg-[#e5e5e5] text-black text-[8px] font-mono font-bold tracking-[0.2em] uppercase px-2 py-0.5">
            NEW
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-black/80 text-zinc-300 border border-white/5 text-[8px] font-mono tracking-[0.2em] uppercase px-2 py-0.5">
            BESTSELLER
          </span>
        )}
        {product.id === 'tm-01' || product.id === 'tm-06' ? (
          <span className="bg-[#121212]/90 text-zinc-400 border border-white/5 text-[8px] font-mono tracking-[0.2em] uppercase px-2 py-0.5">
            Heavy 450GSM
          </span>
        ) : null}
      </div>

      {/* Styled Image Preview with dual hover image swapping */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative pt-[125%] w-full overflow-hidden bg-zinc-900/40 cursor-pointer border-b border-white/5"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-103"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in"
          />
        )}
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
          <span className="text-white text-[10px] tracking-[0.2em] uppercase font-mono flex items-center gap-1.5">
            Browse Garment <ArrowUpRight size={12} />
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star size={10} className="text-zinc-500 fill-zinc-500" />
              <span className="text-[10px] font-mono text-zinc-500 font-medium">
                {product.rating}
              </span>
            </div>
          </div>

          <h3 
            onClick={() => onViewDetails(product)}
            className="text-xs font-bold tracking-[0.1em] text-white uppercase mt-2.5 cursor-pointer hover:text-zinc-300 transition-colors"
          >
            {product.name}
          </h3>
          <p className="text-xs text-zinc-450 line-clamp-2 mt-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="font-mono text-sm font-semibold text-[#e5e5e5]">
            ${product.price}.00
          </div>
          <button 
            onClick={() => onViewDetails(product)}
            className="bg-transparent hover:bg-[#e5e5e5] hover:text-black border border-white/10 hover:border-transparent text-zinc-350 text-[10px] tracking-[0.2em] uppercase font-medium px-4 py-2 transition-all duration-300 cursor-pointer"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
