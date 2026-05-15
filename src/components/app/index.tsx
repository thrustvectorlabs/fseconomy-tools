import { useStore } from '../../store/store';
import { OpenToggle } from '../open-toggle/open-toggle';
import { AssignmentsPage } from '../pages/assignments';
import { SearchPage } from '../pages/search';
import { Navigation } from '../navigation/navigation';
import { AircraftPage } from '../pages/aircraft';
import { ConsolidatedPage } from '../pages/consolidated';
import { DebugPage } from '../pages/debug';
import { getMatchingSiteEnhancer } from '../../site-enhancers/registry';

export const App = () => {
  const store = useStore();
  const isOpen = useStore().isOpen;
  const matchingSiteEnhancer = getMatchingSiteEnhancer();
  const hasDebugPage = !!matchingSiteEnhancer;
  const activePage = !hasDebugPage && store.pageToShow === 'debug' ? 'search' : store.pageToShow;

  if (!document.querySelector('.user-data')) {
    // User is not logged in.
    return null;
  }

  const wrapper = document.querySelector('#wrapper');
  if (wrapper) {
    if (isOpen) {
      wrapper.classList.add('collapsed');
    } else {
      wrapper.classList.remove('collapsed');
    }
  }

  return (
    <>
      {store.isOpen ? (
        <div id="fset-tools-menu">
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
          {activePage === 'search' && <SearchPage />}
          {activePage === 'assignments' && <AssignmentsPage />}
          {activePage === 'consolidated' && <ConsolidatedPage />}
          {activePage === 'aircraft' && <AircraftPage />}
          {activePage === 'debug' && <DebugPage />}
        </div>
      ) : (
        <div id="fset-tools-menu-caller">
          <OpenToggle />
        </div>
      )}
    </>
  );
};
