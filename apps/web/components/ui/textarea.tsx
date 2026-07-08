import * as React from 'react';
import { cn } from '@/lib/utils';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'min-h-[72px] w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900',
      'placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
