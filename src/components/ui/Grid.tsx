import React from 'react';
import { cn } from '@/src/utils';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  tablet?: 1 | 2 | 3 | 4;
  desktop?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
}

export function Grid({ 
  children, 
  className, 
  gap = 'md',
  columns = 1,
  tablet,
  desktop
}: GridProps) {
  const gaps = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-12',
    xl: 'gap-24'
  };

  const cols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12'
  };

  const tabletCols = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  };

  const desktopCols = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
    12: 'lg:grid-cols-12'
  };

  return (
    <div className={cn(
      'grid', 
      gaps[gap], 
      cols[columns], 
      tablet && tabletCols[tablet], 
      desktop && desktopCols[desktop], 
      className
    )}>
      {children}
    </div>
  );
}
