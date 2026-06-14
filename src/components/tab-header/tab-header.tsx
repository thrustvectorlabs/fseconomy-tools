import { ReactNode } from 'react';

interface TabHeaderProps {
  actions?: ReactNode;
  subtitle?: string;
  title: string;
}

export const TabHeader = ({ actions, subtitle, title }: TabHeaderProps) => {
  return (
    <header className="fset-tab-header">
      <div className="fset-tab-header__row">
        <div className="fset-tab-header__copy">
          <h1 className="fset-tab-header__title">{title}</h1>
          {subtitle ? <p className="fset-tab-header__subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="fset-tab-header__actions">{actions}</div> : null}
      </div>
    </header>
  );
};
