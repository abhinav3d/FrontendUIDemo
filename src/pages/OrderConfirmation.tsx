import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Package, 
  Truck, 
  Mail, 
  Calendar,
  ExternalLink
} from 'lucide-react';

export default function OrderConfirmation() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center space-y-12">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="w-24 h-24 bg-commerce rounded-full flex items-center justify-center text-white mx-auto shadow-2xl shadow-commerce/20"
      >
        <CheckCircle2 size={48} />
      </motion.div>

      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tighter uppercase italic leading-[0.9]">
          Order <br />
          <span className="text-commerce">Confirmed</span>
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
          Thank you for choosing Base44. Your custom 3D sculpt transformation has officially begun.
        </p>
      </div>

      <div className="p-12 bg-neutral-50 dark:bg-neutral-950 rounded-[3rem] border border-black/5 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Order Number</p>
            <p className="text-xl font-bold font-mono">#4401-2026</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Estimated Delivery</p>
            <p className="text-xl font-bold">April 15, 2026</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Next Steps</p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-commerce/10 flex items-center justify-center text-commerce text-[10px] font-bold">1</div>
                <span>Artist assignment (24h)</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-commerce/10 flex items-center justify-center text-commerce text-[10px] font-bold">2</div>
                <span>Initial digital sculpt</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-commerce/10 flex items-center justify-center text-commerce text-[10px] font-bold">3</div>
                <span>Review & Approval</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link 
          to="/workspace" 
          className="px-8 py-4 bg-commerce text-white rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform flex items-center justify-center gap-2"
        >
          Go to Workspace <ArrowRight size={18} />
        </Link>
        <Link 
          to="/gallery" 
          className="px-8 py-4 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center"
        >
          Browse More
        </Link>
      </div>

      <div className="pt-12 flex flex-col items-center gap-6">
        <p className="text-xs text-neutral-400 uppercase tracking-widest">Stay Updated</p>
        <div className="flex gap-8">
          <div className="flex items-center gap-2 text-neutral-500 hover:text-commerce transition-colors cursor-pointer">
            <Mail size={16} />
            <span className="text-xs font-bold">Email Notifications</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-500 hover:text-commerce transition-colors cursor-pointer">
            <Calendar size={16} />
            <span className="text-xs font-bold">Add to Calendar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
