
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// This is a wrapper around the shadcn Button component to ensure consistent rounded corners
export interface ButtonProps extends ShadcnButtonProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <ShadcnButton
        className={cn("rounded-xl", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
