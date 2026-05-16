import { cn } from '../../utils/cn';

function Select({ label, id, options, error, className, ...props }) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <label className="block space-y-2" htmlFor={id}>
      <span className="text-sm font-semibold text-ink-900">{label}</span>
      <select
        aria-describedby={errorId}
        aria-invalid={error ? 'true' : undefined}
        className={cn(
          'w-full rounded-2xl border border-mist-300 bg-white px-4 py-3 text-base text-ink-900',
          'focus:border-clay-500 focus:outline-none focus:ring-2 focus:ring-clay-200',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-100',
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
      {error ? (
        <span className="text-sm text-red-600" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}

export default Select;
