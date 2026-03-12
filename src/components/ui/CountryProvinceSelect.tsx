import React from 'react';
import { cn } from '@/src/utils';

interface CountryProvinceSelectProps {
  label?: string;
  className?: string;
  // Placeholder props for future Hydrogen data
}

/**
 * Placeholder for Country/Province selection logic.
 * Built as a "dumb" UI component for Step 1.
 */
export function CountryProvinceSelect({ 
  label = 'Country/Region', 
  className 
}: CountryProvinceSelectProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
        {label}
      </label>
      <select className="w-full h-12 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-white/5 focus:outline-none focus:ring-1 focus:ring-commerce appearance-none">
        <option value="US">United States</option>
        <option value="CA">Canada</option>
        <option value="GB">United Kingdom</option>
        <option value="AU">Australia</option>
      </select>
    </div>
  );
}
