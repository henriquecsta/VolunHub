import { Link } from 'react-router-dom';
import logoUrl from '../../assets/images/volunhub-logo.png';
import { ROUTES } from '../../constants/routes';
import { cn } from '../../utils/cn';

const sizeClassNames = {
  sm: 'h-14 w-14',
  md: 'h-20 w-20',
  lg: 'h-28 w-28',
};

function BrandLogo({ className, linkTo = ROUTES.HOME, size = 'md' }) {
  const image = (
    <>
      <img
        alt="VolunHub"
        className={cn(
          'rounded-lg border border-mist-200 bg-white object-contain p-1 shadow-sm',
          sizeClassNames[size],
          className,
        )}
        src={logoUrl}
      />
      <span className="sr-only">VolunHub</span>
    </>
  );

  if (!linkTo) {
    return image;
  }

  return (
    <Link aria-label="VolunHub" className="inline-flex shrink-0 items-center" to={linkTo}>
      {image}
    </Link>
  );
}

export default BrandLogo;
