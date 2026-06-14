import { BUILD_TIME, IS_DEV_BUILD, PACKAGE_VERSION } from '../../build-info';

interface BadgeProps {
  small?: boolean;
  label?: string;
  showBuildVersion?: boolean;
}

export const Badge = ({ small = false, label = 'FSE Tools', showBuildVersion = false }: BadgeProps) => {
  const versionLabel = showBuildVersion && !IS_DEV_BUILD ? `v${PACKAGE_VERSION}` : null;

  return (
    <span className={small ? 'fset-badge small' : 'fset-badge'} title={`Built ${BUILD_TIME}`}>
      <span className="fset-badge__label">{label}</span>
      {versionLabel ? <span className="fset-badge__meta">{versionLabel}</span> : null}
    </span>
  );
};
