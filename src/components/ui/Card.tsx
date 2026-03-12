import React from 'react';
import { cn } from '@/src/utils';
import { Reveal } from './Reveal';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'muted' | 'accent' | 'glass' | 'dark';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  delay?: number;
}

export function Card({ 
  children, 
  className, 
  variant = 'default',
  padding = 'md',
  delay
}: CardProps) {
  const variants = {
    default: 'bg-white dark:bg-neutral-950 border border-black/5 dark:border-white/5',
    muted: 'bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-white/5',
    accent: 'bg-commerce/5 border border-commerce/20',
    glass: 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10',
    dark: 'bg-neutral-900 text-white border-white/5'
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-12'
  };

  const content = (
    <div className={cn(
      'rounded-[2.5rem] overflow-hidden transition-all',
      variants[variant],
      paddings[padding],
      className
    )}>
      {children}
    </div>
  );

  if (delay !== undefined) {
    return <Reveal delay={delay}>{content}</Reveal>;
  }

  return content;
}

export default Card;
