import React from 'react';
import { cn } from '@/src/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  as?: React.ElementType;
  id?: string;
}

export function Section({ 
  children, 
  className, 
  padding = 'md',
  as: Component = 'section',
  id
}: SectionProps) {
  const paddings = {
    none: 'py-0',
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-24',
    lg: 'py-24 md:py-32',
    xl: 'py-32 md:py-48'
  };

  const classes = cn(paddings[padding], className);

  if (Component === 'div') return <div id={id} className={classes}>{children}</div>;
  if (Component === 'main') return <main id={id} className={classes}>{children}</main>;
  if (Component === 'article') return <article id={id} className={classes}>{children}</article>;
  
  return (
    <section id={id} className={classes}>
      {children}
    </section>
  );
}

export default Section;
