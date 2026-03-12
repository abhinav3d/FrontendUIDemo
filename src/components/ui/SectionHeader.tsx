import React from 'react';
import { cn } from '@/src/utils';

interface SectionHeaderProps {
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({ 
  title, 
  highlight, 
  subtitle, 
  align = 'left',
  className 
}: SectionHeaderProps) {
  return (
    <div className={cn(
      'space-y-4 max-w-3xl', 
      align === 'center' && 'mx-auto text-center',
      className
    )}>
      <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase italic leading-[0.9]">
        {title} {highlight && <span className="text-commerce">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
