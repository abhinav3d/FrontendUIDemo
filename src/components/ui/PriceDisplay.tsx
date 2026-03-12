import React from 'react';
import { cn } from '@/src/utils';

interface PriceDisplayProps {
  amount: number;
  currencyCode?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  compareAtAmount?: number;
}

/**
 * Placeholder for Hydrogen Price component.
 * Built as a "dumb" UI component for Step 1.
 */
export function PriceDisplay({ 
  amount, 
  currencyCode = 'USD', 
  className,
  size = 'md',
  compareAtAmount
}: PriceDisplayProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  });

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl md:text-2xl',
    xl: 'text-3xl md:text-4xl'
  };

  return (
    <div className={cn('flex items-baseline gap-2 font-bold tracking-tight', className)}>
      <span className={cn(sizes[size])}>
        {formatter.format(amount)}
      </span>
      {compareAtAmount && compareAtAmount > amount && (
        <span className="text-sm text-neutral-400 line-through font-normal">
          {formatter.format(compareAtAmount)}
        </span>
      )}
    </div>
  );
}
