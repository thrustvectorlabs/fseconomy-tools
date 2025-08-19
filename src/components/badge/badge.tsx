interface BadgeProps {
  small?: boolean;
  label?: string;
}

export const Badge = ({ small = false, label = 'FSE Tools' }: BadgeProps) => {
  return <span className={small ? 'fset-badge small' : 'fset-badge'}>{label}</span>;
};
