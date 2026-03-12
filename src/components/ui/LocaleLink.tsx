import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface LocaleLinkProps extends LinkProps {
  // In a real Hydrogen app, this would handle locale prefixing
}

/**
 * Placeholder for Hydrogen LocaleLink.
 * Currently just a wrapper around react-router-dom Link.
 */
export function LocaleLink({ children, to, ...props }: LocaleLinkProps) {
  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  );
}
