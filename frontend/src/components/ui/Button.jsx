import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-clay-500 text-white hover:bg-clay-600',
  secondary: 'bg-forest-500 text-white hover:bg-forest-600',
  ghost: 'bg-white/70 text-ink-900 hover:bg-white',
  outline: 'border border-forest-500 text-forest-600 hover:bg-forest-500 hover:text-white',
};

const sizes = {
  md: 'px-5 py-3 text-base',
  sm: 'px-4 py-2 text-sm',
};

function buttonClassName({ variant, size, fullWidth, className, disabled }) {
  return cn(
    'inline-flex items-center justify-center rounded-full font-semibold transition duration-200',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-500',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    disabled && 'cursor-not-allowed opacity-60',
    className,
  );
}

function Button({
  children,
  to,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  ...props
}) {
  const classes = buttonClassName({
    variant,
    size,
    fullWidth,
    className,
    disabled: props.disabled,
  });

  if (to) {
    return (
      <Link className={classes} to={to}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}

export default Button;
