import React from 'react';
import { cn } from '@/src/utils';

interface ClusterProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: 'wrap' | 'nowrap' | 'reverse';
}

export function Cluster({ 
  children, 
  className, 
  gap = 'sm',
  align = 'center',
  justify = 'start',
  wrap = 'wrap'
}: ClusterProps) {
  const gaps = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-12'
  };

  const aligns = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  };

  const justifies = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  const wraps = {
    wrap: 'flex-wrap',
    nowrap: 'flex-nowrap',
    reverse: 'flex-wrap-reverse'
  };

  return (
    <div className={cn('flex', gaps[gap], aligns[align], justifies[justify], wraps[wrap], className)}>
      {children}
    </div>
  );
}
