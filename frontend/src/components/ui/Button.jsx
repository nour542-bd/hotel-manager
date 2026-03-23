import clsx from 'clsx';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-secondary hover:bg-amber-600 text-white',
    secondary: 'bg-primary hover:bg-slate-800 text-white border border-slate-700',
    outline: 'border border-secondary text-secondary hover:bg-secondary hover:text-white',
    destructive: 'bg-destructive hover:bg-red-600 text-white',
    ghost: 'text-slate-300 hover:bg-slate-800',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
