import React from 'react';
import { cn } from '@/src/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export function Skeleton({ 
  className, 
  variant = 'rect' 
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-neutral-100 dark:bg-neutral-900',
        variant === 'circle' && 'rounded-full',
        variant === 'rect' && 'rounded-3xl',
        variant === 'text' && 'h-4 w-full rounded-md',
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-2/3" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    </div>
  );
}

export default Skeleton;
