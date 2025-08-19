import { useStore } from '../../store/store';
import { OpenToggle } from '../open-toggle/open-toggle';
import { AssignmentsPage } from '../pages/assignments';
import { SearchPage } from '../pages/search';
import { Navigation } from '../navigation/navigation';
import { AircraftPage } from '../pages/aircraft';
import { ConsolidatedPage } from '../pages/consolidated';

export const App = () => {
  const store = useStore();
  const isOpen = useStore().isOpen;

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
              // { label: 'Settings', pageId: 'settings' },
            ]}
          />
          {store.pageToShow === 'search' && <SearchPage />}
          {store.pageToShow === 'assignments' && <AssignmentsPage />}
          {store.pageToShow === 'consolidated' && <ConsolidatedPage />}
          {store.pageToShow === 'aircraft' && <AircraftPage />}
        </div>
      ) : (
        <div id="fset-tools-menu-caller">
          <OpenToggle />
        </div>
      )}
    </>
  );
};
