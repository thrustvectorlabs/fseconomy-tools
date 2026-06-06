import { useRef } from 'react';
import { useStore } from '../../store/store';
import { OpenToggle } from '../open-toggle/open-toggle';
import { SearchPage } from '../pages/search';
import { Navigation } from '../navigation/navigation';
import { TabHeader } from '../tab-header/tab-header';

export const App = () => {
  const store = useStore();
  const isFullscreen = useStore((state) => state.isFullscreen);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const pageMetaById = {
    search: {
      title: 'FSE Tools (FSET)',
      subtitle: 'Current build information and release status.',
      content: <SearchPage />,
    },
  } as const;

  const activePage = store.pageToShow in pageMetaById ? store.pageToShow : 'search';
  const activePageMeta = pageMetaById[activePage as keyof typeof pageMetaById] ?? pageMetaById.search;

  if (!document.querySelector('.user-data')) {
    // User is not logged in.
    return null;
  }

  return (
    <div
      className={`fset-shell${store.isOpen ? ' fset-shell--open' : ''}${isFullscreen ? ' fset-shell--fullscreen' : ''}`}
    >
      {store.isOpen ? (
        <div id="fset-tools-menu">
          <div className="fset-tools-menu__frame">
            <Navigation
              activePageId={activePage}
              items={[
                { label: 'Overview', pageId: 'search' },
                // { label: 'Assignments', pageId: 'assignments' },
                // { label: 'Aircraft', pageId: 'aircraft' },
                // ...(hasDebugPage ? [{ label: `Debug: ${matchingSiteEnhancer.debugLabel}`, pageId: 'debug' }] : []),
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
