import React from 'react';
import { cn } from '@/src/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  width?: 'default' | 'narrow' | 'wide' | 'full';
}

export function Container({ 
  children, 
  className, 
  width = 'default' 
}: ContainerProps) {
  const widths = {
    default: 'max-w-7xl',
    narrow: 'max-w-3xl',
    wide: 'max-w-screen-2xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn('mx-auto px-6 w-full', widths[width], className)}>
      {children}
    </div>
  );
}
