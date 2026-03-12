import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  Lock, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { cn } from '../utils';

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

  const cartItems = [
    { id: 1, name: 'Realistic Portrait', style: 'Realistic', size: '15cm', material: 'Matte Resin', price: 149 }
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Checkout Flow */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex-grow h-1 rounded-full transition-colors",
              step === 'shipping' || step === 'payment' ? "bg-commerce" : "bg-neutral-200 dark:bg-neutral-800"
            )} />
            <div className={cn(
              "flex-grow h-1 rounded-full transition-colors",
              step === 'payment' ? "bg-commerce" : "bg-neutral-200 dark:bg-neutral-800"
            )} />
          </div>

          <div className="p-8 bg-neutral-50 dark:bg-neutral-950 rounded-[3rem] border border-black/5 dark:border-white/5 space-y-12">
            {step === 'shipping' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 text-commerce">
                  <Truck size={20} />
                  <h3 className="text-xl font-bold">Shipping Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">First Name</label>
                    <input type="text" placeholder="John" className="w-full p-4 rounded-2xl bg-white dark:bg-black border border-black/5 dark:border-white/5 text-sm outline-none focus:border-commerce transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Last Name</label>
                    <input type="text" placeholder="Doe" className="w-full p-4 rounded-2xl bg-white dark:bg-black border border-black/5 dark:border-white/5 text-sm outline-none focus:border-commerce transition-colors" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Address</label>
                    <input type="text" placeholder="123 Sculpting Way" className="w-full p-4 rounded-2xl bg-white dark:bg-black border border-black/5 dark:border-white/5 text-sm outline-none focus:border-commerce transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">City</label>
                    <input type="text" placeholder="New York" className="w-full p-4 rounded-2xl bg-white dark:bg-black border border-black/5 dark:border-white/5 text-sm outline-none focus:border-commerce transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Postal Code</label>
                    <input type="text" placeholder="10001" className="w-full p-4 rounded-2xl bg-white dark:bg-black border border-black/5 dark:border-white/5 text-sm outline-none focus:border-commerce transition-colors" />
                  </div>
                </div>

                <button 
                  onClick={() => setStep('payment')}
                  className="w-full py-4 bg-commerce text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  Continue to Payment <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 text-commerce">
                  <CreditCard size={20} />
                  <h3 className="text-xl font-bold">Payment Method</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-white dark:bg-black rounded-2xl border border-commerce flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-neutral-100 dark:bg-neutral-900 rounded flex items-center justify-center">
                        <CreditCard size={18} className="text-neutral-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Credit / Debit Card</p>
                        <p className="text-xs text-neutral-500">Secure encrypted payment</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-4 border-commerce" />
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Card Number</label>
                      <input type="text" placeholder="**** **** **** 4401" className="w-full p-4 rounded-2xl bg-white dark:bg-black border border-black/5 dark:border-white/5 text-sm outline-none focus:border-commerce transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" className="w-full p-4 rounded-2xl bg-white dark:bg-black border border-black/5 dark:border-white/5 text-sm outline-none focus:border-commerce transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">CVC</label>
                        <input type="text" placeholder="***" className="w-full p-4 rounded-2xl bg-white dark:bg-black border border-black/5 dark:border-white/5 text-sm outline-none focus:border-commerce transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-commerce/5 rounded-2xl border border-commerce/20 flex items-center gap-4">
                  <ShieldCheck className="text-commerce" size={24} />
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Your transaction is secured with 256-bit SSL encryption. We do not store your full card details.
                  </p>
                </div>

                <button 
                  onClick={() => navigate('/order-confirmation')}
                  className="w-full py-4 bg-commerce text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  Complete Purchase <Lock size={18} />
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="p-8 bg-neutral-50 dark:bg-neutral-950 rounded-[3rem] border border-black/5 dark:border-white/5 space-y-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Order Summary</h3>
              
              <div className="space-y-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5">
                      <img src={`https://picsum.photos/seed/cart${item.id}/200/200`} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow space-y-1">
                      <h4 className="text-sm font-bold">{item.name}</h4>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{item.style} • {item.size}</p>
                      <p className="text-sm font-bold font-mono text-commerce">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-black/5 dark:border-white/5 space-y-3">
                <div className="flex justify-between items-center text-xs text-neutral-500">
                  <span>Subtotal</span>
                  <span className="font-mono">${total}.00</span>
                </div>
                <div className="flex justify-between items-center text-xs text-neutral-500">
                  <span>Shipping</span>
                  <span className="font-mono">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/5">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-bold font-mono text-commerce">${total}.00</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              <Lock size={12} /> Secure Checkout
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
