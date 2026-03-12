import React from 'react';
import { cn } from '@/src/utils';

interface AspectRatioProps {
  children: React.ReactNode;
  ratio?: '1/1' | '4/5' | '16/9' | '9/16';
  className?: string;
}

/**
 * Strictly enforces aspect ratio for content, especially images.
 * Default is 1/1 as per platform requirements.
 */
export function AspectRatio({ 
  children, 
  ratio = '1/1', 
  className 
}: AspectRatioProps) {
  const ratios = {
    '1/1': 'aspect-square',
    '4/5': 'aspect-[4/5]',
    '16/9': 'aspect-video',
    '9/16': 'aspect-[9/16]'
  };

  return (
    <div className={cn('relative w-full overflow-hidden', ratios[ratio], className)}>
      <div className="absolute inset-0 w-full h-full">
        {children}
      </div>
    </div>
  );
}
