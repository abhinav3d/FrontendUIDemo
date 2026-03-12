import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ 
  tabs, 
  activeTab, 
  onChange, 
  className 
}: TabsProps) {
  return (
    <div className={cn('flex p-1 bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-black/5 dark:border-white/5', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors z-10',
              isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-commerce rounded-xl -z-10 shadow-lg shadow-commerce/20"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
