import clsx from 'clsx';

export function Card({ children, className, ...props }) {
  return (
    <div className={clsx('bg-slate-900 border border-slate-700 rounded-lg p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={clsx('mb-4 pb-4 border-b border-slate-700', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h2 className={clsx('text-2xl font-bold text-white', className)} {...props}>
      {children}
    </h2>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={clsx('', className)} {...props}>
      {children}
    </div>
  );
}
