import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowLeft, Ticket, ShieldCheck, CheckCircle2, ShoppingBag } from 'lucide-react';
import { CartItem, DiscountCode } from '../types';
import { DISCOUNT_CODES } from '../data';

interface CheckoutSectionProps {
  cartItems: CartItem[];
  setView: (view: string) => void;
  onClearCart: () => void;
  onOrderComplete: (orderData: any) => void;
}

export default function CheckoutSection({
  cartItems,
  setView,
  onClearCart,
  onOrderComplete
}: CheckoutSectionProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('TN');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('615-715-2900'); // default mock brand phone
  
  // Promo code discounts
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<DiscountCode | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Stripe Mock Info
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('242');
  const [cardName, setCardName] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  // Totals calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Custom Shipping calculation: 
  // Free if subtotal >= 150
  // Else if Tennessee: $5.00
  // Else: $10.00
  const [shippingFee, setShippingFee] = useState(10);
  
  useEffect(() => {
    if (subtotal >= 150) {
      setShippingFee(0);
    } else if (state.toUpperCase() === 'TN' || state.toUpperCase() === 'TENNESSEE') {
      setShippingFee(5);
    } else {
      setShippingFee(10);
    }
  }, [state, subtotal]);

  // Discount reduction
  const discountAmount = appliedPromo 
    ? (appliedPromo.discountType === 'percentage' 
        ? Math.round((subtotal * appliedPromo.value) / 100) 
        : appliedPromo.value)
    : 0;

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(subtotalAfterDiscount * 0.0925); // Antioch TN sales tax is 9.25%
  const grandTotal = subtotalAfterDiscount + taxAmount + shippingFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    
    const matched = DISCOUNT_CODES.find(
      c => c.code.toUpperCase() === promoCode.trim().toUpperCase()
    );

    if (matched) {
      setAppliedPromo(matched as DiscountCode);
      setPromoSuccess(`Code ${matched.code} applied! Saved $${
        matched.discountType === 'percentage' 
          ? `${matched.value}%` 
          : `${matched.value}.00`
      }.`);
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code. Double-check and try again.');
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    setIsPaying(true);
    
    // Simulate real authorization logic
    setTimeout(() => {
      setIsPaying(false);
      const generatedOrder = {
        id: `TM-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString().split('T')[0],
        items: cartItems,
        subtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        grandTotal,
        shippingDetails: {
          name: `${firstName} ${lastName}`,
          address,
          city,
          state,
          zip,
          email,
          phone
        }
      };

      onOrderComplete(generatedOrder);
      onClearCart();
      setView('order-confirmation');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-10 py-10 text-left">
      <button
        onClick={() => setView('shop')}
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white pb-6 font-mono text-[10px] uppercase tracking-widest cursor-pointer group font-bold"
      >
        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
        <span>Return to Catalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Information Gathering / Stripe Checkout Form */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handlePay} className="space-y-6">
            
            {/* Section: Contact Information */}
            <div className="bg-[#0c0c0c] border border-white/5 rounded-none p-5 sm:p-6 space-y-4">
              <h3 className="text-xs font-mono text-zinc-440 uppercase tracking-widest font-bold pb-2 border-b border-white/5">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="email" className="text-[9px] font-mono text-zinc-500 uppercase font-bold block tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="e.g. waniisaggrey@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border border-white/10 text-xs text-white rounded-none p-3 focus:outline-none focus:border-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-[9px] font-mono text-zinc-500 uppercase font-bold block tracking-widest">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    placeholder="e.g. 615-715-2900"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent border border-white/10 text-xs text-white rounded-none p-3 focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section: Shipping Address */}
            <div className="bg-[#0c0c0c] border border-white/5 rounded-none p-5 sm:p-6 space-y-4">
              <h3 className="text-xs font-mono text-zinc-440 uppercase tracking-widest font-bold pb-2 border-b border-white/5">
                Shipping Address
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="first-name" className="text-[9px] font-mono text-zinc-500 uppercase font-bold block tracking-widest">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    required
                    placeholder="Waniis"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-transparent border border-white/10 text-xs text-white rounded-none p-3 focus:outline-none focus:border-white"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="last-name" className="text-[9px] font-mono text-zinc-500 uppercase font-bold block tracking-widest">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    required
                    placeholder="Aggrey"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-transparent border border-white/10 text-xs text-white rounded-none p-3 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="address" className="text-[9px] font-mono text-zinc-500 uppercase font-bold block tracking-widest">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  required
                  placeholder="Street / Unit Number"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent border border-white/10 text-xs text-white rounded-none p-3 focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label htmlFor="city" className="text-[9px] font-mono text-zinc-500 uppercase font-bold block tracking-widest">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    required
                    placeholder="Antioch"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-transparent border border-white/10 text-xs text-white rounded-none p-3 focus:outline-none focus:border-white"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="state" className="text-[9px] font-mono text-zinc-500 uppercase font-bold block tracking-widest">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    required
                    placeholder="TN"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-transparent border border-white/10 text-xs text-white rounded-none p-3 focus:outline-none focus:border-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="zip" className="text-[9px] font-mono text-zinc-500 uppercase font-bold block tracking-widest">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zip"
                    required
                    placeholder="37013"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full bg-transparent border border-white/10 text-xs text-white rounded-none p-3 focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section: Secure payment (Simulating Stripe setup) */}
            <div className="bg-[#0c0c0c] border border-white/5 rounded-none p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5 bg-black/10">
                <h3 className="text-xs font-mono text-zinc-440 uppercase tracking-widest font-bold flex items-center gap-2">
                  <CreditCard size={14} className="text-zinc-500" />
                  <span>Stripe Secure Gateway</span>
                </h3>
                <span className="text-[9px] font-mono text-zinc-500 border border-white/5 rounded-none px-2 py-0.5">
                  SANDBOX MODE ACTIVE
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <label htmlFor="card-name" className="text-[9px] font-mono text-zinc-500 uppercase font-bold block tracking-widest">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    id="card-name"
                    required
                    placeholder="e.g. Waniis Aggrey"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-transparent border border-white/10 text-xs text-white rounded-none p-3 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="card-number" className="text-[9px] font-mono text-zinc-500 uppercase font-bold block tracking-widest">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="card-number"
                    required
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-transparent border border-white/10 text-xs text-white rounded-none p-3 focus:outline-none focus:border-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="card-expiry" className="text-[9px] font-mono text-zinc-500 uppercase font-bold block tracking-widest">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      id="card-expiry"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-transparent border border-white/10 text-xs text-white rounded-none p-3 focus:outline-none focus:border-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="card-cvc" className="text-[9px] font-mono text-zinc-500 uppercase font-bold block tracking-widest">
                      CVV / CVC Code
                    </label>
                    <input
                      type="password"
                      id="card-cvc"
                      required
                      placeholder="242"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-transparent border border-white/10 text-xs text-white rounded-none p-3 focus:outline-none focus:border-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 pt-2 bg-transparent">
                <ShieldCheck size={14} className="text-zinc-650" />
                <span>PCI-Compliant transactions managed natively on Stripe secure servers.</span>
              </div>
            </div>

            {/* Submission validation */}
            <button
              id="checkout-pay-btn"
              type="submit"
              disabled={isPaying || cartItems.length === 0}
              className={`w-full bg-transparent hover:bg-[#e5e5e5] hover:text-black border border-white/20 hover:border-transparent text-white py-4 rounded-none text-[10px] tracking-widest font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-350 bg-black/20 ${
                isPaying ? 'bg-[#121212] text-zinc-650 cursor-not-allowed border-white/5' : ''
              }`}
            >
              {isPaying ? (
                <>
                  <div className="w-3 h-3 rounded-none border border-dashed border-zinc-500 animate-spin" />
                  <span>AUTHORIZING CREDIT PAYMENT...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={14} />
                  <span>TRANSMIT SECURE ORDER • ${grandTotal}.00</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Shopping Cart Review & Dynamic Promos */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <div className="bg-[#0c0c0c] border border-white/5 rounded-none p-5 sm:p-6 space-y-6">
            <h3 className="text-xs font-mono text-zinc-440 uppercase tracking-widest font-bold pb-2 border-b border-white/5 flex items-center justify-between">
              <span>Order Summary ({cartItems.length})</span>
              <span className="text-[10px] text-zinc-600 lowercase italic">Review before paying</span>
            </h3>

            {/* Cart list inside checkout */}
            <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-3 text-xs p-2.5 bg-black/40 rounded-none border border-white/5 text-left font-mono">
                  <div className="w-14 h-16 bg-zinc-950 rounded-none overflow-hidden flex-shrink-0 relative border border-white/5">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover grayscale opacity-75" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider text-[11px] line-clamp-1">{item.product.name}</h4>
                      <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-widest">Size: {item.selectedSize} / Color: {item.selectedColor}</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-zinc-455">
                      <span>QTY: {item.quantity}</span>
                      <span className="font-bold text-white">${item.product.price * item.quantity}.00</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo coupon form */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold block tracking-widest">Apply Discount Code</span>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. MIND20"
                  value={promoCode}
                  aria-label="Promo code input"
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-transparent border border-white/10 text-xs font-mono text-white rounded-none p-2.5 focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="bg-[#121212] hover:bg-white hover:text-black border border-white/10 hover:border-transparent text-[10px] text-white transition-colors font-mono uppercase px-4 py-2 rounded-none font-bold tracking-widest cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {promoError && (
                <div className="text-[10px] font-mono text-red-400">
                  ⚠️ {promoError}
                </div>
              )}
              {promoSuccess && (
                <div className="text-[10px] font-mono text-green-400 flex items-center gap-1">
                  <CheckCircle2 size={10} className="text-green-400 font-bold" />
                  <span>{promoSuccess}</span>
                </div>
              )}

              {/* Promo recommendation hint for better conversion */}
              <div className="bg-black/20 p-2.5 border border-dashed border-white/5 font-mono text-[9px] text-zinc-650 flex justify-between rounded-none">
                <span>⚡ HINT: Try code 'MIND20' (20% OFF) or 'TROUBLE15'</span>
              </div>
            </div>

            {/* Detailed financial breakdowns */}
            <div className="pt-4 border-t border-white/5 space-y-2.5 font-mono text-[11px] text-zinc-455">
              <div className="flex justify-between">
                <span>BASKET COST</span>
                <span className="text-zinc-300 font-bold">${subtotal}.00</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>SPECIAL DISCOUNT Applied</span>
                  <span>-${discountAmount}.00</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>ANTIOCH SECURE TAX (9.25%)</span>
                <span className="text-zinc-300 font-bold">${taxAmount}.00</span>
              </div>

              <div className="flex justify-between items-center text-zinc-500">
                <span className="flex items-center gap-1">
                  SHIPPING COURIER {state.toUpperCase() === 'TN' ? '(TN Route)' : '(National)'}
                </span>
                <span className="text-zinc-300 font-bold">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee}.00`}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between font-mono text-sm font-bold tracking-widest text-white">
              <span>ESTIMATED TOTAL DUE</span>
              <span>${grandTotal}.00</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
