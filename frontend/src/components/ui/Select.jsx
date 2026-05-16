import { cn } from '../../utils/cn';

function Select({ label, id, options, error, className, ...props }) {
  return (
    <label className="block space-y-2" htmlFor={id}>
      <span className="text-sm font-semibold text-ink-900">{label}</span>
      <select
        className={cn(
          'w-full rounded-2xl border border-mist-300 bg-white px-4 py-3 text-base text-ink-900',
          'focus:border-clay-500 focus:outline-none focus:ring-2 focus:ring-clay-200',
          className,
        )}
        id={id}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

export default Select;
