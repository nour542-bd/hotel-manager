import clsx from 'clsx';

export function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={clsx(
        'w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500',
        'focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary',
        'transition-colors',
        className
      )}
      {...props}
    />
  );
}
