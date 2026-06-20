import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Truck, Undo, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Product, CartItem, Review } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}: ProductDetailModalProps) {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');

  // Initial mock comments based on reviewsCount
  useEffect(() => {
    setActiveImage(product.images[0]);
    setSelectedColor(product.colors[0]);
    setSelectedSize(product.sizes[0]);
    setQuantity(1);
    setAddedMessage(false);

    // Dynamic product mock comments
    const initialReviews: Review[] = [
      {
        id: 'rev-1',
        author: 'Jonas M.',
        rating: 5,
        date: '2026-05-12',
        text: `Best streetwear purchase this year. The ${product.name} has unbelievable material weight and quality.`,
        verified: true,
        location: 'Nashville, TN'
      },
      {
        id: 'rev-2',
        author: 'Sarah V.',
        rating: 4,
        date: '2026-06-02',
        text: `Super comfy. Pre-washed vintage look is perfect. Antioch team is doing a brilliant job!`,
        verified: true,
        location: 'Antioch, TN'
      }
    ];
    setReviews(initialReviews);
  }, [product]);

  const handleAddToCart = () => {
    onAddToCart({
      product,
      selectedColor,
      selectedSize,
      quantity
    });
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 2500);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const addedRev: Review = {
      id: `rev-${Date.now()}`,
      author: newName,
      rating: newRating,
      date: new Date().toISOString().split('T')[0],
      text: newComment,
      verified: true,
      location: 'Antioch Backer'
    };

    setReviews([addedRev, ...reviews]);
    setNewName('');
    setNewComment('');
    setNewRating(5);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-[#0c0c0c] border border-white/5 rounded-none w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-[#e5e5e5] text-zinc-400 hover:text-black p-1.5 rounded-none border border-white/10 transition-colors focus:outline-none cursor-pointer"
          title="Close presentation"
        >
          <X size={16} />
        </button>

        {/* Media Column */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-white/5">
          <div className="relative pt-[115%] bg-zinc-950 rounded-none overflow-hidden flex items-center justify-center border border-white/5">
            <img
              src={activeImage}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-all grayscale"
            />
          </div>

          {/* Alternate gallery indicators */}
          <div className="grid grid-cols-2 gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`pt-[75%] relative bg-zinc-950 rounded-none border overflow-hidden cursor-pointer transition-all duration-300 ${
                  activeImage === img ? 'border-white opacity-100' : 'border-white/5 opacity-55 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} gallery ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover grayscale"
                />
              </button>
            ))}
          </div>

          {/* Guarantee Badges */}
          <div className="bg-black/60 border border-white/5 p-4 mt-2 space-y-3 font-mono text-[10px] text-zinc-455">
            <div className="flex items-center gap-2">
              <Truck size={12} className="text-zinc-500" />
              <span>Antioch standard transit: TN 1-2 days, National 3-5 days.</span>
            </div>
            <div className="flex items-center gap-2">
              <Undo size={12} className="text-zinc-500" />
              <span>30-Day Hassle-Free Streetwear Size Exchange policy.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-zinc-500" />
              <span>100% Secure SSL encrypted gateway payment processing.</span>
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono tracking-[0.2em] bg-[#121212]/90 border border-white/5 text-zinc-500 px-2.5 py-1 rounded-none uppercase">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono tracking-widest">
                <Star size={10} className="text-zinc-400 fill-zinc-400" />
                <span>{product.rating}</span>
                <span className="text-zinc-750 font-light">•</span>
                <span>{product.reviewsCount} REVIEWS</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white uppercase tracking-wider">
              {product.name}
            </h2>

            <div className="text-xl font-mono font-bold text-zinc-200">
              ${product.price}.00
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Custom wash color indicator */}
            <div className="space-y-2">
              <label id="variant-color-label" className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                COLOR WASH: {selectedColor}
              </label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 border font-mono text-[10px] rounded-none transition-all uppercase cursor-pointer ${
                      selectedColor === color
                        ? 'bg-[#e5e5e5] text-black border-transparent font-bold'
                        : 'bg-transparent text-zinc-400 border-white/10 hover:border-white'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes picker */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label id="variant-size-label" className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                  SIZE SELECT: {selectedSize}
                </label>
                <div className="text-[9px] font-mono text-zinc-650 italic">Fits Boxy Oversized</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 border font-mono text-[10px] font-bold rounded-none flex items-center justify-center transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#e5e5e5] text-black border-transparent font-bold'
                        : 'bg-transparent text-zinc-400 border-white/10 hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity select */}
            <div className="space-y-2">
              <label id="quantity-label" className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                QUANTITY
              </label>
              <div className="inline-flex border border-white/10 rounded-none bg-black/40">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 text-zinc-500 hover:text-white border-r border-white/10 focus:outline-none cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-5 py-1.5 text-[#e5e5e5] font-mono text-xs inline-flex items-center justify-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 text-zinc-500 hover:text-white border-l border-white/10 focus:outline-none cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Details and Specs Bullets */}
            <div className="pt-3 border-t border-white/5">
              <h4 className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest mb-2">SPECS AND DETAILS</h4>
              <ul className="text-[10px] text-zinc-500 space-y-1 bg-black/40 p-3 border border-white/5 rounded-none font-mono">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 font-light">
                    <span className="text-zinc-700">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-none text-xs tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer ${
                  product.inStock
                    ? 'bg-transparent hover:bg-[#e5e5e5] hover:text-black border border-white/20 hover:border-transparent text-white'
                    : 'bg-[#121212] text-zinc-650 cursor-not-allowed border border-white/5'
                }`}
              >
                <ShoppingBag size={14} />
                {product.inStock ? 'Add To Cart' : 'OUT OF STOCK'}
              </button>

              <button
                id="wishlist-btn"
                title="Save to favorites"
                onClick={() => onToggleWishlist(product)}
                className={`px-4 py-3.5 rounded-none border border-white/10 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  isWishlisted
                    ? 'bg-black/60 text-white border-white'
                    : 'bg-transparent text-zinc-500 border-white/10 hover:border-white hover:text-white'
                }`}
              >
                <Heart size={16} className={isWishlisted ? 'fill-zinc-400 text-zinc-400' : ''} />
              </button>
            </div>

            {addedMessage && (
              <div className="bg-[#121212] text-zinc-300 border border-white/5 px-4 py-2.5 rounded-none text-[10px] font-mono tracking-widest uppercase flex items-center gap-2 animate-pulse">
                <Sparkles size={12} className="text-zinc-400" />
                <span>Shedding doubts! Item successfully packed in your street cart.</span>
              </div>
            )}
          </div>

          {/* Integrated product reviews section */}
          <div className="pt-6 mt-6 border-t border-white/5 space-y-4">
            <h3 className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest flex items-center justify-between">
              <span>CUSTOMER REVIEWS ({reviews.length})</span>
              <span className="text-[9px] text-zinc-650 lowercase italic">Veracity validated</span>
            </h3>

            {/* List Reviews */}
            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-black/60 border border-white/5 rounded-none flex flex-col gap-1 text-[11px] font-mono">
                  <div className="flex items-center justify-between gap-1 text-[10px]">
                    <span className="text-zinc-300 font-bold uppercase tracking-wider">{rev.author}</span>
                    <span className="text-zinc-600">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-550 text-[9px]">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={6} className={`${i < rev.rating ? 'text-zinc-400 fill-zinc-400' : 'text-zinc-800'}`} />
                      ))}
                    </div>
                    <span>•</span>
                    <span className="text-zinc-650">{rev.location}</span>
                  </div>
                  <p className="text-zinc-450 font-sans mt-1.5 italic font-light">
                    "{rev.text}"
                  </p>
                </div>
              ))}
            </div>

            {/* Write a review form */}
            <form onSubmit={handleAddReview} className="space-y-2 bg-black/40 p-3 rounded-none border border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Leave a Wearer Review</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={newName}
                  aria-label="Review author name"
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-transparent border border-white/10 text-xs text-white rounded-none p-1.5 focus:outline-none focus:border-white"
                />
                <select
                  value={newRating}
                  aria-label="Star rating selection"
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="bg-black border border-white/10 text-xs text-zinc-400 rounded-none p-1.5 focus:outline-none focus:border-white font-mono uppercase text-[10px]"
                >
                  <option value={5}>🌟 5 STARS (IDEAL)</option>
                  <option value={4}>⭐ 4 STARS</option>
                  <option value={3}>⭐ 3 STARS</option>
                  <option value={2}>⭐ 2 STARS</option>
                  <option value={1}>⭐ 1 STAR</option>
                </select>
              </div>
              <textarea
                placeholder="Review comment (e.g. Fit feel, fabric texture...)"
                rows={2}
                required
                value={newComment}
                aria-label="Review comment"
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-transparent border border-white/10 text-xs text-white rounded-none p-1.5 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="w-full bg-transparent hover:bg-[#e5e5e5] hover:text-black border border-white/20 hover:border-transparent text-zinc-300 transition-colors text-[9px] uppercase font-mono py-2 rounded-none font-bold cursor-pointer tracking-widest"
              >
                Transmit Wearer Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
