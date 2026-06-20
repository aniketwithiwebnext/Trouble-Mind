import React from 'react';
import { ShoppingBag, X, Trash2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (idx: number, change: number) => void;
  onRemoveItem: (idx: number) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-sm bg-[#0c0c0c] border-l border-white/5 h-full flex flex-col justify-between text-left animate-slide-left">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-zinc-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              STREET CART ({cartItems.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 cursor-pointer focus:outline-none transition-colors"
            title="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* List of Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 border border-dashed border-white/10 flex items-center justify-center text-zinc-600 rounded-none">
                <ShoppingBag size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-mono uppercase text-[10px] tracking-widest font-bold">Your cart is empty</h3>
                <p className="text-[11px] text-zinc-500 max-w-xs font-light leading-relaxed">There are no items packed in your streetwear cart. Express individuality and fill up!</p>
              </div>
              <button 
                onClick={onClose}
                className="bg-transparent hover:bg-[#e5e5e5] hover:text-black border border-white/20 hover:border-transparent text-white text-[10px] font-mono py-2.5 px-6 rounded-none tracking-widest uppercase transition-all duration-300 font-bold cursor-pointer"
              >
                BROWSE STYLES
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div 
                key={`${item.product.id}-${idx}`}
                className="bg-black/40 border border-white/5 p-3 rounded-none flex gap-3.5 relative"
              >
                {/* Product Thumbnail */}
                <div className="w-20 h-24 bg-zinc-950 rounded-none overflow-hidden flex-shrink-0 relative border border-white/5">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover grayscale opacity-70"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between text-left">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider line-clamp-1">
                      {item.product.name}
                    </h4>
                    <div className="flex gap-2 font-mono text-[9px] text-zinc-500 mt-1 uppercase tracking-widest">
                      <span>Size: {item.selectedSize}</span>
                      <span>•</span>
                      <span>Color: {item.selectedColor}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity selectors */}
                    <div className="inline-flex border border-white/10 rounded-none bg-black/40">
                      <button
                        onClick={() => onUpdateQuantity(idx, -1)}
                        className="px-2 py-0.5 text-zinc-500 hover:text-white border-r border-white/10 focus:outline-none"
                        aria-label="Decrease item count"
                      >
                        -
                      </button>
                      <span className="px-3 text-white font-mono text-xs inline-flex items-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(idx, 1)}
                        className="px-2 py-0.5 text-zinc-500 hover:text-white border-l border-white/10 focus:outline-none"
                        aria-label="Increase item count"
                      >
                        +
                      </button>
                    </div>

                    <div className="font-mono text-xs text-zinc-300 font-semibold">
                      ${item.product.price * item.quantity}.00
                    </div>
                  </div>
                </div>

                {/* Trash trigger */}
                <button
                  onClick={() => onRemoveItem(idx)}
                  className="absolute top-3 right-3 text-zinc-650 hover:text-red-400 p-1 cursor-pointer transition-colors"
                  title="Remove item"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Summary Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-white/5 bg-[#0a0a0a]/95 space-y-4">
            <div className="space-y-1.5 font-mono text-xs text-zinc-455">
              <div className="flex justify-between">
                <span className="text-[10px] tracking-widest">CART BAG VALUE</span>
                <span className="text-white">${subtotal}.00</span>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-550 leading-none">
                <span>EST. ANTIOCH TN TAX</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-550 leading-none">
                <span>SHIPPING CHARGES</span>
                <span>{subtotal >= 150 ? 'FREE SHIFT' : 'Calculated at checkout'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-between font-mono text-xs font-bold text-white tracking-widest">
              <span>ESTIMATED SUBTOTAL</span>
              <span>${subtotal}.00</span>
            </div>

            <button
              id="cart-drawer-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full bg-transparent hover:bg-[#e5e5e5] hover:text-black border border-white/20 hover:border-transparent py-3.5 rounded-none text-[10px] tracking-widest uppercase font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
            >
              <span>SECURE CHECKOUT</span>
              <ArrowRight size={12} />
            </button>

            <div className="text-center font-mono text-[9px] text-zinc-600">
              ⚡ Orders ship within 24 hours of standard Antioch processing.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
