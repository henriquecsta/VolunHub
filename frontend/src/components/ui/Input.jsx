import { cn } from '../../utils/cn';

function Input({ label, id, error, className, ...props }) {
  return (
    <label className="block space-y-2" htmlFor={id}>
      <span className="text-sm font-semibold text-ink-900">{label}</span>
      <input
        className={cn(
          'w-full rounded-2xl border border-mist-300 bg-white px-4 py-3 text-base text-ink-900',
          'placeholder:text-slate-400 focus:border-clay-500 focus:outline-none focus:ring-2 focus:ring-clay-200',
          className,
        )}
        id={id}
        {...props}
      />
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

export default Input;
