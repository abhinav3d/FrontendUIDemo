import React from 'react';
import { cn } from '@/src/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ 
  src, 
  alt, 
  fallback, 
  size = 'md', 
  className 
}: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-base',
    xl: 'h-24 w-24 text-xl'
  };

  return (
    <div className={cn(
      'relative flex shrink-0 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800 border border-black/5 dark:border-white/5',
      sizes[size],
      className
    )}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="aspect-square h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-bold uppercase text-neutral-400">
          {fallback || alt?.charAt(0) || '?'}
        </div>
      )}
    </div>
  );
}
