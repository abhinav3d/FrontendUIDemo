import React from 'react';
import { cn } from '@/src/utils';

interface StackProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
}

export function Stack({ 
  children, 
  className, 
  gap = 'md',
  align = 'stretch',
  justify = 'start'
}: StackProps) {
  const gaps = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-12',
    xl: 'gap-24'
  };

  const aligns = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifies = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={cn('flex flex-col', gaps[gap], aligns[align], justifies[justify], className)}>
      {children}
    </div>
  );
}
