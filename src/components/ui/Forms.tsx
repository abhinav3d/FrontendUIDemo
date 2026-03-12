import React from 'react';
import { cn } from '@/src/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full h-12 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-white/5 focus:outline-none focus:ring-1 focus:ring-commerce transition-all placeholder:text-neutral-400',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full min-h-[120px] p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-white/5 focus:outline-none focus:ring-1 focus:ring-commerce transition-all placeholder:text-neutral-400 resize-none',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{error}</p>}
    </div>
  );
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cn('flex items-center gap-3 cursor-pointer group', className)}>
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          className="peer sr-only"
          {...props}
        />
        <div className="h-5 w-5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 peer-checked:bg-commerce peer-checked:border-commerce transition-all" />
        <svg
          className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={4}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
        {label}
      </span>
    </label>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            'w-full h-12 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-white/5 focus:outline-none focus:ring-1 focus:ring-commerce transition-all appearance-none',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{error}</p>}
    </div>
  );
}
