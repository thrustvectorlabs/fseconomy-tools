import { OpenToggle } from '../open-toggle/open-toggle';
import { useStore } from '../../store/store';

interface NavigationItem {
  label: string;
  pageId: string;
}

interface NavigationProps {
  items: NavigationItem[];
}

export const Navigation = ({ items }: NavigationProps) => {
  const pageToShow = useStore((state) => state.pageToShow);
  const setPageToShow = useStore((state) => state.setPageToShow);
  const assignments = useStore((state) => state.assignments);
  const aircraft = useStore((state) => state.aircraft);
  const isFullscreen = useStore((state) => state.isFullscreen);
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
          <li key={pageId} className={`navigation__item${pageToShow === pageId ? ' navigation__item--active' : ''}`}>
            <button type="button" className="navigation__button" onClick={() => handleNavigationClick(pageId)}>
              <span className="navigation__label">{label}</span>
              {getItemCount(pageId) ? <span className="navigation__count">{getItemCount(pageId)}</span> : null}
            </button>
          </li>
        ))}
      </ul>
      <span className="navigation__badge-container">
        <button type="button" className="navigation__meta-button" onClick={() => toggleFullscreen()}>
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
        <OpenToggle />
      </span>
    </nav>
  );
};
