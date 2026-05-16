import { useRef } from 'react';
import { useStore } from '../../store/store';
import { OpenToggle } from '../open-toggle/open-toggle';
import { AssignmentsPage } from '../pages/assignments';
import { SearchPage } from '../pages/search';
import { Navigation } from '../navigation/navigation';
import { AircraftPage } from '../pages/aircraft';
import { ConsolidatedPage } from '../pages/consolidated';
import { DebugPage } from '../pages/debug';
import { getMatchingSiteEnhancer } from '../../site-enhancers/registry';
import { TabHeader } from '../tab-header/tab-header';

export const App = () => {
  const store = useStore();
  const isFullscreen = useStore((state) => state.isFullscreen);
  const matchingSiteEnhancer = getMatchingSiteEnhancer();
  const hasDebugPage = !!matchingSiteEnhancer;
  const activePage = !hasDebugPage && store.pageToShow === 'debug' ? 'search' : store.pageToShow;
  const contentRef = useRef<HTMLDivElement | null>(null);

  const pageMetaById = {
    search: {
      title: 'Search',
      subtitle: 'Search nearby rentable aircraft and build assignment lists.',
      content: <SearchPage />,
    },
    assignments: {
      title: 'Assignments',
      subtitle: 'Review the assignments collected from your last search.',
      content: <AssignmentsPage />,
    },
    aircraft: {
      title: 'Aircraft',
      subtitle: 'Review the aircraft collected from your last search.',
      content: <AircraftPage />,
    },
    consolidated: {
      title: 'Optimized for Passenger Payload',
      subtitle: 'Group assignments by airport and destination to maximize passenger revenue.',
      content: <ConsolidatedPage />,
    },
    debug: {
      title: 'Debug',
      subtitle: 'Inspect page-specific enhancer state and extracted data.',
      content: <DebugPage />,
    },
  } as const;

  const activePageMeta = pageMetaById[activePage as keyof typeof pageMetaById] ?? pageMetaById.search;

  if (!document.querySelector('.user-data')) {
    // User is not logged in.
    return null;
  }

  return (
    <div className={`fset-shell${store.isOpen ? ' fset-shell--open' : ''}${isFullscreen ? ' fset-shell--fullscreen' : ''}`}>
      {store.isOpen ? (
        <div id="fset-tools-menu">
          <div className="fset-tools-menu__frame">
            <Navigation
              items={[
                { label: 'Search', pageId: 'search' },
                { label: 'Assignments', pageId: 'assignments' },
                { label: 'Aircraft', pageId: 'aircraft' },
                { label: 'Optimized for Passenger Payload', pageId: 'consolidated' },
                ...(hasDebugPage ? [{ label: `Debug: ${matchingSiteEnhancer.debugLabel}`, pageId: 'debug' }] : []),
                // { label: 'Settings', pageId: 'settings' },
              ]}
            />
            <div className="fset-tools-menu__main">
              <TabHeader title={activePageMeta.title} subtitle={activePageMeta.subtitle} />
              <div ref={contentRef} className="fset-tools-menu__content">
                {activePageMeta.content}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="fset-tools-menu-caller">
          <OpenToggle />
        </div>
      )}
    </div>
  );
};
