import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus, 
  Search, 
  MessageSquare, 
  ArrowRight,
  HelpCircle,
  Sparkles,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../utils';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';

const FAQAccordion = ({ item, id, isOpen, onToggle }: any) => (
  <div 
    className={cn(
      "rounded-[2rem] border transition-all overflow-hidden",
      isOpen 
        ? "bg-neutral-50 dark:bg-neutral-950 border-commerce/20" 
        : "bg-white dark:bg-black border-black/5 dark:border-white/5 hover:border-commerce/20"
    )}
  >
    <button 
      onClick={() => onToggle(id)}
      className="w-full p-8 flex items-center justify-between text-left"
    >
      <span className="text-lg font-bold tracking-tight">{item.q}</span>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
        isOpen ? "bg-commerce text-white" : "bg-neutral-100 dark:bg-neutral-900 text-neutral-400"
      )}>
        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-8 pb-8"
        >
          <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {item.a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSidebar = () => (
  <div className="sticky top-24 space-y-8">
    <Card variant="accent" className="p-10 space-y-6 shadow-2xl shadow-commerce/20">
      <MessageSquare size={32} />
      <div className="space-y-2">
        <h3 className="text-2xl font-bold tracking-tight">Still have questions?</h3>
        <p className="text-white/70 text-sm leading-relaxed">
          Our support team is available 24/7 to help you with your custom production.
        </p>
      </div>
      <button className="w-full py-4 bg-white text-commerce rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform flex items-center justify-center gap-2">
        Contact Support <ArrowRight size={16} />
      </button>
    </Card>

    <Card variant="muted" className="p-10 space-y-8">
      <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Quick Links</h4>
      <div className="space-y-6">
        {[
          { icon: <Sparkles size={18} />, label: "Style Guide" },
          { icon: <Truck size={18} />, label: "Shipping Rates" },
          { icon: <ShieldCheck size={18} />, label: "Refund Policy" }
        ].map((link, idx) => (
          <div key={idx} className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-black border border-black/5 dark:border-white/5 flex items-center justify-center text-commerce group-hover:scale-110 transition-transform">
              {link.icon}
            </div>
            <span className="text-sm font-bold group-hover:text-commerce transition-colors">{link.label}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const faqs = [
  {
    category: "Process",
    questions: [
      {
        q: "How does the AI transformation work?",
        a: "Our proprietary AI engine analyzes your 2D images to generate a high-fidelity 3D mesh. This mesh is then hand-refined by our professional artists to ensure anatomical accuracy and artistic integrity before production."
      },
      {
        q: "What kind of photos should I upload?",
        a: "For the best results, provide high-resolution photos with clear lighting. Front, profile, and 45-degree angles are ideal. Avoid heavy shadows or filters that obscure facial features."
      },
      {
        q: "Can I request revisions?",
        a: "Yes! Every order includes a digital review stage. You'll be able to view the 3D sculpt in your workspace and request adjustments before we proceed to physical production."
      }
    ]
  },
  {
    category: "Production",
    questions: [
      {
        q: "What materials do you use?",
        a: "We primarily use high-grade matte resin for its superior detail retention. We also offer premium bronze-infused composites and full-color sandstone for specific styles."
      },
      {
        q: "How long does production take?",
        a: "Standard production takes 4-6 weeks. This includes the digital sculpting phase (1-2 weeks), physical printing and hand-finishing (2 weeks), and quality control."
      }
    ]
  },
  {
    category: "Shipping & Returns",
    questions: [
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship globally from our London studio. Shipping rates and delivery times vary by region and are calculated at checkout."
      },
      {
        q: "What is your refund policy?",
        a: "Due to the highly custom nature of our work, we cannot offer full refunds once sculpting has begun. However, we offer a satisfaction guarantee during the digital review stage."
      }
    ]
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-commerce/5 text-commerce rounded-full text-[10px] font-bold uppercase tracking-widest"
        >
          <HelpCircle size={14} /> Knowledge Base
        </motion.div>
        
        <SectionHeader 
          title="Frequently Asked"
          highlight="Questions"
          align="center"
        />
        
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for a topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-6 pl-16 rounded-[2rem] bg-neutral-50 dark:bg-neutral-950 border border-black/5 dark:border-white/5 text-lg outline-none focus:border-commerce transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-16">
          {faqs.map((category, catIdx) => (
            <div key={catIdx} className="space-y-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 px-4">{category.category}</h3>
              <div className="space-y-4">
                {category.questions.map((item, qIdx) => (
                  <FAQAccordion 
                    key={qIdx} 
                    item={item} 
                    id={`${catIdx}-${qIdx}`} 
                    isOpen={openIndex === `${catIdx}-${qIdx}`} 
                    onToggle={toggleFAQ} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <FAQSidebar />
        </div>
      </div>
    </div>
  );
}
