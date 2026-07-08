import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'outline' | 'ghost' | 'destructive';
type Size = 'default' | 'sm' | 'icon';

const variants: Record<Variant, string> = {
  default: 'bg-neutral-900 text-white hover:bg-neutral-700',
  outline: 'border border-neutral-300 bg-white hover:bg-neutral-100',
  ghost: 'hover:bg-neutral-100',
  destructive: 'bg-red-600 text-white hover:bg-red-500',
};

const sizes: Record<Size, string> = {
  default: 'h-9 px-4 text-sm',
  sm: 'h-8 px-3 text-xs',
  icon: 'h-8 w-8 p-0 text-sm',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
