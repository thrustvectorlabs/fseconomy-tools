import { IS_DEV_BUILD } from '../../build-info';
import { OpenToggle } from '../open-toggle/open-toggle';
import { useStore } from '../../store/store';

interface NavigationItem {
  label: string;
  pageId: string;
}

interface NavigationProps {
  activePageId: string;
  items: NavigationItem[];
}

export const Navigation = ({ activePageId, items }: NavigationProps) => {
  const setPageToShow = useStore((state) => state.setPageToShow);
  const assignments = useStore((state) => state.assignments);
  const aircraft = useStore((state) => state.aircraft);
  const isDevelopmentMode = useStore((state) => state.isDevelopmentMode);
  const isFullscreen = useStore((state) => state.isFullscreen);
  const toggleDevelopmentMode = useStore((state) => state.toggleDevelopmentMode);
  const toggleFullscreen = useStore((state) => state.toggleFullscreen);

  // Helper to get the count based on the pageId
  const getItemCount = (pageId: string): string | undefined => {
    switch (pageId) {
      case 'assignments':
        return `(${assignments.length})`;
      case 'aircraft':
        return `(${aircraft.length})`;
      default:
        return undefined;
    }
  };

  const handleNavigationClick = (pageId: string) => {
    setPageToShow(pageId);
  };

  return (
    <nav className="navigation">
      <ul className="navigation__list">
        {items.map(({ label, pageId }) => (
          <li key={pageId} className={`navigation__item${activePageId === pageId ? ' navigation__item--active' : ''}`}>
            <button type="button" className="navigation__button" onClick={() => handleNavigationClick(pageId)}>
              <span className="navigation__label">{label}</span>
              {getItemCount(pageId) ? <span className="navigation__count">{getItemCount(pageId)}</span> : null}
            </button>
          </li>
        ))}
      </ul>
      <span className="navigation__badge-container">
        {IS_DEV_BUILD ? (
          <button type="button" className="navigation__meta-button" onClick={() => toggleDevelopmentMode()}>
            {isDevelopmentMode ? 'Disable Dev Mode' : 'Enable Dev Mode'}
          </button>
        ) : null}
        <button type="button" className="navigation__meta-button" onClick={() => toggleFullscreen()}>
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
        <OpenToggle />
      </span>
    </nav>
  );
};
