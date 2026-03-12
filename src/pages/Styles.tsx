import React, { useState, useMemo } from 'react';
import { Check, Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { STYLE_DATA, StyleTemplate } from '../data/styleData';
import { cn } from '../utils';
import { CardSkeleton } from '../components/ui/Skeleton';

const StyleCard = ({ template, index }: { template: StyleTemplate; index: number }) => (
  <Card delay={index * 0.05} className="group space-y-6 p-6 hover:border-commerce transition-all duration-500">
    <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden relative">
      <img 
        src={template.thumbnailUrl || `https://picsum.photos/seed/${template.styleKey}/800/800`} 
        alt={template.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
        <Sparkles size={10} className="text-commerce" />
        {template.aiCoinCost} Coins
      </div>
    </div>
    
    <div className="space-y-3">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          Subject: {template.aiWorkflowSpec.inputPolicy.subject}
        </span>
        <h3 className="text-xl font-bold tracking-tight leading-tight">{template.name}</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500 bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded-md">
          <Check size={10} className="text-commerce" />
          AI Optimized
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500 bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded-md">
          <Check size={10} className="text-commerce" />
          3D Ready
        </div>
      </div>
    </div>

    <div className="pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
      <Button variant="secondary" size="sm" className="w-full">
        Select Aesthetic
      </Button>
    </div>
  </Card>
);

export default function Styles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredTemplates = useMemo(() => {
    return STYLE_DATA.templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           template.styleKey.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGroup = !selectedGroup || template.groupId === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [searchQuery, selectedGroup]);

  const handleGroupChange = (groupId: string | null) => {
    setIsLoading(true);
    setSelectedGroup(groupId);
    setTimeout(() => setIsLoading(false), 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-16">
      <SectionHeader 
        title="Choose Your"
        highlight="Aesthetic"
        subtitle="Browse our curated library of AI-optimized sculpting styles. Each template is engineered for specific subjects and production outcomes."
      />

      {/* Filters & Search */}
      <div className="sticky top-20 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md py-4 -mx-6 px-6 border-y border-black/5 dark:border-white/5">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            <button
              onClick={() => handleGroupChange(null)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                !selectedGroup 
                  ? "bg-commerce text-white shadow-lg shadow-commerce/20" 
                  : "bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              )}
            >
              All Styles
            </button>
            {STYLE_DATA.groups.map(group => (
              <button
                key={group.id}
                onClick={() => handleGroupChange(group.id)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  selectedGroup === group.id 
                    ? "bg-commerce text-white shadow-lg shadow-commerce/20" 
                    : "bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                )}
              >
                {group.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text"
              placeholder="Search styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-neutral-100 dark:bg-neutral-900 border-none text-sm outline-none focus:ring-2 focus:ring-commerce/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CardSkeleton />
              </motion.div>
            ))
          ) : filteredTemplates.length > 0 ? (
            filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <StyleCard template={template} index={index} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center space-y-4">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                <Filter size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">No styles found</h3>
                <p className="text-sm text-neutral-500">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
              <Button variant="secondary" onClick={() => { setSearchQuery(''); handleGroupChange(null); }}>
                Clear all filters
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Section */}
      <Card className="p-12 bg-commerce text-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight leading-tight">
              Can't find the perfect <br />
              <span className="italic">aesthetic?</span>
            </h2>
            <p className="text-white/80 leading-relaxed">
              Our artists can develop custom style profiles for enterprise clients or unique production requirements. Contact our studio to discuss bespoke sculpting workflows.
            </p>
            <div className="flex gap-4 pt-4">
              <Button className="bg-white text-commerce hover:bg-neutral-100">Contact Studio</Button>
              <Button variant="secondary" className="border-white/20 text-white hover:bg-white/10">View Custom Work</Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="aspect-video bg-white/10 rounded-3xl backdrop-blur-md border border-white/10 flex items-center justify-center">
              <SlidersHorizontal size={48} className="text-white/40" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
