import { BUILD_TIME } from '../../build-info';

interface BadgeProps {
  small?: boolean;
  label?: string;
}

export const Badge = ({ small = false, label = 'FSE Tools' }: BadgeProps) => {
  const showBuildTime = label === 'FSE Tools' && !small;

  return (
    <span className={small ? 'fset-badge small' : 'fset-badge'} title={showBuildTime ? `Built ${BUILD_TIME}` : undefined}>
      <span className="fset-badge__label">{label}</span>
      {showBuildTime ? <span className="fset-badge__meta">Built {BUILD_TIME}</span> : null}
    </span>
  );
};
